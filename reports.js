/* =========================================================
   MATCH REPORTS   #report-<match id>
   Written automatically for every completed game from the results:
   form and
   streaks, head-to-head history, records, and what the result means
   (ladder, finals, series, rankings).
   ========================================================= */
const RP_NUM=["zero","one","two","three","four","five","six","seven","eight","nine","ten"];
const rpNum=n=>n<=10?RP_NUM[n]:String(n);
const RP_ORD=["","first","second","third","fourth","fifth","sixth","seventh","eighth","ninth","tenth"];
const rpOrd=n=>n<=10?RP_ORD[n]:ordinal(n);
const rpPoss=s=>s.endsWith("s")?s+"'":s+"'s";
function rpPick(arr, seed){ return arr[dbHash(String(seed))%arr.length]; }
function rpWhen(g){   // "Round 11 of Season 13", "the Season 13 Grand Final", "Game 3 of the Season 13 State of Origin series"…
  const r=g.r, m=g.m, S=`Season ${g.sid}`;
  if(g.c==="draw") return r.finals ? (r.name==="Grand Final"?`the ${S} Grand Final`:`${m.label?"a "+m.label.toLowerCase():"the finals"} in ${S}`) : `${r.name} of ${S}`;
  if(g.c==="origin") return `${m.label||"a game"} of the ${S} State of Origin series`;
  if(g.c==="intl"){ const comp=m.group||"International Series"; return r.isFinal?`the ${S} ${comp} Final`:`${r.name} of the ${S} ${comp}`; }
  if(g.c==="rlwc") return r.isFinal&&/^final$/i.test(r.name)?`the ${S} World Cup Final`:r.isFinal?`the ${S} World Cup ${r.name.replace(/s$/,"").toLowerCase()}`:`${r.name} of the ${S} World Cup`;
  if(g.c==="test"){ const mm=(m.label||"").match(/^(.*?)\s*-\s*(Game \d+)$/); return mm?`${mm[2]} of the ${S} ${mm[1]}`:`a ${S} Test`; }
  if(g.c==="allstars") return `the ${S} All Stars clash`;
  if(g.c==="wcc") return `the ${S} World Club Challenge`;
  return `${r.name} of ${S}`;
}
function rpCompName(c){ const x=MC_COMP[c]; return x?x.name():""; }
function viewReport(mid){
  const g=dbMatch(mid);
  if(!g || !played(g.m)) return `${pageHead("Match Report")}<div class="pbody"><div class="empty">${g?"This game hasn't been played yet.":"Match not found."}</div></div>`;
  const {c,s,r,m,ri}=g, H=m.home, A=m.away, kh=mcKey(H), ka=mcKey(A), nH=team(H).nick, nA=team(A).nick;
  const fam=mcFamily(c), idx=fam.findIndex(x=>x.m===m), hist=fam.slice(0,idx+1).filter(x=>played(x.m));
  const margin=Math.abs(m.hs-m.as), total=m.hs+m.as, draw=m.hs===m.as;
  const W=draw?null:(m.hs>m.as?H:A), L=draw?null:(W===H?A:H), nW=W?team(W).nick:"", nL=L?team(L).nick:"";
  const ws=W===H?m.hs:m.as, ls=W===H?m.as:m.hs, isFin=!!(r.finals||r.isFinal), venue=venueOf(m);
  // "the Raiders", "the Blues", "the Kangaroos", "the Māori All Stars" — but "England", "Tonga XIII", "Wigan Warriors"
  const T=x=>{ const tm=team(x); if(c==="allstars") return "the "+tm.name; if(CLUB_BG[x]||["NSW","QLD","AUS","NZL"].includes(x)) return "the "+tm.nick; return tm.nick; };
  const Tc=x=>{ const t=T(x); return t.charAt(0).toUpperCase()+t.slice(1); };
  const P=[];   // paragraphs

  // ---- expectation (pre-game model)
  let pW=null, priceW=null;
  try{ const pr=dbGamePred({...g, fam:DB_FAMC[c]}); const pH=pr.manual?(1/pr.manual.oh)/((1/pr.manual.oh)+(1/pr.manual.oa)):dbPhi(pr.e/pr.sdM);
    if(W){ pW=W===H?pH:1-pH; priceW=pr.manual?(W===H?pr.manual.oh:pr.manual.oa):dbPrice(pW,DB.OVER.two); } else pW=pH; }catch(e){}

  // ---- headline
  const upset=W&&pW!=null&&pW<0.38;
  let headline;
  if(draw) headline=rpPick([`${nH} and ${nA} can't be split`,`Honours even as ${nH} and ${nA} draw ${m.hs}-all`],mid);
  else if(c==="draw"&&r.name==="Grand Final") headline=`${nW} are the Season ${s.id} premiers`;
  else if(isFin&&g.r.isFinal&&r.intl) headline=`${nW} win the ${m.group||rpCompName(c)} final`;
  else if(upset) headline=rpPick([`Upset! ${nW} stun ${nL}`,`${nW} defy the odds to beat ${nL}`,`Shock result as ${nW} topple ${nL}`],mid);
  else if(margin>=36) headline=rpPick([`${nW} demolish ${nL} by ${margin}`,`${nW} run riot against ${nL}`],mid);
  else if(margin>=24) headline=rpPick([`${nW} thrash ${nL}`,`${nW} too good for ${nL} in ${ws}-${ls} rout`],mid);
  else if(margin>=13) headline=rpPick([`${nW} account for ${nL}`,`${nW} pull away from ${nL}`,`Comfortable win for ${nW} over ${nL}`],mid);
  else if(margin>=7) headline=rpPick([`${nW} get the job done against ${nL}`,`${nW} beat ${nL} ${ws}-${ls}`,`${nW} hold off ${nL}`],mid);
  else if(margin>=3) headline=rpPick([`${nW} survive a scare from ${nL}`,`${nW} edge ${nL} in a tight one`],mid);
  else headline=rpPick([`${nW} win a thriller by ${margin}`,`${nW} pip ${nL} in a nail-biter`,`Heartbreak for ${nL} as ${nW} sneak home`],mid);

  // ---- lead paragraph
  const where = venue?` at ${esc(venue)}`:"";
  const when = rpWhen({...g, sid:s.id});
  const verb = margin>=36?"demolished":margin>=24?"thrashed":margin>=13?"comfortably beat":margin>=7?"beat":margin>=3?"held off":"edged";
  if(draw) P.push(`${Tc(H)} and ${T(A)} couldn't be separated${where}, drawing ${m.hs}-${m.as} in ${when}.`);
  else P.push(`${Tc(W)} ${verb} ${T(L)} ${ws}-${ls}${where} in ${when}${W===A&&c!=="origin"&&!r.intl?", winning away from home":""}.`.replace(", winning away from home", (W===A && !isFin && (team(H).grounds||[]).includes(venue)) ? ", winning away from home" : ""));

  // ---- form and streaks
  const streak=(k)=>{ const gs=hist.filter(x=>mcHas(x,k)); let n=0, last=null; for(let i=gs.length-1;i>=0;i--){ const res=mcRes(gs[i],k); if(last==null) last=res; if(res===last) n++; else break; } return {n,res:last}; };
  const prevStreak=(k)=>{ const gs=hist.filter(x=>mcHas(x,k)); gs.pop(); let n=0,last=null; for(let i=gs.length-1;i>=0;i--){ const res=mcRes(gs[i],k); if(last==null) last=res; if(res===last) n++; else break; } return {n,res:last}; };
  if(W){
    const sw=streak(mcKey(W)), sl=streak(mcKey(L)), pw=prevStreak(mcKey(W)), pl=prevStreak(mcKey(L));
    const bits=[];
    if(pw.res==="L"&&pw.n>=3) bits.push(`snapped a ${rpNum(pw.n)}-game losing run for ${T(W)}`);
    else if(sw.n>=3) bits.push(`made it ${rpNum(sw.n)} wins in a row for ${T(W)}`);
    if(pl.res==="W"&&pl.n>=3) bits.push(`ended ${rpPoss(T(L))} ${rpNum(pl.n)}-game winning streak`);
    else if(sl.n>=3) bits.push(`left ${T(L)} with ${rpNum(sl.n)} straight losses`);
    if(bits.length) P.push(`The result ${bits.join(" and ")}.`);
  }

  // ---- head to head
  const h2h=hist.filter(x=>mcHas(x,kh)&&mcHas(x,ka));
  const hw=h2h.filter(x=>mcRes(x,kh)==="W").length, aw=h2h.filter(x=>mcRes(x,ka)==="W").length, hd=h2h.length-hw-aw;
  if(W && h2h.length>1){
    const kW=mcKey(W), kL=mcKey(L), wWins=W===H?hw:aw, lWins=W===H?aw:hw;
    const prevW=h2h.slice(0,-1).filter(x=>mcRes(x,kW)==="W");
    let t=`It was ${rpPoss(T(W))} ${ordinal(wWins)} win over ${T(L)} in ${h2h.length} meetings`.replace(/^It was (.*?) (\d+)(st|nd|rd|th) win/,(x,a,n)=>`It was ${a} ${rpOrd(+n)} win`);
    if(!prevW.length) t=`It was ${rpPoss(T(W))} first ever win over ${T(L)}, at the ${ordinal(h2h.length)} attempt`;
    else { const lastW=prevW[prevW.length-1]; if(lastW.sid<g.sid-1) t+=`, and their first against them since Season ${lastW.sid}`; }
    P.push(t+`. The head-to-head now stands at ${Math.max(wWins,lWins)}-${Math.min(wWins,lWins)}${hd?` with ${hd} draw${hd>1?"s":""}`:""}${wWins>lWins?` in ${rpPoss(T(W))} favour`:wWins<lWins?` in ${rpPoss(T(L))} favour`:""}.`);
  } else if(h2h.length===1 && W) P.push(`It was the first ever meeting between the two sides.`);

  // ---- records
  const seasonGames=hist.filter(x=>x.c===g.c&&x.sid===g.sid);
  const recs=[];
  const big=f=>({ever:f(g)>=Math.max(...hist.map(f)), season:f(g)>=Math.max(...seasonGames.map(f))});
  const scope=MC_FAMILY[c].length>1?"in international history":`in ${rpCompName(c)} history`;
  const mg=x=>Math.abs(x.m.hs-x.m.as), hi=x=>Math.max(x.m.hs,x.m.as), tt=x=>x.m.hs+x.m.as;
  if(W){ const b=big(mg); if(b.ever&&hist.length>seasonGames.length) recs.push(`the biggest winning margin ${scope}`); else if(b.season&&seasonGames.length>3) recs.push(`the biggest win of ${s.name}`); }
  { const b=big(tt); if(b.ever&&hist.length>seasonGames.length) recs.push(`the highest-scoring game ${scope}`); else if(b.season&&seasonGames.length>3) recs.push(`the highest-scoring game of ${s.name}`); }
  if(recs.length) P.push(`It was ${recs.join(", and ")}.`);
  if(total<=12) P.push(`Points were at a premium, with just ${total} scored all game.`);

  // ---- implications
  const IMP=[];
  const reg=r.rep?[]:regularIdx(s);
  if(c==="draw" && !r.finals){
    const k=reg.indexOf(ri), pre=x=>k>0?mcLad(c,s,x,reg[k-1]):null, post=x=>mcLad(c,s,x,ri);
    const line=x=>{ const a=pre(x), b=post(x); if(!b) return ""; const nm=Tc(x);
      if(!a) return `${nm} sit ${ordinal(b.pos)}.`;
      if(b.pos<a.pos) return `${nm} climb from ${ordinal(a.pos)} to ${ordinal(b.pos)}.`;
      if(b.pos>a.pos) return `${nm} slip from ${ordinal(a.pos)} to ${ordinal(b.pos)}.`;
      return `${nm} stay ${ordinal(b.pos)}.`; };
    const last=k===reg.length-1, left=reg.length-1-k;
    IMP.push(`${line(W||H)} ${line(L||A)}`);
    const bW=post(W||H), bL=post(L||A);
    if(last){ [W||H,L||A].forEach(x=>{ const b=post(x); if(!b) return; IMP.push(b.pos===1?`${Tc(x)} finish the regular season as minor premiers.`:b.pos===b.n?`${Tc(x)} finish last and take the wooden spoon.`:b.pos<=8?`${Tc(x)} finish ${ordinal(b.pos)} and head into the finals.`:`${Tc(x)} finish ${ordinal(b.pos)}, missing the finals.`); }); }
    else if(left<=4 && bW && bL){ [W||H,L||A].forEach(x=>{ const b=post(x); IMP.push(b.pos<=8?`With ${left} round${left>1?"s":""} left, ${T(x)} are inside the top eight on ${b.row.Pts} points.`:`With ${left} round${left>1?"s":""} left, ${T(x)} are outside the top eight, ${ordinal(b.pos)} on ${b.row.Pts} points.`); }); }
  }
  if(c==="draw" && r.finals && W){
    const wk=r.name;
    if(/grand final/i.test(wk)){ const n=(honoursAll().find(x=>/GRAND FINAL WINNERS/i.test(x.title))||{rows:[]}).rows.filter(x=>x.s<=s.id&&gfWinner(x.text)===W).length;
      IMP.push(`${Tc(W)} are premiers${n>1?` for the ${rpOrd(n)} time`:n===1?" for the first time":""}. ${Tc(L)} finish as runners-up.`); }
    else if(/week 3/i.test(wk)) IMP.push(`${Tc(W)} are into the Grand Final. ${rpPoss(Tc(L))} season is over.`);
    else if(/week 2/i.test(wk)) IMP.push(`${Tc(W)} advance to the preliminary finals. ${Tc(L)} are eliminated.`);
    else if(/week 1/i.test(wk)){ const lad=computeLadder(s, reg[reg.length-1]).map(x=>x.code); const top4=lad.indexOf(W)<4&&lad.indexOf(L)<4;
      IMP.push(top4?`${Tc(W)} earn a week off and a home preliminary final. ${Tc(L)} get a second chance in the semi-finals.`:`${Tc(W)} survive to the semi-finals. ${rpPoss(Tc(L))} season is over.`); }
  }
  if(r.rep || c==="origin"){
    const all=m.series?r.matches.filter(x=>x.series===m.series):r.matches, pos=all.indexOf(m);
    if(all.length>1){ const gms=all.slice(0,pos+1).filter(played);
      const w1=gms.filter(x=>(x.home===H?x.hs>x.as:x.as>x.hs)).length, w2=gms.filter(x=>(x.home===A?x.hs>x.as:x.as>x.hs)).length, left=all.length-pos-1;
      const lead=w1>w2?H:w2>w1?A:null, hiW=Math.max(w1,w2), loW=Math.min(w1,w2);
      IMP.push(!lead?`The series is level at ${w1}-${w2}.`:hiW>loW+left?`${Tc(lead)} ${left?"wrap up":"win"} the series ${hiW}-${loW}.`:`${Tc(lead)} lead the series ${hiW}-${loW}${left?` with ${left} to play`:""}.`); }
  }
  if(r.intl && !r.isFinal && m.group){
    const post=x=>mcLad(c,s,x,ri); const a=post(H), b=post(A);
    if(a&&b) IMP.push(`In the ${m.group}, ${T(H)} are ${ordinal(a.pos)} and ${T(A)} ${ordinal(b.pos)} after this round.`);
  }
  if(r.intl && r.isFinal && W) IMP.push(`${Tc(W)} are the ${s.name} ${m.group||rpCompName(c)} champions.`);
  // IRL ranking points
  // power rankings (premiership)
  if(c==="draw"){ try{ const PS=pwrBuild().seasons.find(x=>x.id===s.id); const si=PS.snaps.findIndex(x=>x.ri===ri);
      if(si>0 && PS.snaps[si-1].rows[0].e!==PS.snaps[si-1].rows[PS.snaps[si-1].rows.length-1].e){ const a=PS.snaps[si-1], b=PS.snaps[si], mv=x=>{ const d=a.rank[x]-b.rank[x]; return d>0?`up ${d} to ${ordinal(b.rank[x])}`:d<0?`down ${-d} to ${ordinal(b.rank[x])}`:`hold ${ordinal(b.rank[x])}`; };
        IMP.push(`In the <a href="#power-${s.id}-${si}">Power Rankings</a>, ${T(W||H)} ${mv(W||H).startsWith("hold")?"":"move "}${mv(W||H)} and ${T(L||A)} ${mv(L||A).startsWith("hold")?"":"move "}${mv(L||A)}.`); } }catch(e){} }

  // ---- by the numbers
  const rec=x=>{ const gs=hist.filter(y=>y.c===g.c&&y.sid===g.sid&&mcHas(y,mcKey(x))); const w=gs.filter(y=>mcRes(y,mcKey(x))==="W").length, l=gs.filter(y=>mcRes(y,mcKey(x))==="L").length, d=gs.length-w-l; return `${w}-${l}${d?"-"+d:""}`; };
  const nums=`<div class="rp-nums">
    <div><b>${margin}</b><span>Margin</span></div><div><b>${total}</b><span>Total points</span></div>
    <div><b>${hw}-${aw}${hd?"-"+hd:""}</b><span>All-time H2H (${esc(nH)} first)</span></div>
    <div><b>${rec(H)} / ${rec(A)}</b><span>${esc(s.name)} records</span></div>
    <div><b>${esc(venue.split(",")[0]||"–")}</b><span>Venue</span></div></div>`;

  // ---- card + more from the round
  let card=matchHtml(m,g.mi,r).replace(/ data-mid="[^"]*" onclick="[^"]*"/,"").replace(/<div class="m-btns">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>$/,'</div></div>');
  const others=r.matches.map((x,i)=>({x,i})).filter(o=>o.x!==m&&played(o.x)&&o.x.mid);
  const more=others.length?`<section class="mc-card rp-more"><h3 class="mc-h">More from ${esc(r.rep?(m.series||r.name):r.name)}</h3>${others.map(o=>`<a href="#report-${o.x.mid}">${logo(o.x.home,"sm")}<span>${esc(team(o.x.home).nick)}</span><b>${o.x.hs} – ${o.x.as}</b><span>${esc(team(o.x.away).nick)}</span>${logo(o.x.away,"sm")}</a>`).join("")}</section>`:"";
  const back = r.rep ? `${c}-${s.id}` : `${c}-${s.id}-${ri+1}`;
  const themeCol = (r.finals||r.isFinal) ? FINALS_COLOUR : r.theme ? THEME_COLOURS[r.theme.trim().toLowerCase()] : null;
  return `<div class="draw-page"${themeCol?` style="--accent:${themeCol}"`:""}>${pageHead("Match Report")}<div class="pbody rp-page">
    <a class="back" href="#${back}">‹ Back to Draw</a>
    <article class="rp">
      <div class="rp-kicker">${esc(rpCompName(c))} · ${esc(s.name)}${r.theme?` · ${esc(r.theme)}`:""}</div>
      <h1>${esc(headline)}</h1>
      ${card}
      <div class="rp-body">${P.map(p=>`<p>${p}</p>`).join("")}
        ${IMP.filter(Boolean).length?`<h2>What it means</h2>${IMP.filter(Boolean).map(p=>`<p>${p}</p>`).join("")}`:""}</div>
      <h2 class="rp-h">By the numbers</h2>${nums}
      <div class="rp-cta"><a class="m-btn fill" href="#match-${mid}">Match Stats</a></div>
    </article>${more}</div></div>`;
}
