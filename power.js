/* =========================================================
   POWER RANKINGS — the Dingo Power Index (Premiership only)
   ---------------------------------------------------------
   An Elo-style rating that moves after every game:
   - every club starts at 1500 (shown as an index of 50.0)
   - after each game the winner takes points from the loser; how many
     depends on how surprising the result was and the winning margin
   - home teams get a small edge at their own ground
   - between seasons every club drifts a third of the way back to average
   - pre-season nudges from data/dingobet.js (signings etc.) are added
     at the start of the season
   ========================================================= */
const PWR = { K:30, HFA:25, REVERT:0.6, PTS_TO_ELO:13,
  // finals count for more, the Grand Final most of all
  FINALS_K:{ "Finals Week 1":1.5, "Finals Week 2":1.75, "Finals Week 3":2, "Grand Final":3 },
  RECENT:3,        // a club's 3 most recent results count in full...
  DECAY:0.75,      // ...each one further back counts 75% as much as the one after it
  BASE_FADE:0.88,
  FINAL_LOSS:0.35 };// losing a final costs 35% of a normal loss// last season's standing fades a little with every game played
const PWR_TIERS = [
  {max:4,  name:"Premiership Contenders", cls:"t1"},
  {max:8,  name:"Finals Fancies",         cls:"t2"},
  {max:12, name:"In the Hunt",            cls:"t3"},
  {max:15, name:"Work to Do",             cls:"t4"},
  {max:99, name:"Spoon Watch",            cls:"t5"}
];
let PWR_CACHE=null;
const pwrIdx = e => ((e-1500)/10+50);
function pwrAdj(sid){ const a=(window.DINGOBET_ADJUST||{})[sid]||{}; const o={}; Object.entries(a).forEach(([c,v])=>o[c]=Array.isArray(v)?{pts:+v[0],note:v[1]||""}:{pts:+v,note:""}); return o; }
function pwrBuild(){
  if(PWR_CACHE) return PWR_CACHE;
  const R={}, seasons=[], lastSeason=latestSeason();
  const gfDone=(()=>{ const gf=lastSeason.rounds.find(r=>r.finals&&/grand final/i.test(r.name)); return gf && gf.matches.every(played); })();
  const list=SEASONS.map(s=>({s, id:s.id}));
  if(gfDone) list.push({s:null, id:lastSeason.id+1});      // next season: pre-season only
  const champs={}; try{ (honoursAll().find(x=>/GRAND FINAL WINNERS/i.test(x.title))||{rows:[]}).rows.forEach(r=>{ champs[r.s]=gfWinner(r.text); }); }catch(e){}
  list.forEach(({s,id})=>{
    Object.keys(R).forEach(c=>R[c]=1500+(R[c]-1500)*(1-PWR.REVERT));
    const B={}, D={}, bonus={};   // season-start rating, this season's results (newest last), premiers' bump
    const teams = s ? [...new Set(s.rounds.filter(r=>!r.rep).flatMap(r=>r.matches.flatMap(m=>[m.home,m.away])))].filter(c=>c!=="TBC")
                    : Object.keys(CLUB_BG);
    teams.forEach(c=>{ if(R[c]==null) R[c]=1500; });
    const adj=pwrAdj(id), pre={};
    Object.entries(adj).forEach(([c,a])=>{ if(R[c]!=null){ R[c]+=a.pts*PWR.PTS_TO_ELO; pre[c]=a; } });
    teams.forEach(c=>{ B[c]=R[c]; D[c]=[]; bonus[c]=0; });
    // a club's index = its season-start rating (fading as games are played) + its results, newest weighted most
    const calc=c=>{ const ds=D[c], n=ds.length; let s=0; for(let i=0;i<n;i++){ const age=n-1-i; s+=ds[i]*(age<PWR.RECENT?1:Math.pow(PWR.DECAY,age-PWR.RECENT+1)); }
      return 1500+(B[c]-1500)*Math.max(0.25,Math.pow(PWR.BASE_FADE,n))+s+bonus[c]; };
    const snaps=[]; const snap=(label,short,games,ri)=>{ const rows=teams.map(c=>({c,e:R[c]})).sort((a,b)=>b.e-a.e); rows.forEach((r,i)=>r.rank=i+1);
      snaps.push({label,short,ri,rows,games:games||{},rank:Object.fromEntries(rows.map(r=>[r.c,r.rank])),elo:Object.fromEntries(rows.map(r=>[r.c,r.e]))}); };
    snap("Pre-season","Pre",{});
    if(s) s.rounds.forEach((r,ri)=>{ if(r.rep) return; const ms=r.matches.filter(m=>played(m)&&m.home!=="TBC"); if(!ms.length) return;
      const games={};
      ms.forEach(m=>{ const h=m.home,a=m.away, gr=team(h).grounds||[], hfa=(!m.venue||!gr.length||gr.includes(m.venue)||gr.includes(venueOf(m)))?PWR.HFA:0;
        const dr=R[h]+hfa-R[a], exp=1/(1+Math.pow(10,-dr/400)), res=m.hs>m.as?1:m.hs<m.as?0:0.5, mg=Math.abs(m.hs-m.as);
        const wdiff=res===1?dr:res===0?-dr:0, mov=res===0.5?1:Math.log(mg+1)*(2.2/(Math.max(-400,wdiff)*0.001+2.2));
        const kf=r.finals?(PWR.FINALS_K[r.name]||(/grand/i.test(r.name)?3:1.5)):1;
        const d=PWR.K*kf*mov*(res-exp);
        // finals: winners get the full (boosted) reward; losers only take part of the hit, because making the finals still counts
        const lf=r.finals?PWR.FINAL_LOSS:1;
        D[h].push(d<0?d*lf:d); D[a].push(-d<0?-d*lf:-d);
        games[h]={opp:a, pf:m.hs, pa:m.as, d, exp, home:true, mid:m.mid, fin:r.finals?r.name:null}; games[a]={opp:h, pf:m.as, pa:m.hs, d:-d, exp:1-exp, home:false, mid:m.mid, fin:r.finals?r.name:null}; });
      teams.forEach(c=>R[c]=calc(c));
      // the premiers always finish the season on top
      if(r.finals && /grand final/i.test(r.name)){ const gm=ms[0], ch=gm.hs>gm.as?gm.home:gm.as>gm.hs?gm.away:null;
        if(ch){ const top=Math.max(...teams.filter(c=>c!==ch).map(c=>R[c])); if(R[ch]<=top){ bonus[ch]+=top+10-R[ch]; R[ch]=calc(ch); } games[ch].premiers=true; } }
      snap(r.name, r.finals?(/grand/i.test(r.name)?"GF":/week 1/i.test(r.name)?"F1":/week 2/i.test(r.name)?"F2":/week 3/i.test(r.name)?"F3":"F"):r.name.replace(/round\s*/i,"R"), games, ri); });
    seasons.push({id, s, teams, snaps, pre, champ:champs[id], prevChamp:champs[id-1]});
  });
  return PWR_CACHE={seasons};
}
function pwrTier(rank){ return PWR_TIERS.find(t=>rank<=t.max); }
// results for a team up to (and including) snapshot k of a season, plus the previous season if needed
function pwrHistory(S, k, c){
  const out=[]; S.snaps.slice(1,k+1).forEach(sn=>{ if(sn.games[c]) out.push({...sn.games[c], label:sn.label}); });
  return out;
}
function pwrBlurb(S, k, c){
  const sn=S.snaps[k], g=sn.games[c], hist=pwrHistory(S,k,c), opp=x=>team(x).nick;
  if(k===0){
    const a=S.pre[c]; const prev=pwrBuild().seasons.find(x=>x.id===S.id-1);
    let base="";
    if(prev){ const ps=prev.snaps[prev.snaps.length-1]; const reg=prev.s?regularIdx(prev.s):[];
      if(prev.champ===c) base=`🏆 Reigning premiers.`;
      else if(prev.s && reg.length){ const lad=computeLadder(prev.s, reg[reg.length-1]); const pos=lad.findIndex(r=>r.code===c);
        base = pos>=0 ? `Finished ${ordinal(pos+1)} in Season ${prev.id} (${lad[pos].W}-${lad[pos].L}${lad[pos].D?"-"+lad[pos].D:""}).` : `Didn't play in Season ${prev.id}.`; } }
    return (a&&a.note?`${a.pts>0?"📈":"📉"} ${a.note}. `:"")+base;
  }
  if(!g){
    if(S.s && S.s.rounds[sn.ri] && S.s.rounds[sn.ri].finals){
      const lastFin=[...hist].reverse().find(x=>x.fin);
      if(!lastFin) return "Missed the finals.";
      if(lastFin.pf<lastFin.pa){ const nm=/week 1/i.test(lastFin.fin)?"first week of the finals":/week 2/i.test(lastFin.fin)?"semi-finals":/week 3/i.test(lastFin.fin)?"preliminary final":"finals"; return `Season over: knocked out in the ${nm} by the ${opp(lastFin.opp)}.`; }
      return "😴 Earned the week off in the finals.";
    }
    return "😴 Had the week off.";
  }
  const res=g.pf>g.pa?"W":g.pf<g.pa?"L":"D";
  let streak=0; for(let i=hist.length-1;i>=0;i--){ const r=hist[i].pf>hist[i].pa?"W":hist[i].pf<hist[i].pa?"L":"D"; if(r===res) streak++; else break; }
  const sc=`${g.pf}–${g.pa}`;
  if(g.premiers) return `🏆 Premiers! Won the Grand Final ${sc} over the ${opp(g.opp)}.`;
  if(g.fin && /grand/i.test(g.fin) && res==="L") return `💔 Fell at the last, losing the Grand Final ${sc} to the ${opp(g.opp)}.`;
  if(g.fin && res==="L") return `❌ Season over after a ${sc} finals loss to the ${opp(g.opp)}.`;
  if(g.fin && res==="W") return `✅ Through after a ${sc} finals win over the ${opp(g.opp)}.`;
  if(res==="W" && g.exp<0.38) return `😱 Stunned the ${opp(g.opp)} ${sc} as underdogs.`;
  if(res==="L" && g.exp>0.62) return `😬 Upset by the ${opp(g.opp)}, ${sc}.`;
  if(res==="W" && streak>=4) return `🔥 ${streak} straight wins after beating the ${opp(g.opp)} ${sc}.`;
  if(res==="L" && streak>=4) return `🧊 ${streak} losses in a row after going down to the ${opp(g.opp)} ${sc}.`;
  if(res==="W" && g.pf-g.pa>=24) return `💪 Put ${g.pf} on the ${opp(g.opp)} in a ${sc} hiding.`;
  if(res==="L" && g.pa-g.pf>=24) return `🥴 Thumped ${sc} by the ${opp(g.opp)}.`;
  if(res==="W" && streak>=2) return `✅ ${streak} on the trot after a ${sc} win over the ${opp(g.opp)}.`;
  if(res==="L" && streak>=2) return `⚠️ ${streak} straight losses after a ${sc} defeat to the ${opp(g.opp)}.`;
  if(res==="D") return `🤝 Drew ${sc} with the ${opp(g.opp)}.`;
  if(res==="W") return `Beat the ${opp(g.opp)} ${sc}${Math.abs(g.pf-g.pa)<=4?" in a tight one":""}.`;
  return `Went down ${sc} to the ${opp(g.opp)}${Math.abs(g.pf-g.pa)<=4?" in a close one":""}.`;
}
function pwrSpark(S, k, c){
  let series=S.snaps.slice(0,k+1);
  if(series.length<10){ const prev=pwrBuild().seasons.find(x=>x.id===S.id-1);
    // pre-season: show how last season finished (the off-season reset isn't form)
    if(prev) series = k===0 ? prev.snaps.slice(1) : [...prev.snaps.slice(1),...series.slice(1)]; }
  const pts=series.slice(-10).map(sn=>sn.elo[c]).filter(x=>x!=null); if(pts.length<2) return `<span class="pw-spark empty"></span>`;
  const lo=Math.min(...pts), hi=Math.max(...pts), w=90, h=28, rng=Math.max(20,hi-lo), mid=(hi+lo)/2;
  const xy=pts.map((v,i)=>[i/(pts.length-1)*w, h/2-(v-mid)/rng*(h-6)]);
  const up=pts[pts.length-1]>=pts[0];
  return `<svg class="pw-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${xy.map(p=>p.map(x=>x.toFixed(1)).join(",")).join(" ")}" class="${up?"up":"dn"}"/><circle cx="${xy[xy.length-1][0].toFixed(1)}" cy="${xy[xy.length-1][1].toFixed(1)}" r="2.6" class="${up?"up":"dn"}"/></svg>`;
}
function pwrForm(S,k,c){
  let h=pwrHistory(S,k,c);
  if(h.length<5){ const prev=pwrBuild().seasons.find(x=>x.id===S.id-1); if(prev) h=[...pwrHistory(prev,prev.snaps.length-1,c),...h]; }
  return h.slice(-5).map(g=>{ const r=g.pf>g.pa?"W":g.pf<g.pa?"L":"D"; return `<i class="${r}" title="${esc(`${g.label}: ${r} ${g.pf}-${g.pa} v ${team(g.opp).nick}`)}">${r}</i>`; }).join("") || `<span class="pw-none">–</span>`;
}
function pwrRecord(S,k,c){ const h=pwrHistory(S,k,c); const w=h.filter(g=>g.pf>g.pa).length, l=h.filter(g=>g.pf<g.pa).length, d=h.length-w-l; return h.length?`${w}-${l}${d?"-"+d:""}`:"0-0"; }
function pwrHighlights(S,k){
  const sn=S.snaps[k], prev=k>0?S.snaps[k-1]:null, cards=[];
  const card=(icon,title,c,text)=>cards.push(`<div class="pw-hl"><span class="pw-hli">${icon}</span><small>${esc(title)}</small><div class="pw-hlt">${logo(c,"sm")}<b>${esc(team(c).nick)}</b></div><span>${text}</span></div>`);
  card("👑","Number one",sn.rows[0].c,`Index ${pwrIdx(sn.rows[0].e).toFixed(1)}`);
  if(prev){
    const mv=sn.rows.map(r=>({c:r.c,d:prev.rank[r.c]-r.rank})).sort((a,b)=>b.d-a.d);
    if(mv[0].d>0) card("🚀","Biggest riser",mv[0].c,`Up ${mv[0].d} to ${ordinal(sn.rank[mv[0].c])}`);
    const f=mv[mv.length-1]; if(f.d<0) card("📉","Biggest faller",f.c,`Down ${-f.d} to ${ordinal(sn.rank[f.c])}`);
    const ups=Object.entries(sn.games).filter(([c,g])=>g.pf>g.pa).sort((a,b)=>a[1].exp-b[1].exp);
    if(ups.length && ups[0][1].exp<0.45) card("😱","Upset of the round",ups[0][0],`Beat the ${esc(team(ups[0][1].opp).nick)} ${ups[0][1].pf}–${ups[0][1].pa} (${Math.round(ups[0][1].exp*100)}% chance)`);
    let hot=null; sn.rows.forEach(r=>{ const h=pwrHistory(S,k,r.c); let n=0; for(let i=h.length-1;i>=0&&h[i].pf>h[i].pa;i--) n++; if(n>=2&&(!hot||n>hot.n)) hot={c:r.c,n}; });
    if(hot) card("🔥","Hottest team",hot.c,`${hot.n} wins in a row`);
  } else {
    const ad=Object.entries(S.pre).sort((a,b)=>b[1].pts-a[1].pts);
    if(ad.length&&ad[0][1].pts>0) card("📈","Biggest off-season boost",ad[0][0],esc(ad[0][1].note||"Off-season moves"));
    if(ad.length&&ad[ad.length-1][1].pts<0) card("📉","Off-season concern",ad[ad.length-1][0],esc(ad[ad.length-1][1].note||""));
    if(S.prevChamp && S.teams.includes(S.prevChamp)) card("🏆","Reigning premiers",S.prevChamp,`Starting ${ordinal(sn.rank[S.prevChamp])}`);
  }
  return `<div class="pw-hls">${cards.join("")}</div>`;
}
function pwrChart(S, k, focus){
  const snaps=S.snaps.slice(0,Math.max(k+1,1)), n=S.teams.length; if(snaps.length<3) return "";
  const W=Math.max(640, snaps.length*44), H=n*24+40, x=i=>40+i/(snaps.length-1)*(W-110), y=r=>20+(r-1)*24;
  const lines=S.teams.map(c=>{ const pts=snaps.map((sn,i)=>[x(i),y(sn.rank[c])]); const col=CLUB_BG[c]||team(c).c1||"#555";
    return `<g class="pw-line${c===focus?" on":""}" data-team="${c}" style="--lc:${col}"><polyline points="${pts.map(p=>p.join(",")).join(" ")}"/>${pts.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3"/>`).join("")}</g>`; }).join("");
  const last=snaps[snaps.length-1];
  const logos=last.rows.map(r=>`<image href="${esc(team(r.c).logo)}" x="${x(snaps.length-1)+10}" y="${y(r.rank)-10}" width="20" height="20" class="pw-cl" data-team="${r.c}"/>`).join("");
  const axis=snaps.map((sn,i)=>`<text x="${x(i)}" y="${H-6}" text-anchor="middle">${esc(sn.short)}</text>`).join("");
  const ranks=[...Array(n).keys()].map(i=>`<text x="14" y="${y(i+1)+4}" text-anchor="middle" class="rk">${i+1}</text>`).join("");
  return `<div class="pw-chart"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${ranks}${axis}${lines}${logos}</svg></div>`;
}
function viewPower(sid, kArg){
  const P=pwrBuild(); let S=P.seasons.find(x=>String(x.id)===String(sid)) || P.seasons[P.seasons.length-1];
  let k = kArg!=null && kArg!=="" ? Math.min(S.snaps.length-1, Math.max(0, parseInt(kArg))) : S.snaps.length-1;
  const sn=S.snaps[k], prev=k>0?S.snaps[k-1]:null;
  const prevSeason=P.seasons.find(x=>x.id===S.id-1), prevFinal=prevSeason?prevSeason.snaps[prevSeason.snaps.length-1]:null;
  const cmp = prev || prevFinal;   // pre-season compares with where the club finished last season
  const seasonDD=dd({cls:"f-season",label:"Season",tiles:true,cols:4,trigger:`<span class="lbl">Season ${S.id}</span>`,
    items:P.seasons.slice().reverse().map(x=>({href:`power-${x.id}`,label:"Season "+x.id,sel:x===S}))});
  const roundCtl = roundBox(`power-${S.id}-`, S.snaps.map((x,j)=>({n:j, label:x.label, cur:j===k}))).replace(/location\.hash='power-(\d+)-(\d+)'/g,(m,a,b)=>`location.hash='power-${a}-${b-1}'`);
  const focus=sn.rows[0].c;
  let lastTier=null;
  const rows=sn.rows.map(r=>{
    const t=pwrTier(r.rank), mv=cmp&&cmp.rank[r.c]!=null?cmp.rank[r.c]-r.rank:null, dE=k===0?(S.pre[r.c]?S.pre[r.c].pts*PWR.PTS_TO_ELO:null):(cmp&&cmp.elo[r.c]!=null?r.e-cmp.elo[r.c]:null);
    const head="";
    const col=CLUB_BG[r.c]||team(r.c).c1||"#333";
    return `${head}<div class="pw-row${r.rank===1?" t1":""}" data-team="${r.c}" style="--tc:${col}">
      <div class="pw-rank">${r.rank}</div>
      <div class="pw-mv ${mv>0?"up":mv<0?"dn":"eq"}">${mv==null?"<span>NEW</span>":mv>0?`▲ ${mv}`:mv<0?`▼ ${-mv}`:"–"}</div>
      <a class="pw-team" href="#club-${r.c}">${logo(r.c)}<div><b>${esc(team(r.c).nick)}</b><small>${pwrBlurb(S,k,r.c)}</small></div></a>
      <div class="pw-rec"><small>${k===0?"Last 5":"Record"}</small><b>${k===0?"":pwrRecord(S,k,r.c)}</b><span class="pw-form">${pwrForm(S,k,r.c)}</span></div>
      <div class="pw-trend">${pwrSpark(S,k,r.c)}</div>
      <div class="pw-score"><b>${pwrIdx(r.e).toFixed(1)}</b><span class="${dE>0.05?"up":dE<-0.05?"dn":""}">${dE==null?"":(dE>0?"+":"")+(dE/10).toFixed(1)+(k===0?" boost":"")}</span></div>
    </div>`; }).join("");
  const chartS = S.snaps.length>=3 ? S : prevSeason;
  const chart = chartS ? pwrChart(chartS, chartS===S?k:chartS.snaps.length-1, focus) : "";
  return `${pageHead("Power Rankings")}<div class="pbody pw-page">
    <div class="filters">${seasonDD}${roundCtl}</div>
    <div class="pw-intro"><div><b>The Dingo Power Index</b><span>${k===0?`Season ${S.id} pre-season rankings: where every club stands after last season's results and the off-season moves.`:`Rankings after ${esc(sn.label)}, Season ${S.id}. Every result moves a club's index. Upsets and big wins move it most.`}</span></div><button type="button" onclick="const d=document.getElementById('pwHow');d.open=true;d.scrollIntoView({behavior:'smooth'})">How it works</button></div>
    ${pwrHighlights(S,k)}
    <div class="pw-head"><span>#</span><span>Move</span><span>Team</span><span>${k===0?"Form":"Record / Form"}</span><span>Trend</span><span>Index</span></div>
    <div class="pw-list">${rows}</div>
    ${chart?`<h2 class="section-title" style="margin-top:36px">${chartS===S?"The race so far":`How Season ${chartS.id} unfolded`} <span class="db-sub">tap a team to follow it</span></h2>${chart}`:""}
    <details class="pw-how" id="pwHow"><summary>How the Dingo Power Index works</summary><div>
      <p><b>Every club starts at 50.0</b> (an average team). After each game, the winner takes index points from the loser.</p>
      <p><b>Surprises are worth more.</b> Beating a team you were expected to beat earns a little. Knocking off a much stronger side earns a lot. The expected result is based on both teams' index going into the game.</p>
      <p><b>Recent form counts most.</b> A club's three most recent results count in full. Each result before that counts 75% as much as the one after it, so a hot or cold streak shows up quickly and early-season results gradually fade.</p>
      <p><b>Margin matters, with limits.</b> Bigger wins move the index further, but with diminishing returns, so running up the score against a weak side doesn't count for much.</p>
      <p><b>Finals matter more.</b> Finals games move the index 1.5× to 2× as much as a regular game, and the Grand Final 3×. Winning a final is worth a lot, while losing one costs only about a third of a normal loss, because making the finals still counts. The premiers always finish the season ranked number one.</p>
      <p><b>Home ground counts.</b> A home team at its own ground gets a small head start. Neutral and overseas venues don't count as home games.</p>
      <p><b>New season, fresh start.</b> Between seasons every club drifts 60% of the way back to 50.0, so each season's rankings are mostly about that season, and that head start fades further with every game played. Pre-season nudges for signings and returning teams (the same ones Dingobet uses) are then added on top.</p>
    </div></details>
  </div>`;
}
// follow a team on the chart
document.addEventListener("click",e=>{
  const el=e.target.closest(".pw-line,.pw-cl,.pw-row"); if(!el || !document.querySelector(".pw-chart")) return;
  if(el.classList.contains("pw-row") && e.target.closest("a")) return;
  const c=el.dataset.team; document.querySelectorAll(".pw-line").forEach(l=>l.classList.toggle("on",l.dataset.team===c));
  document.querySelectorAll(".pw-row").forEach(r=>r.classList.toggle("sel",r.dataset.team===c));
  const line=document.querySelector(`.pw-line[data-team="${c}"]`); if(line) line.parentNode.appendChild(line);
});
