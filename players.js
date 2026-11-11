/* =========================================================
   STATS → PLAYERS   #stats-players-<season|all>[-CLUB]
   Reads data/players.js (one CSV block per season).
   ========================================================= */
const PL_POS = { "FULLBACK":"Fullback", "WINGER":"Winger", "CENTRE":"Centre", "FIVE EIGHTH":"Five-Eighth", "HALFBACK":"Halfback",
  "PROP":"Prop", "HOOKER":"Hooker", "SECOND ROW":"Second Row", "LOCK":"Lock" };
const PL_FORWARDS = ["PROP","HOOKER","SECOND ROW","LOCK"];
// "MCINNES" → "McInnes", "TO'O" → "To'o", "O'SULLIVAN" → "O'Sullivan", "FONUA-BLAKE" → "Fonua-Blake", "AJ" stays "AJ"
function plName(s){
  s=String(s||"").trim(); if(!s) return "";
  if(/^[A-Z]{2}$/.test(s) && !/[AEIOU]/.test(s)) return s;           // initials like AJ, KL
  if(s==="AJ"||s==="KL") return s;
  return s.toLowerCase().split(" ").map(w=>w.split("-").map(p=>{
    let x=p.charAt(0).toUpperCase()+p.slice(1);
    x=x.replace(/^Mc([a-z])/,(m,c)=>"Mc"+c.toUpperCase());
    x=x.replace(/^([A-Za-z])'([a-z])/,(m,a,b)=>a.toUpperCase()+"'"+b.toUpperCase());   // O'Sullivan, J'Maine
    return x; }).join("-")).join(" ");
}
let PL_CACHE={};
function plSeason(sid){
  if(PL_CACHE[sid]) return PL_CACHE[sid];
  const txt=(window.PLAYER_STATS||{})[sid]; if(!txt) return null;
  const rows=[];
  txt.split(/\r?\n/).map(l=>l.trim()).filter(l=>l && !/^TEAM\b/i.test(l)).forEach(l=>{
    const c=l.split(",").map(x=>x.trim()); if(c.length<8) return;
    const n=x=>parseInt(x,10)||0, code=c[0].toUpperCase().replace(/2$/,"");
    rows.push({sid:+sid, code, first:plName(c[1]), last:plName(c[2]), name:`${plName(c[1])} ${plName(c[2])}`,
      T:n(c[3]), G:n(c[4]), F1:n(c[5]), F2:n(c[6]), Pts:n(c[7]), DM:c[8]===""||c[8]==null?null:n(c[8]), pos:(c[9]||"").toUpperCase()});
  });
  rows.forEach(r=>r.FG=r.F1+r.F2);
  return PL_CACHE[sid]=rows;
}
function plSeasons(){ return Object.keys(window.PLAYER_STATS||{}).map(Number).sort((a,b)=>a-b); }
function plAll(){   // career totals across every season, matched by name
  const by={};
  plSeasons().forEach(s=>plSeason(s).forEach(r=>{ const k=r.name.toLowerCase(); const o=by[k]||(by[k]={...r, sid:"all", seasons:0, clubs:[], DM:0, T:0,G:0,F1:0,F2:0,FG:0,Pts:0});
    o.seasons++; o.T+=r.T; o.G+=r.G; o.F1+=r.F1; o.F2+=r.F2; o.FG+=r.FG; o.Pts+=r.Pts; o.DM+=r.DM||0; if(!o.clubs.includes(r.code)) o.clubs.push(r.code); o.code=r.code; if(r.pos) o.pos=r.pos; }));
  return Object.values(by).map(o=>({...o, DM:o.DM||null}));
}
function plLeader(title, rows, f, opts={}){
  const list=rows.map(r=>({r,v:f(r)})).filter(x=>x.v!=null&&x.v>0).sort((a,b)=>b.v-a.v||(b.r.Pts-a.r.Pts));
  const top=list.slice(0,opts.n||5); if(!top.length) return "";
  const max=top[0].v||1;
  return `<section class="mc-card st-lead pl-lead"><h3 class="mc-h">${esc(title)}</h3>
    ${top.map((x,i)=>`<div class="pl-lr${i===0?" first":""}"><span class="st-rank">${i+1}</span>${logo(x.r.code,"sm")}<span class="pl-nm"><b>${esc(x.r.name)}</b><small>${esc(team(x.r.code).nick)}${x.r.pos?" · "+esc(PL_POS[x.r.pos]||x.r.pos):""}</small></span><span class="st-bar"><i style="width:${Math.max(4,x.v/max*100)}%"></i></span><b class="pl-v">${opts.fmt?opts.fmt(x.v,x.r):x.v}</b></div>`).join("")}
    ${opts.note?`<div class="mc-line sm">${esc(opts.note)}</div>`:""}</section>`;
}
const TOS_POS=["Fullback","Winger","Centre","Centre","Winger","Five-Eighth","Halfback","Prop","Hooker","Prop","Second Row","Second Row","Lock"];
function awardsParse(sid){
  const txt=(window.SEASON_AWARDS||{})[sid]; if(!txt) return null;
  const code=x=>{ x=(x||"").toUpperCase(); return teamMap[x]?x:x.replace(/2$/,""); };
  const awards=[], team13=[];
  txt.replace(/\*/g,"").split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(l=>{
    const tm=l.match(/^(\d{1,2})[.)]\s*(.+?)\s*(?::(\w+):)?$/);
    if(tm){ team13[+tm[1]-1]={n:+tm[1], name:tm[2].trim(), code:code(tm[3])}; return; }
    const am=l.match(/^(.+?):\s*(.+?)\s*(?::(\w+):)?$/);
    if(am && !/team of the season/i.test(am[1])){ const v=am[2].match(/^(.*?)\s+-\s+(.+)$/); awards.push({title:am[1].trim(), name:(v?v[1]:am[2]).trim(), detail:v?v[2].trim():"", code:code(am[3])}); }
  });
  return {awards, team:team13.filter(Boolean)};
}
function plTeamOfSeason(sid){
  const A=awardsParse(sid); if(!A||!A.team.length) return "";
  const by=n=>A.team.find(x=>x.n===n);
  const card=n=>{ const r=by(n); if(!r) return `<div class="pl-tos-c empty"><b>–</b><small>${TOS_POS[n-1]}</small></div>`;
    const last=r.name.split(" ").slice(1).join(" ")||r.name;
    return `<div class="pl-tos-c" style="--tc:${CLUB_BG[r.code]||team(r.code).c1||"#333"}" title="${esc(r.name)}">${r.code?logo(r.code,"sm"):""}<b><i class="pl-no">${n}</i>${esc(last)}</b><small>${TOS_POS[n-1]} · ${r.code?esc(team(r.code).nick):""}</small></div>`; };
  const line=ns=>`<div class="pl-tos-row">${ns.map(card).join("")}</div>`;
  return `<section class="mc-card pl-tos"><h3 class="mc-h">Season ${sid} Team of the Season</h3>
    <div class="pl-field">${line([1])}${line([2,3,4,5])}${line([6,7])}${line([11,13,12])}${line([8,9,10])}</div></section>`;
}
function plFilter(inp){
  const q=inp.value.trim().toLowerCase(); let k=0; const sec=document.querySelector(".pl-table").closest("section"); sec.classList.toggle("searching",!!q);
  document.querySelectorAll(".pl-table tbody tr").forEach(tr=>{ const on=!q||tr.dataset.s.includes(q); tr.style.display=on?"":"none"; if(on) tr.cells[0].textContent=++k; });
}
function viewPlayerStats(sidArg, clubArg){
  const seasons=plSeasons();
  const viewDD=dd({cls:"f-view",label:"View",trigger:`<span class="lbl">Players</span>`,items:[{href:"stats",label:"Teams"},{href:"stats-players",label:"Players",sel:true}]});
  if(!seasons.length) return `${pageHead("Stats")}<div class="pbody"><div class="filters">${viewDD}</div><div class="empty">No player stats yet.</div></div>`;
  let sid = sidArg==="all" && seasons.length>1 ? "all" : (seasons.includes(+sidArg)?+sidArg:seasons[seasons.length-1]);
  let all = sid==="all" ? plAll() : plSeason(sid);
  const clubs=[...new Set(all.map(r=>r.code))].sort((a,b)=>team(a).nick.localeCompare(team(b).nick));
  const club = clubArg && clubs.includes(clubArg.toUpperCase()) ? clubArg.toUpperCase() : null;
  const rows = club ? all.filter(r=>sid==="all"?r.clubs.includes(club):r.code===club) : all;
  const sfx=club?"-"+club:"";
  const seasonDD=dd({cls:"f-season",label:"Season",tiles:true,cols:4,trigger:`<span class="lbl">${sid==="all"?"All Seasons":"Season "+sid}</span>`,
    items:[...(seasons.length>1?[{href:`stats-players-all${sfx}`,label:"All Seasons",sel:sid==="all"}]:[]), ...seasons.slice().reverse().map(s=>({href:`stats-players-${s}${sfx}`,label:"Season "+s,sel:s===sid}))]});
  const clubDD=dd({cls:"f-team",label:"Club",tiles:true,cols:3,trigger:club?`${logo(club,"sm")}<span class="lbl">${esc(team(club).nick)}</span>`:`<span class="lbl">All Clubs</span>`,
    items:[{href:`stats-players-${sid}`,label:"All Clubs",sel:!club}, ...clubs.map(c=>({href:`stats-players-${sid}-${c}`,label:team(c).nick,icon:logo(c,"sm"),sel:c===club}))]});
  const head=`${pageHead("Stats")}<div class="pbody"><div class="filters">${viewDD}${seasonDD}${clubDD}<input class="pp-search pl-search" type="search" placeholder="Search players" oninput="plFilter(this)"></div>`;

  const sum=f=>rows.reduce((a,r)=>a+f(r),0);
  const tile=(v,l,sub)=>`<div class="club-tile"><b>${v}</b><span>${esc(l)}</span>${sub?`<small>${sub}</small>`:""}</div>`;
  const dmTop=rows.filter(r=>r.DM).sort((a,b)=>b.DM-a.DM), dmMax=dmTop.length?dmTop[0].DM:0, dmWin=dmTop.filter(r=>r.DM===dmMax);
  const tT=rows.slice().sort((a,b)=>b.T-a.T)[0], tP=rows.slice().sort((a,b)=>b.Pts-a.Pts)[0];
  const tiles=`<div class="club-tiles st-tiles">
    ${tile(rows.length,"Players on the scoresheet")}${tile(sum(r=>r.T),"Tries")}${tile(sum(r=>r.G),"Goals")}
    ${tile(sum(r=>r.FG),"Field goals",`${sum(r=>r.F1)} one-pointers · ${sum(r=>r.F2)} two-pointers`)}${tile(sum(r=>r.Pts).toLocaleString(),"Points")}
    ${tile(rows.filter(r=>r.T>=10).length,"10+ try scorers")}</div>`;

  // headline cards
  const hero=(icon,label,r,val)=>r?`<div class="pl-hero" style="--tc:${CLUB_BG[r.code]||team(r.code).c1||"#111"}">${logo(r.code,"lg")}<div><small>${icon} ${esc(label)}</small><b>${esc(r.name)}</b><span>${esc(team(r.code).nick)} · ${val}</span></div></div>`:"";
  const heroes=`<div class="pl-heroes">${""}
    ${hero("🏉","Top try scorer",tT,`${tT.T} tries`)}${hero("🎯","Top point scorer",tP,`${tP.Pts} points`)}</div>`;

  const fwd=rows.filter(r=>PL_FORWARDS.includes(r.pos));
  const leaders=`<h2 class="st-h">Leaders</h2><div class="rec-grid st-grid">
    ${plLeader("Top try scorers", rows, r=>r.T, {n:10})}
    ${plLeader("Top point scorers", rows, r=>r.Pts, {n:10})}
    ${plLeader("Most goals", rows, r=>r.G)}
    ${plLeader("Field goals", rows, r=>r.FG, {fmt:(v,r)=>`${v}<small> ${r.F1}×1 ${r.F2}×2</small>`})}
    ${plLeader("Try-scoring forwards", fwd, r=>r.T, {note:"Props, hookers, second rowers and locks"})}
    ${plLeader("Share of club's points", rows, r=>{ const tot=all.filter(x=>x.code===r.code).reduce((a,x)=>a+x.Pts,0); return tot?+(r.Pts/tot*100).toFixed(1):null; }, {fmt:v=>v.toFixed(1)+"%", note:"How much of their club's points each player scored"})}
    ${plLeader("Tries without a goal kicked", rows.filter(r=>!r.G&&!r.FG), r=>r.T, {note:"Pure try scorers"})}
  </div>`;

  // club breakdown (only when looking at every club)
  let clubCard="";
  if(!club){
    const cl=clubs.map(c=>{ const ps=all.filter(r=>sid==="all"?r.code===c:r.code===c); const tt=ps.slice().sort((a,b)=>b.T-a.T)[0], pp=ps.slice().sort((a,b)=>b.Pts-a.Pts)[0], dm=ps.filter(r=>r.DM).sort((a,b)=>b.DM-a.DM)[0];
      return {c, n:ps.length, T:ps.reduce((a,r)=>a+r.T,0), P:ps.reduce((a,r)=>a+r.Pts,0), tt, pp, dm, scorers:ps.filter(r=>r.T>0).length, pts:ps.filter(r=>r.Pts>0).length}; }).sort((a,b)=>b.P-a.P);
    clubCard=`<section class="mc-card rec-card rec-wide st-wide"><h3 class="mc-h">Club by club</h3><div class="st-scroll"><table class="rec-table st-table pl-clubs"><thead><tr><th class="l">Club</th><th>Point scorers</th><th>Try scorers</th><th>Tries</th><th>Points</th><th class="l">Top try scorer</th><th class="l">Top point scorer</th></tr></thead><tbody>
      ${cl.map(x=>`<tr><td class="l"><a href="#stats-players-${sid}-${x.c}">${recTeamTag(x.c,true)}</a></td><td>${x.pts}</td><td>${x.scorers}</td><td>${x.T}</td><td><b>${x.P}</b></td><td class="l">${x.tt?`${esc(x.tt.name)} <small>${x.tt.T}</small>`:"–"}</td><td class="l">${x.pp?`${esc(x.pp.name)} <small>${x.pp.Pts}</small>`:"–"}</td></tr>`).join("")}
      </tbody></table></div><div class="mc-line sm">Tap a club to see its players.</div></section>`;
  }

  // full table
  const tbl=rows.slice().sort((a,b)=>b.Pts-a.Pts||b.T-a.T);
  const cols=[["Tries",r=>r.T],["Goals",r=>r.G],["1pt FG",r=>r.F1],["2pt FG",r=>r.F2],["Points",r=>r.Pts]];
  if(sid==="all") cols.unshift(["Seasons",r=>r.seasons]);
  const table=`<section class="mc-card rec-card rec-wide st-wide"><h3 class="mc-h">${club?esc(team(club).nick)+" players":"Every player"}</h3><div class="st-scroll"><table class="rec-table st-table pl-table"><thead><tr><th>#</th><th class="l"><button onclick="statSortTable(this)">Player</button></th><th class="l"><button onclick="statSortTable(this)">Club</button></th><th class="l"><button onclick="statSortTable(this)">Position</button></th>${cols.map(c=>`<th><button onclick="statSortTable(this)">${esc(c[0])}</button></th>`).join("")}</tr></thead><tbody>
    ${tbl.map((r,i)=>`<tr${i>=25?' class="pl-more"':""} data-s="${esc((r.name+" "+team(r.code).nick).toLowerCase())}"><td>${i+1}</td><td class="l"><b>${esc(r.name)}</b></td><td class="l" data-v="${esc(team(r.code).nick)}">${recTeamTag(r.code)}</td><td class="l">${esc(PL_POS[r.pos]||"–")}</td>${cols.map(c=>`<td${c[2]?` data-v="${c[2](r)}"`:""}>${c[1](r)}</td>`).join("")}</tr>`).join("")}
    </tbody></table></div>${tbl.length>25?`<button class="pl-showall" onclick="this.closest('section').classList.add('all');this.remove()">Show all ${tbl.length} players</button>`:""}<div class="mc-line sm">Only players who scored points or polled Dally M votes are listed. Click a column heading to sort.</div></section>`;

  return head + tiles + heroes + leaders + clubCard + table + `</div>`;
}

/* =========================================================
   DALLY M AWARDS   #dallym-<season>
   Votes come from data/players.js; past medallists, rookies and
   leading scorers from the honours list in data/records.js.
   ========================================================= */
function dmHonours(title){
  const sec=(honoursAll().find(x=>x.title.toUpperCase()===title)||{rows:[]});
  return sec.rows.map(r=>{ const code=(r.text.match(/:(\w+):/)||[])[1]; let rest=r.text.replace(/:(\w+):/g,"").trim(); const shared=rest.includes("^"); rest=rest.replace(/\^/g,"");
    const m=rest.match(/^(.*?)\s+-\s+(.+)$/); return {s:r.s, name:(m?m[1]:rest).trim(), val:m?m[2].trim():"", code, shared, nodata:/^no data/i.test(rest)}; });
}
function viewDallyM(sidArg){
  const med=dmHonours("DALLY M MEDALLISTS"), rook=dmHonours("ROOKIE OF THE SEASON"), tries=dmHonours("TOP TRY SCORERS"), pts=dmHonours("TOP POINT SCORERS");
  const voteSeasons=plSeasons().filter(s=>plSeason(s).some(r=>r.DM));
  const seasons=[...new Set([...med.map(x=>x.s),...voteSeasons])].sort((a,b)=>a-b);
  if(!seasons.length) return `${pageHead("Dally M Awards")}<div class="pbody"><div class="empty">No Dally M awards yet.</div></div>`;
  const sid=seasons.includes(+sidArg)?+sidArg:seasons[seasons.length-1];
  const seasonDD=dd({cls:"f-season",label:"Season",tiles:true,cols:4,trigger:`<span class="lbl">Season ${sid}</span>`,items:seasons.slice().reverse().map(s=>({href:`dallym-${s}`,label:"Season "+s,sel:s===sid}))});
  const rows=(plSeason(sid)||[]).filter(r=>r.DM).sort((a,b)=>b.DM-a.DM||b.Pts-a.Pts);
  const winners=med.filter(x=>x.s===sid), col=c=>CLUB_BG[c]||team(c).c1||"#111";
  const player=name=>(plSeason(sid)||[]).find(r=>r.name.toLowerCase()===name.toLowerCase());

  // the medal
  const medal = winners.length ? `<div class="dm-medal"><div class="dm-medal-in">
      <div class="dm-coin">🏅</div>
      <div class="dm-mtxt"><small>Season ${sid} Dally M Medal${winners.length>1?" · shared":""}</small>
        ${winners.map(w=>`<div class="dm-winner">${w.code?logo(w.code,"lg"):""}<div><b>${esc(w.name)}</b><span>${w.code?esc(team(w.code).nick):""}${w.val?` · ${esc(w.val.replace(/pts$/,"")).trim()} votes`:""}</span></div></div>`).join("")}
      </div></div></div>` : `<div class="dm-medal none"><div class="dm-medal-in"><div class="dm-mtxt"><small>Season ${sid}</small><b>No Dally M Medal recorded</b></div></div></div>`;

  // other season awards
  const award=(icon,title,x,sub)=>x&&!x.nodata?`<div class="dm-award" style="--tc:${x.code?col(x.code):"#333"}"><span class="dm-ai">${icon}</span><small>${esc(title)}</small><div>${x.code?logo(x.code,"sm"):""}<b>${esc(x.name)}</b></div><span>${sub||""}</span></div>`:"";
  const AW=awardsParse(sid), icon=t=>/try/i.test(t)?"🏉":/point/i.test(t)?"🎯":/captain/i.test(t)?"©️":/rookie/i.test(t)?"⭐":/dingo/i.test(t)?"🐕":"🏆";
  let awards;
  if(AW && AW.awards.length) awards=AW.awards.map(a=>award(icon(a.title),a.title,a,a.detail?esc(a.detail.replace(/(\d)pts$/,"$1 points")):(a.code?esc(team(a.code).nick):""))).join("");
  else { const rk=rook.find(x=>x.s===sid), tt=tries.find(x=>x.s===sid), tp=pts.find(x=>x.s===sid);
    awards=[award("⭐","Rookie of the Season",rk,rk&&rk.code?esc(team(rk.code).nick):""), award("🏉","Top Try Scorer",tt,tt?`${esc(tt.val)} tries`:""), award("🎯","Top Point Scorer",tp,tp?`${esc(tp.val)} points`:"")].join(""); }

  // positional awards
  const POS=[["FULLBACK","Fullback"],["WINGER","Winger"],["CENTRE","Centre"],["FIVE EIGHTH","Five-Eighth"],["HALFBACK","Halfback"],["PROP","Prop"],["HOOKER","Hooker"],["SECOND ROW","Second Rower"],["LOCK","Lock"]];
  const posAwards = rows.length ? `<h2 class="st-h">Most votes by position</h2><div class="dm-pos">${POS.map(([p,l])=>{ const ps=rows.filter(r=>r.pos===p); if(!ps.length) return ""; const top=ps[0].DM, w=ps.filter(r=>r.DM===top);
      return `<div class="dm-pc" style="--tc:${col(w[0].code)}"><small>${l}</small>${w.slice(0,w.length>3?2:3).map(r=>`<div class="dm-pw">${logo(r.code,"sm")}<b>${esc(r.name)}</b></div>`).join("")}${w.length>3?`<div class="dm-more">+ ${w.length-2} more tied: ${w.slice(2).map(r=>esc(r.last)).join(", ")}</div>`:""}<span>${top} votes${ps[1]&&ps[1].DM<top?` · next ${esc(ps[1].name)} ${ps[1].DM}`:""}</span></div>`; }).join("")}</div>` : "";

  // leaderboard
  const max=rows.length?rows[0].DM:1; let rank=0, prev=null;
  const board = rows.length ? `<section class="mc-card dm-board"><h3 class="mc-h">Final leaderboard</h3>${rows.slice(0,25).map((r,i)=>{ if(r.DM!==prev){ rank=i+1; prev=r.DM; }
      return `<div class="dm-row${rank<=3?" top"+rank:""}"><span class="n">${rank<=3?["🥇","🥈","🥉"][rank-1]:rank}</span>${logo(r.code,"sm")}<span class="nm"><b>${esc(r.name)}</b><small>${esc(team(r.code).nick)} · ${esc(PL_POS[r.pos]||"")}</small></span><span class="st-bar"><i style="width:${r.DM/max*100}%"></i></span><b class="v">${r.DM}</b></div>`; }).join("")}
      ${rows.length>25?`<div class="mc-line sm">Top 25 of ${rows.length} players who polled votes.</div>`:""}</section>`
    : `<section class="mc-card"><h3 class="mc-h">Final leaderboard</h3><div class="mc-line">The full vote count for Season ${sid} hasn't been added yet.</div></section>`;

  // club votes
  let clubs="";
  if(rows.length){ const by={}; rows.forEach(r=>{ const o=by[r.code]||(by[r.code]={c:r.code,v:0,n:0,top:r}); o.v+=r.DM; o.n++; });
    const list=Object.values(by).sort((a,b)=>b.v-a.v), cm=list[0].v;
    clubs=`<section class="mc-card dm-clubs"><h3 class="mc-h">Votes by club</h3>${list.map(x=>`<div class="st-br dm-cr"><span class="st-bl">${recTeamTag(x.c,true)}</span><span class="st-bar"><i style="width:${x.v/cm*100}%"></i></span><b>${x.v} <small>${x.n} players · ${esc(x.top.last)} ${x.top.DM}</small></b></div>`).join("")}</section>`; }

  const tos = plTeamOfSeason(sid);

  // history
  const allM={}; med.forEach(m=>{ const k=m.name.toLowerCase(); (allM[k]=allM[k]||{name:m.name,code:m.code,s:[]}).s.push(m.s); });
  const multi=Object.values(allM).filter(x=>x.s.length>1).sort((a,b)=>b.s.length-a.s.length);
  const hist=`<section class="mc-card dm-hist"><h3 class="mc-h">Dally M Medallists</h3><div class="dm-hl">${med.slice().sort((a,b)=>b.s-a.s).map(m=>`<a class="dm-hr${m.s===sid?" on":""}" href="#dallym-${m.s}"><span class="s">S${m.s}</span>${m.code?logo(m.code,"sm"):""}<b>${esc(m.name)}${m.shared?' <em>shared</em>':""}</b><span class="v">${esc(m.val.replace(/pts$/,""))}</span></a>`).join("")}</div>
    ${multi.length?`<div class="dm-multi">Multiple medallists: ${multi.map(x=>`<b>${esc(x.name)}</b> ×${x.s.length}`).join(" · ")}</div>`:""}
    ${(()=>{ const n=(med.find(x=>x.s===sid)||{}); return ""; })()}</section>`;
  const notes=(honoursAll().find(x=>x.title.toUpperCase()==="DALLY M MEDALLISTS")||{notes:[]}).notes;

  return `${pageHead("Dally M Awards")}<div class="pbody dm-page"><div class="filters">${seasonDD}</div>
    ${medal}<div class="dm-awards">${awards}</div>${tos}${posAwards}
    <div class="dm-grid">${board}<div>${clubs}${hist}${notes.length?`<div class="mc-line sm dm-notes">${notes.map(esc).join("<br>")}</div>`:""}</div></div>
    </div>`;
}
