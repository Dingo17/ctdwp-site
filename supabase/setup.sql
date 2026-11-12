-- =====================================================================
--  CTDWP site accounts + Dingobet  (run once in Supabase → SQL Editor)
--  Username + password accounts (no email). Everything goes through the
--  functions below; the tables themselves are locked to the public.
--  Safe to run again: it only creates what's missing and refreshes the
--  functions.
-- =====================================================================

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

-- ---------- settings ----------------------------------------------------
create table if not exists public.app_settings (
  id            int primary key default 1 check (id = 1),
  admin_username text not null default 'Dingo17',   -- this account is the site admin
  start_balance numeric(14,2) not null default 1000,
  daily_bonus   numeric(14,2) not null default 100
);
insert into public.app_settings (id) values (1) on conflict (id) do nothing;

-- ---------- tables ------------------------------------------------------
create table if not exists public.accounts (
  id           uuid primary key default gen_random_uuid(),
  username     text not null,
  pass_hash    text not null,
  is_admin     boolean not null default false,
  device       text,
  created_at   timestamptz not null default now(),
  last_seen    timestamptz,
  failed       int not null default 0,
  locked_until timestamptz
);
create unique index if not exists accounts_username_lower on public.accounts (lower(username));

create table if not exists public.sessions (
  token_hash text primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

create table if not exists public.wallets (
  account_id uuid primary key references public.accounts(id) on delete cascade,
  balance    numeric(14,2) not null default 1000,
  daily      date,
  resets     int not null default 0,
  bonus      numeric(14,2) not null default 0,
  extras     jsonb not null default '{}'::jsonb      -- badges, tickets, ballot
);

create table if not exists public.bets (
  id         bigint generated always as identity primary key,
  account_id uuid not null references public.accounts(id) on delete cascade,
  placed_at  timestamptz not null default now(),
  stake      numeric(14,2) not null check (stake > 0),
  price      numeric(12,2) not null check (price >= 1),
  legs       jsonb not null,
  status     text not null default 'open' check (status in ('open','won','lost','void')),
  ret        numeric(14,2) not null default 0,
  leg_res    jsonb,
  settled_at timestamptz
);
create index if not exists bets_account on public.bets (account_id);
create index if not exists bets_open on public.bets (status) where status = 'open';

-- lock the tables: only the functions below can touch them
alter table public.app_settings enable row level security;
alter table public.accounts     enable row level security;
alter table public.sessions     enable row level security;
alter table public.wallets      enable row level security;
alter table public.bets         enable row level security;
revoke all on public.app_settings, public.accounts, public.sessions, public.wallets, public.bets from anon, authenticated, public;

-- ---------- helpers (not callable from the site) ------------------------
create or replace function public._hash_token(p_token text) returns text
language sql immutable set search_path = public, extensions as $$
  select encode(extensions.digest(coalesce(p_token,''), 'sha256'), 'hex')
$$;

create or replace function public._auth(p_token text) returns uuid
language plpgsql security definer set search_path = public, extensions as $$
declare v uuid;
begin
  select s.account_id into v from public.sessions s
   where s.token_hash = public._hash_token(p_token) and s.expires_at > now();
  if v is null then raise exception 'not_logged_in'; end if;
  update public.accounts set last_seen = now() where id = v and (last_seen is null or last_seen < now() - interval '5 minutes');
  return v;
end $$;

create or replace function public._is_admin(p_uid uuid) returns boolean
language sql security definer set search_path = public as $$
  select coalesce((select is_admin from public.accounts where id = p_uid), false)
$$;

create or replace function public._new_session(p_uid uuid) returns text
language plpgsql security definer set search_path = public, extensions as $$
declare t text := encode(extensions.gen_random_bytes(32), 'hex');
begin
  insert into public.sessions (token_hash, account_id, expires_at)
  values (public._hash_token(t), p_uid, now() + interval '180 days');
  delete from public.sessions where account_id = p_uid and expires_at < now();
  return t;
end $$;

create or replace function public._bet_json(b public.bets) returns jsonb
language sql stable as $$
  select jsonb_build_object(
    'id', b.id::text, 't', (extract(epoch from b.placed_at) * 1000)::bigint,
    'stake', b.stake, 'price', b.price, 'legs', b.legs, 'status', b.status, 'ret', b.ret,
    'legRes', b.leg_res,
    'settled', case when b.settled_at is null then null else (extract(epoch from b.settled_at) * 1000)::bigint end)
$$;

create or replace function public._me(p_uid uuid) returns jsonb
language sql security definer set search_path = public as $$
  select jsonb_build_object(
    'username', a.username, 'is_admin', a.is_admin,
    'created', (extract(epoch from a.created_at) * 1000)::bigint,
    'wallet', jsonb_build_object(
       'balance', w.balance, 'daily', w.daily, 'resets', w.resets, 'bonus', w.bonus,
       'today', (now() at time zone 'Australia/Sydney')::date,
       'badges', coalesce(w.extras->'badges', '{}'::jsonb),
       'tickets', coalesce(w.extras->'tickets', '[]'::jsonb),
       'ballot', coalesce(w.extras->'ballot', '{}'::jsonb),
       'bets', coalesce((select jsonb_agg(public._bet_json(b) order by b.placed_at) from public.bets b where b.account_id = a.id), '[]'::jsonb)))
  from public.accounts a join public.wallets w on w.account_id = a.id
  where a.id = p_uid
$$;

-- ---------- accounts ----------------------------------------------------
create or replace function public.username_available(p_username text) returns boolean
language sql security definer set search_path = public as $$
  select not exists (select 1 from public.accounts where lower(username) = lower(trim(p_username)))
$$;

create or replace function public.sign_up(p_username text, p_password text, p_device text default null) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare u text := trim(p_username); uid uuid; existing text; s public.app_settings;
begin
  if u !~ '^[A-Za-z0-9_]{3,16}$' then raise exception 'bad_username'; end if;
  if length(coalesce(p_password,'')) < 6 or length(p_password) > 72 then raise exception 'bad_password'; end if;
  if not public.username_available(u) then raise exception 'username_taken'; end if;
  if p_device is not null and length(p_device) between 8 and 80 then
    select username into existing from public.accounts where device = p_device limit 1;
    if existing is not null then raise exception 'device_has_account:%', existing; end if;
  end if;
  if (select count(*) from public.accounts where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'too_many_signups';
  end if;
  select * into s from public.app_settings where id = 1;
  insert into public.accounts (username, pass_hash, device, is_admin)
  values (u, extensions.crypt(p_password, extensions.gen_salt('bf', 8)), nullif(p_device,''), lower(u) = lower(s.admin_username))
  returning id into uid;
  insert into public.wallets (account_id, balance) values (uid, s.start_balance);
  return jsonb_build_object('token', public._new_session(uid), 'me', public._me(uid));
end $$;

create or replace function public.log_in(p_username text, p_password text) returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare a public.accounts;
begin
  select * into a from public.accounts where lower(username) = lower(trim(p_username));
  -- wrong details return an error instead of raising, so the failed-attempt count is kept
  if a.id is null then return jsonb_build_object('error', 'bad_login'); end if;
  if a.locked_until is not null and a.locked_until > now() then return jsonb_build_object('error', 'locked'); end if;
  if a.pass_hash <> extensions.crypt(coalesce(p_password,''), a.pass_hash) then
    update public.accounts set failed = case when failed + 1 >= 8 then 0 else failed + 1 end,
      locked_until = case when failed + 1 >= 8 then now() + interval '15 minutes' else locked_until end
    where id = a.id;
    return jsonb_build_object('error', 'bad_login');
  end if;
  update public.accounts set failed = 0, locked_until = null, last_seen = now() where id = a.id;
  return jsonb_build_object('token', public._new_session(a.id), 'me', public._me(a.id));
end $$;

create or replace function public.log_out(p_token text) returns void
language sql security definer set search_path = public as $$
  delete from public.sessions where token_hash = public._hash_token(p_token)
$$;

create or replace function public.me(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
begin return public._me(public._auth(p_token)); end $$;

create or replace function public.change_password(p_token text, p_old text, p_new text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid := public._auth(p_token); h text;
begin
  select pass_hash into h from public.accounts where id = uid;
  if h <> extensions.crypt(coalesce(p_old,''), h) then raise exception 'bad_login'; end if;
  if length(coalesce(p_new,'')) < 6 or length(p_new) > 72 then raise exception 'bad_password'; end if;
  update public.accounts set pass_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 8)) where id = uid;
  delete from public.sessions where account_id = uid and token_hash <> public._hash_token(p_token);
end $$;

-- ---------- Dingobet wallet ----------------------------------------------
create or replace function public.place_bets(p_token text, p_bets jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token); b jsonb; total numeric := 0; bal numeric; st numeric; pr numeric;
begin
  if jsonb_typeof(p_bets) <> 'array' or jsonb_array_length(p_bets) = 0 or jsonb_array_length(p_bets) > 30 then raise exception 'bad_bets'; end if;
  for b in select * from jsonb_array_elements(p_bets) loop
    st := round((b->>'stake')::numeric, 2); pr := round((b->>'price')::numeric, 2);
    if st is null or st <= 0 or st > 1000000 then raise exception 'bad_stake'; end if;
    if pr is null or pr < 1.01 or pr > 100001 then raise exception 'bad_price'; end if;
    if jsonb_typeof(b->'legs') <> 'array' or jsonb_array_length(b->'legs') = 0 or length((b->'legs')::text) > 20000 then raise exception 'bad_legs'; end if;
    if exists (select 1 from jsonb_array_elements(b->'legs') l where (l->>'boost')::boolean) and st > 50 then raise exception 'boost_cap'; end if;
    total := total + st;
  end loop;
  select balance into bal from public.wallets where account_id = uid for update;
  if total > bal then raise exception 'no_funds'; end if;
  for b in select * from jsonb_array_elements(p_bets) loop
    insert into public.bets (account_id, stake, price, legs)
    values (uid, round((b->>'stake')::numeric, 2), round((b->>'price')::numeric, 2), b->'legs');
  end loop;
  update public.wallets set balance = balance - total where account_id = uid;
  return public._me(uid);
end $$;

create or replace function public.claim_daily(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token); today date := (now() at time zone 'Australia/Sydney')::date; d numeric;
begin
  select daily_bonus into d from public.app_settings where id = 1;
  update public.wallets set balance = balance + d, bonus = bonus + d, daily = today
   where account_id = uid and (daily is null or daily < today);
  if not found then raise exception 'already_claimed'; end if;
  return public._me(uid);
end $$;

create or replace function public.reset_wallet(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token);
begin
  delete from public.bets where account_id = uid;
  update public.wallets set balance = (select start_balance from public.app_settings where id = 1),
    resets = resets + 1, bonus = 0,
    extras = jsonb_build_object('badges', coalesce(extras->'badges', '{}'::jsonb))
  where account_id = uid;
  return public._me(uid);
end $$;

-- tickets (Get Tickets page): pay with Dingo Dollars
create or replace function public.buy_tickets(p_token text, p_amount numeric, p_item jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token); amt numeric := round(p_amount, 2);
begin
  if amt is null or amt <= 0 or amt > 1000000 or length(p_item::text) > 4000 then raise exception 'bad_amount'; end if;
  update public.wallets set balance = balance - amt,
    extras = jsonb_set(extras, '{tickets}', coalesce(extras->'tickets', '[]'::jsonb) || jsonb_build_array(p_item))
  where account_id = uid and balance >= amt;
  if not found then raise exception 'no_funds'; end if;
  return public._me(uid);
end $$;

-- small things the page keeps for you: badges and ticket ballots
create or replace function public.save_extra(p_token text, p_key text, p_value jsonb) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token);
begin
  if p_key not in ('badges','ballot') or length(coalesce(p_value::text,'')) > 20000 then raise exception 'bad_extra'; end if;
  update public.wallets set extras = jsonb_set(extras, array[p_key], coalesce(p_value, 'null'::jsonb)) where account_id = uid;
end $$;

-- you can settle your own LOSING bets straight away (it only costs you);
-- wins and refunds are paid out by the admin's browser
create or replace function public.settle_losses(p_token text, p_updates jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token); u jsonb;
begin
  for u in select * from jsonb_array_elements(coalesce(p_updates, '[]'::jsonb)) loop
    update public.bets set status = 'lost', ret = 0, leg_res = u->'legRes', settled_at = now()
     where id = (u->>'id')::bigint and account_id = uid and status = 'open';
  end loop;
  return public._me(uid);
end $$;

-- ---------- admin --------------------------------------------------------
create or replace function public.admin_open_bets(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token);
begin
  if not public._is_admin(uid) then raise exception 'not_admin'; end if;
  return coalesce((select jsonb_agg(public._bet_json(b)) from public.bets b where b.status = 'open'), '[]'::jsonb);
end $$;

create or replace function public.admin_settle(p_token text, p_updates jsonb) returns int
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token); u jsonb; b public.bets; r numeric; n int := 0; st text;
begin
  if not public._is_admin(uid) then raise exception 'not_admin'; end if;
  for u in select * from jsonb_array_elements(coalesce(p_updates, '[]'::jsonb)) loop
    select * into b from public.bets where id = (u->>'id')::bigint and status = 'open' for update;
    if b.id is null then continue; end if;
    st := u->>'status';
    if st not in ('won','lost','void') then continue; end if;
    r := case st when 'lost' then 0 when 'void' then b.stake
              else least(greatest(round((u->>'ret')::numeric, 2), 0), round(b.stake * b.price, 2)) end;
    update public.bets set status = st, ret = r, leg_res = u->'legRes', settled_at = now() where id = b.id;
    if r > 0 then update public.wallets set balance = balance + r where account_id = b.account_id; end if;
    n := n + 1;
  end loop;
  return n;
end $$;

create or replace function public.admin_accounts(p_token text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token);
begin
  if not public._is_admin(uid) then raise exception 'not_admin'; end if;
  return coalesce((select jsonb_agg(jsonb_build_object('username', a.username, 'created', a.created_at, 'last_seen', a.last_seen,
      'balance', w.balance, 'is_admin', a.is_admin) order by a.created_at)
    from public.accounts a join public.wallets w on w.account_id = a.id), '[]'::jsonb);
end $$;

create or replace function public.admin_reset_password(p_token text, p_username text, p_new text) returns void
language plpgsql security definer set search_path = public, extensions as $$
declare uid uuid := public._auth(p_token);
begin
  if not public._is_admin(uid) then raise exception 'not_admin'; end if;
  if length(coalesce(p_new,'')) < 6 or length(p_new) > 72 then raise exception 'bad_password'; end if;
  update public.accounts set pass_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 8)), failed = 0, locked_until = null
   where lower(username) = lower(trim(p_username));
  if not found then raise exception 'no_such_user'; end if;
  delete from public.sessions where account_id = (select id from public.accounts where lower(username) = lower(trim(p_username)));
end $$;

create or replace function public.admin_delete_account(p_token text, p_username text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid := public._auth(p_token);
begin
  if not public._is_admin(uid) then raise exception 'not_admin'; end if;
  delete from public.accounts where lower(username) = lower(trim(p_username)) and not is_admin;
  if not found then raise exception 'no_such_user'; end if;
end $$;

-- ---------- public leaderboard -------------------------------------------
create or replace function public.leaderboard() returns jsonb
language sql security definer set search_path = public as $$
  select coalesce(jsonb_agg(row_to_json(x)::jsonb order by x.profit desc, x.username), '[]'::jsonb) from (
    select a.username, w.balance, w.resets,
      coalesce(sum(b.ret - b.stake) filter (where b.status in ('won','lost')), 0) as profit,
      count(*) filter (where b.status = 'won')  as won,
      count(*) filter (where b.status in ('won','lost')) as settled,
      count(*) filter (where b.status = 'open') as open,
      coalesce(sum(b.stake) filter (where b.status = 'open'), 0) as open_stake
    from public.accounts a join public.wallets w on w.account_id = a.id
    left join public.bets b on b.account_id = a.id
    group by a.username, w.balance, w.resets) x
$$;

-- ---------- who may call what ---------------------------------------------
revoke execute on all functions in schema public from public, anon, authenticated;
grant execute on function
  public.username_available(text), public.sign_up(text, text, text), public.log_in(text, text),
  public.log_out(text), public.me(text), public.change_password(text, text, text),
  public.place_bets(text, jsonb), public.claim_daily(text), public.reset_wallet(text),
  public.buy_tickets(text, numeric, jsonb), public.save_extra(text, text, jsonb),
  public.settle_losses(text, jsonb), public.admin_open_bets(text), public.admin_settle(text, jsonb),
  public.admin_accounts(text), public.admin_reset_password(text, text, text), public.admin_delete_account(text, text),
  public.leaderboard()
to anon, authenticated;
