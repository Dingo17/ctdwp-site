/* =========================================================
   Site accounts (username + password, no email)
   Talks to Supabase through the functions in supabase/setup.sql.
   One account works across the whole site; Dingobet uses it for
   the wallet, bets and the leaderboard.
   ========================================================= */
const CTD_SB = {
  url: "https://fakkdoqaeqxupnwecrho.supabase.co",
  key: "sb_publishable_7d2NNxo6OfN9UqIi50lS4Q_D86OjYQG"
};
const AC = { token:null, me:null, ready:false, offline:false, v:0, board:null, boardAt:0, busy:false };
const AC_TOKEN="ctdwp.session", AC_DEVICE="ctdwp.device";

const AC_MSG = {
  username_taken:"That username is already taken.",
  bad_username:"Usernames are 3–16 letters, numbers or underscores.",
  bad_password:"Passwords need at least 6 characters.",
  bad_login:"Wrong username or password.",
  locked:"Too many wrong tries. Wait 15 minutes and try again.",
  too_many_signups:"Lots of people are signing up right now. Try again in a minute.",
  not_logged_in:"You've been logged out. Please log in again.",
  no_funds:"Not enough Dingo Dollars.",
  already_claimed:"You've already claimed today's bonus.",
  boost_cap:"Boosts are capped at D$50.",
  not_admin:"Only the site admin can do that.",
  no_such_user:"No account with that username.",
  offline:"Can't reach the accounts server right now. Check your connection and try again."
};
function acErr(e){ const m=String(e&&e.message||e||""); if(m.startsWith("device_has_account:")) return `This device already has an account (${m.split(":")[1]}). Log in to that one instead.`; return AC_MSG[m]||m||"Something went wrong."; }

async function acRpc(fn, args){
  let r;
  try{ r=await fetch(`${CTD_SB.url}/rest/v1/rpc/${fn}`, {method:"POST", headers:{apikey:CTD_SB.key, "Content-Type":"application/json"}, body:JSON.stringify(args||{})}); }
  catch(e){ throw new Error("offline"); }
  const txt=await r.text(); let j=null; try{ j=txt?JSON.parse(txt):null; }catch(e){}
  if(!r.ok){ const m=(j&&(j.message||j.msg))||("http_"+r.status); if(m==="not_logged_in") acClear(); throw new Error(m); }
  return j;
}
function acDevice(){ try{ let d=localStorage.getItem(AC_DEVICE); if(!d){ d="d-"+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)); localStorage.setItem(AC_DEVICE,d); } return d; }catch(e){ return null; } }
function acSet(token, me){ AC.token=token; AC.me=me; AC.v++; try{ localStorage.setItem(AC_TOKEN, token); }catch(e){} acChanged(); }
function acClear(){ AC.token=null; AC.me=null; AC.v++; try{ localStorage.removeItem(AC_TOKEN); }catch(e){} acChanged(); }
function acUpdate(me){ if(me&&me.username){ AC.me=me; AC.v++; acChanged(); } }
function acChanged(){ if(typeof DBW!=="undefined") DBW=null; acSideRender(); }
const acIn=()=>!!(AC.me&&AC.token);

async function acInit(){
  try{ AC.token=localStorage.getItem(AC_TOKEN); }catch(e){}
  if(AC.token){ try{ AC.me=await acRpc("me",{p_token:AC.token}); AC.v++; }catch(e){ if(e.message==="offline") AC.offline=true; } }
  AC.ready=true; acChanged(); acAfterLoad();
}
// things to do once we know who's here
function acAfterLoad(){ if(typeof render==="function") render(true); acAdminSettle(); }

/* ---------- sidebar button ---------- */
const AC_ICON=`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
function acSideRender(){
  const el=document.getElementById("sideAcct"); if(!el) return;
  el.innerHTML = acIn()
    ? `<a href="#account" class="sa-btn in">${AC_ICON}<span>${esc(AC.me.username)}</span></a>`
    : `<button type="button" class="sa-btn" onclick="acOpen('login')">${AC_ICON}<span>Log In</span></button>`;
}

/* ---------- sign up / log in pop-up ---------- */
function acOpen(mode="login", note=""){
  acClose();
  const d=document.createElement("div"); d.className="ac-modal"; d.id="acModal";
  d.innerHTML=`<div class="ac-box" role="dialog" aria-modal="true" aria-label="Account">
    <button class="ac-x" type="button" onclick="acClose()" aria-label="Close">×</button>
    <div class="ac-logo"><svg data-logo viewBox="0 0 3000 3000" aria-hidden="true"></svg></div>
    <div class="ac-tabs"><button type="button" data-m="login" class="${mode==="login"?"on":""}" onclick="acOpen('login')">Log In</button><button type="button" data-m="signup" class="${mode==="signup"?"on":""}" onclick="acOpen('signup')">Sign Up</button></div>
    ${note?`<p class="ac-note">${esc(note)}</p>`:""}
    <form onsubmit="return acSubmit(event,'${mode}')" autocomplete="on">
      <label>Username<input name="u" autocomplete="username" required minlength="3" maxlength="16" pattern="[A-Za-z0-9_]{3,16}" ${mode==="signup"?'oninput="acCheckName(this)"':""}></label>
      ${mode==="signup"?`<small class="ac-hint" id="acNameHint">3–16 letters, numbers or underscores. This is your name on leaderboards.</small>`:""}
      <label>Password<input name="p" type="password" autocomplete="${mode==="signup"?"new-password":"current-password"}" required minlength="6" maxlength="72"></label>
      ${mode==="signup"?`<label>Confirm password<input name="p2" type="password" autocomplete="new-password" required minlength="6" maxlength="72"></label>`:""}
      <div class="ac-err" id="acErr"></div>
      <button class="ac-go" type="submit">${mode==="signup"?"Create account":"Log in"}</button>
    </form>
    <p class="ac-foot">${mode==="signup"
      ?"No email needed. One account per person. Dingo Dollars aren't real money. Forget your password? Ask the site admin to reset it."
      :`New here? <a href="javascript:void 0" onclick="acOpen('signup')">Create an account</a> to save your Dingobet wallet and join the leaderboard.`}</p>
  </div>`;
  d.addEventListener("click",e=>{ if(e.target===d) acClose(); });
  document.body.appendChild(d); document.body.classList.add("ac-open");
  if(typeof drawLogos==="function") try{ drawLogos(); }catch(e){}
  const lg=d.querySelector("[data-logo]"), src=document.querySelector(".side-logo [data-logo]"); if(lg&&src&&!lg.innerHTML) lg.innerHTML=src.innerHTML;
  setTimeout(()=>{ const i=d.querySelector("input"); if(i) i.focus(); },30);
}
function acClose(){ const d=document.getElementById("acModal"); if(d) d.remove(); document.body.classList.remove("ac-open"); }
document.addEventListener("keydown",e=>{ if(e.key==="Escape") acClose(); });
let acNameT=null;
function acCheckName(inp){
  const h=document.getElementById("acNameHint"), v=inp.value.trim(); clearTimeout(acNameT);
  if(!/^[A-Za-z0-9_]{3,16}$/.test(v)){ h.textContent="3–16 letters, numbers or underscores. This is your name on leaderboards."; h.className="ac-hint"; return; }
  acNameT=setTimeout(async()=>{ try{ const ok=await acRpc("username_available",{p_username:v}); if(inp.value.trim()!==v) return; h.textContent=ok?`✓ ${v} is available`:`✗ ${v} is taken`; h.className="ac-hint "+(ok?"ok":"bad"); }catch(e){} },350);
}
async function acSubmit(ev, mode){
  ev.preventDefault(); if(AC.busy) return false;
  const f=ev.target, u=f.u.value.trim(), p=f.p.value, err=document.getElementById("acErr"), btn=f.querySelector(".ac-go");
  err.textContent="";
  if(mode==="signup" && p!==f.p2.value){ err.textContent="The passwords don't match."; return false; }
  AC.busy=true; btn.disabled=true; btn.textContent=mode==="signup"?"Creating account…":"Logging in…";
  try{
    const r = mode==="signup" ? await acRpc("sign_up",{p_username:u, p_password:p, p_device:acDevice()}) : await acRpc("log_in",{p_username:u, p_password:p});
    if(r&&r.error) throw new Error(r.error);
    acSet(r.token, r.me); acClose(); acAfterLoad();
    acToast(mode==="signup"?`Welcome, ${r.me.username}! Your account is ready.`:`Welcome back, ${r.me.username}.`);
  }catch(e){ err.textContent=acErr(e); btn.disabled=false; btn.textContent=mode==="signup"?"Create account":"Log in"; }
  AC.busy=false; return false;
}
async function acLogout(){ const t=AC.token; acClear(); try{ if(t) await acRpc("log_out",{p_token:t}); }catch(e){} location.hash="#home"; render(); acToast("You're logged out."); }
function acToast(msg){ let t=document.getElementById("acToast"); if(!t){ t=document.createElement("div"); t.id="acToast"; t.className="ac-toast"; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),3000); }

/* ---------- account page ---------- */
function viewAccount(){
  if(!AC.ready) return `${pageHead("My Account")}<div class="pbody"><div class="empty">Loading…</div></div>`;
  if(!acIn()) return `${pageHead("My Account")}<div class="pbody"><div class="ac-page"><section class="ac-card ac-cta">
    <h2>Join the ${esc(typeof compName==="function"?compName():"CTDWP")}</h2>
    <p>Create a free account to keep your Dingobet wallet on every device, go up against everyone else on the leaderboard and (soon) enter tipping. Just a username and password.</p>
    <div class="ac-ctab"><button class="ac-go" onclick="acOpen('signup')">Sign up</button><button class="ac-ghost" onclick="acOpen('login')">Log in</button></div></section></div></div>`;
  const me=AC.me, w=me.wallet, joined=new Date(me.created).toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"});
  const nb=(w.bets||[]).length, won=(w.bets||[]).filter(b=>b.status==="won").length;
  return `${pageHead("My Account")}<div class="pbody"><div class="ac-page">
    <section class="ac-card ac-prof"><div class="ac-av">${esc(me.username.slice(0,1).toUpperCase())}</div>
      <div><h2>${esc(me.username)}${me.is_admin?' <span class="ac-tag">Admin</span>':""}</h2><small>Member since ${joined}</small></div>
      <button class="ac-ghost" onclick="acLogout()">Log out</button></section>
    <section class="ac-card"><h3>Dingobet</h3><div class="ac-stats">
      <div><small>Balance</small><b>${dbMoney(+w.balance)}</b></div><div><small>Bets placed</small><b>${nb}</b></div><div><small>Bets won</small><b>${won}</b></div><div><small>Badges</small><b>${Object.keys(w.badges||{}).length}</b></div></div>
      <a class="ac-link" href="#dingobet-bets">My bets ›</a> <a class="ac-link" href="#dingobet-board">Leaderboard ›</a></section>
    <section class="ac-card"><h3>Tipping</h3><p class="ac-muted">Coming soon. Your account will be ready for it.</p></section>
    <section class="ac-card"><h3>Change password</h3>
      <form class="ac-form" onsubmit="return acChangePw(event)"><input type="text" name="u" value="${esc(me.username)}" autocomplete="username" hidden>
        <label>Current password<input name="o" type="password" autocomplete="current-password" required></label>
        <label>New password<input name="n" type="password" autocomplete="new-password" minlength="6" maxlength="72" required></label>
        <div class="ac-err" id="acPwErr"></div><button class="ac-go" type="submit">Update password</button></form></section>
    ${me.is_admin?`<section class="ac-card" id="acAdmin"><h3>Admin</h3><p class="ac-muted">Winning bets are paid out automatically whenever you have the site open while logged in.</p><div id="acAdminBody">Loading accounts…</div></section>`:""}
  </div></div>`;
}
async function acChangePw(ev){ ev.preventDefault(); const f=ev.target, e=document.getElementById("acPwErr"); e.textContent="";
  try{ await acRpc("change_password",{p_token:AC.token,p_old:f.o.value,p_new:f.n.value}); f.reset(); acToast("Password updated."); }catch(x){ e.textContent=acErr(x); } return false; }

/* admin panel */
async function acAdminLoad(){
  const el=document.getElementById("acAdminBody"); if(!el||!acIn()||!AC.me.is_admin) return;
  try{ const list=await acRpc("admin_accounts",{p_token:AC.token});
    el.innerHTML=`<div class="ac-adm"><table><thead><tr><th>Username</th><th>Joined</th><th>Last seen</th><th>Balance</th><th></th></tr></thead><tbody>${list.map(a=>`<tr>
      <td><b>${esc(a.username)}</b>${a.is_admin?' <span class="ac-tag">Admin</span>':""}</td><td>${new Date(a.created).toLocaleDateString("en-AU")}</td><td>${a.last_seen?new Date(a.last_seen).toLocaleDateString("en-AU"):"–"}</td><td>${dbMoney(+a.balance)}</td>
      <td class="ac-acts">${a.is_admin?"":`<button onclick="acAdminPw('${esc(a.username)}')">Reset password</button><button class="del" onclick="acAdminDel(this,'${esc(a.username)}')">Delete</button>`}</td></tr>`).join("")}</tbody></table></div>
      <p class="ac-muted">${list.length} account${list.length===1?"":"s"}</p>`;
  }catch(e){ el.textContent=acErr(e); }
}
async function acAdminPw(u){ const p=prompt(`New password for ${u} (6+ characters). Tell them what it is so they can log in and change it.`); if(!p) return;
  try{ await acRpc("admin_reset_password",{p_token:AC.token,p_username:u,p_new:p}); acToast(`Password reset for ${u}.`); }catch(e){ acToast(acErr(e)); } }
async function acAdminDel(btn,u){ if(!btn.dataset.armed){ btn.dataset.armed="1"; btn.textContent="Tap again to delete"; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent="Delete"; } },4000); return; }
  try{ await acRpc("admin_delete_account",{p_token:AC.token,p_username:u}); acToast(`${u} deleted.`); acAdminLoad(); }catch(e){ acToast(acErr(e)); } }

/* the admin's browser pays out finished bets for everyone */
let acSettleAt=0;
async function acAdminSettle(force){
  if(!acIn()||!AC.me.is_admin||typeof dbLegResult!=="function") return;
  if(!force && Date.now()-acSettleAt<60000) return; acSettleAt=Date.now();
  try{
    const open=await acRpc("admin_open_bets",{p_token:AC.token}), ups=[];
    open.forEach(b=>{ const r=dbBetOutcome(b); if(r) ups.push({id:b.id, status:r.status, ret:r.ret, legRes:r.legRes}); });
    if(ups.length){ const n=await acRpc("admin_settle",{p_token:AC.token,p_updates:ups}); acUpdate(await acRpc("me",{p_token:AC.token})); if(n) acToast(`💸 ${n} bet${n>1?"s":""} settled for the punters.`); if(typeof render==="function") render(true); }
  }catch(e){}
}

/* leaderboard of real accounts */
async function acBoard(force){
  if(!force && AC.board && Date.now()-AC.boardAt<30000) return AC.board;
  try{ AC.board=await acRpc("leaderboard",{}); AC.boardAt=Date.now(); }catch(e){ if(!AC.board) AC.board=null; }
  return AC.board;
}

/* hook into page renders */
document.addEventListener("DOMContentLoaded",()=>{ acSideRender(); });
window.addEventListener("hashchange",()=>{ setTimeout(()=>{ if(location.hash==="#account") acAdminLoad(); acAdminSettle(); },0); });
