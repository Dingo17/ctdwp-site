/* =========================================================
   Match stats for completed games (data/matchstats.js)
   Scoring summary under the score, plus Team Lists, Team Stats
   and Player Stats tabs in the match centre.
   ========================================================= */
const MS_COLS=["mins","ar","arm","pass","t","mt","tb","lb","k","kmg","ta","err","pen","tries","c","fg","pg"];
const MS_ROLE={FB:"Fullback",W:"Winger",C:"Centre","5/8":"Five-Eighth",HB:"Halfback",PR:"Prop",HK:"Hooker",SR:"2nd Row",L:"Lock"};
const MS_ORDER=["FB","W","C","5/8","HB","PR","HK","SR","L"];
const MS_CACHE={};

function msGet(mid){
  if(mid in MS_CACHE) return MS_CACHE[mid];
  const txt=(window.MATCH_STATS||{})[mid]; if(!txt) return MS_CACHE[mid]=null;
  const out={potm:null, team:{}, players:{}}; let mode=null, cur=null;
  txt.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).forEach(l=>{
    let g;
    if(g=l.match(/^player of the match:\s*([A-Z]{2,6})\s+(.+)$/i)){ out.potm={code:g[1].toUpperCase(), name:g[2].trim()}; return; }
    if(/^team stats:$/i.test(l)){ mode="team"; return; }
    if(g=l.match(/^([A-Za-z]{2,6}):$/)){ mode="pl"; cur=out.players[g[1].toUpperCase()]=[]; return; }
    if(mode==="team" && (g=l.match(/^(.+?)\s+([\d.\/%]+)\s*-\s*([\d.\/%]+)$/))){ out.team[g[1].toLowerCase()]=[g[2],g[3]]; return; }
    if(mode==="pl" && l.includes("|")){
      let f=l.split("|").map(x=>x.trim()); const no=f.length>=5?+f.shift():null;
      const [role,name,rating,nums]=f; const v=(nums||"").split(/\s+/).map(Number);
      const p={no, role:role.toUpperCase(), name, rating:/^\d/.test(rating)?+rating:null};
      MS_COLS.forEach((k,i)=>p[k]=v[i]||0);
      p.pts=p.tries*4+p.c*2+p.pg*2+p.fg; cur.push(p);
    }
  });
  return MS_CACHE[mid]=out;
}
const msSide=(MS,code)=>MS.players[code]||MS.players[(team(code).abbr||"").toUpperCase()]||[];
const msSum=(ps,k)=>ps.reduce((a,p)=>a+p[k],0);
const msNum=x=>parseFloat(String(x).replace("%",""));
const msColour=(code,home)=>(window.CLUB_BG&&CLUB_BG[code])||(home?"#111":"#8a8a8a");

/* ---------- scoring summary (sits under the score) ---------- */
function msSummary(MS, m){
  const H=msSide(MS,m.home), A=msSide(MS,m.away);
  const who=(ps,k)=>ps.filter(p=>p[k]>0).sort((a,b)=>b[k]-a[k]).map(p=>`<div>${esc(p.name)}${p[k]>1?` <b>(${p[k]})</b>`:""}</div>`).join("");
  const row=(label,l,r,k,always)=>{
    const nl=msNum(l), nr=msNum(r); if(!always && !nl && !nr) return "";
    return `<div class="ms-sc"><div class="ms-sch"><span class="${nl>nr?"b":""}">${l}</span><em>${label}</em><span class="${nr>nl?"b":""}">${r}</span></div>
      <div class="ms-scn"><div class="h">${who(H,k)}</div><div class="a">${who(A,k)}</div></div></div>`; };
  const tH=msSum(H,"tries"), tA=msSum(A,"tries"), cH=msSum(H,"c"), cA=msSum(A,"c");
  const potm=MS.potm?`<div class="ms-potm">${logo(MS.potm.code)}<div><small>Player of the Match</small><b>${esc(MS.potm.name)}</b></div></div>`:"";
  return `<section class="mc-card ms-sum">
    ${row("Tries",tH,tA,"tries",true)}
    ${row("Conversions",`${cH}/${tH}`,`${cA}/${tA}`,"c",tH+tA>0)}
    ${row("Penalty Goals",msSum(H,"pg"),msSum(A,"pg"),"pg")}
    ${row("Field Goals",msSum(H,"fg"),msSum(A,"fg"),"fg")}
    ${potm}</section>`;
}

/* ---------- Team Stats tab ---------- */
function msDonut(pct, col, size=150, label=""){
  const r=size/2-10, c=2*Math.PI*r, d=Math.max(0,Math.min(100,pct))/100*c;
  return `<svg class="ms-donut" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#f0f0f0" stroke-width="14"/>
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${d} ${c}" transform="rotate(-90 ${size/2} ${size/2})"/>${label}</svg>`;
}
function msBar(label, l, r, lo, fmt=x=>x){
  const a=msNum(l)||0, b=msNum(r)||0, tot=a+b||1;
  const bl=lo?a<b:a>b, br=lo?b<a:b>a;
  return `<div class="ms-bar"><div class="ms-bk">${esc(label)}</div>
    <div class="ms-brow"><span class="v l${bl?" b":""}">${fmt(l)}</span><div class="ms-track${a+b?"":" z"}"><i class="h" style="flex:${a+b?a/tot||0.0001:1}"></i><i class="a" style="flex:${a+b?b/tot||0.0001:1}"></i></div><span class="v r${br?" b":""}">${fmt(r)}</span></div></div>`;
}
function msTeamStats(MS, m){
  const H=msSide(MS,m.home), A=msSide(MS,m.away), T=MS.team, ch=msColour(m.home,true), ca=msColour(m.away,false);
  const tv=(k,i,f)=>T[k]?T[k][i]:f;
  const ph=msNum(tv("possession",0,50)), pa=msNum(tv("possession",1,100-ph));
  const comp=i=>{ const s=tv("completions",i,""); const g=String(s).match(/(\d+)\s*\/\s*(\d+)/); return g?{a:+g[1],b:+g[2],p:Math.round(+g[1]/+g[2]*100)}:null; };
  const c0=comp(0), c1=comp(1);
  const possDonut=(()=>{ const size=170, r=size/2-10, c=2*Math.PI*r, gap=3, dh=ph/100*c-gap, da=pa/100*c-gap;
    return `<svg class="ms-donut" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${ch}" stroke-width="14" stroke-dasharray="${dh} ${c}" transform="rotate(${-90-ph/100*360+gap/c*180} ${size/2} ${size/2})"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${ca}" stroke-width="14" stroke-dasharray="${da} ${c}" transform="rotate(${-90+gap/c*180} ${size/2} ${size/2})"/></svg>`; })();
  const head=`<div class="ms-thead"><span>${logo(m.home,"sm")}${esc(team(m.home).nick)}</span><span>${esc(team(m.away).nick)}${logo(m.away,"sm")}</span></div>`;
  const poss=`<section class="mc-card ms-ts" style="--ch:${ch};--ca:${ca}"><h3 class="mc-h">Possession &amp; Completions</h3>
    <div class="ms-sub">Possession %</div>
    <div class="ms-poss"><span class="${ph>pa?"b":""}">${ph}<sup>%</sup></span>${possDonut}<span class="${pa>ph?"b":""}">${pa}<sup>%</sup></span></div>
    ${c0&&c1?`<div class="ms-sub">Completion Rate</div><div class="ms-comp">
      <div>${msDonut(c0.p,ch,150)}<b class="${c0.p>c1.p?"b":""}">${c0.p}<sup>%</sup></b><small>${c0.a}/${c0.b}</small></div>
      <div>${msDonut(c1.p,ca,150)}<b class="${c1.p>c0.p?"b":""}">${c1.p}<sup>%</sup></b><small>${c1.a}/${c1.b}</small></div></div>`:""}</section>`;
  const card=(title,rows)=>`<section class="mc-card ms-ts" style="--ch:${ch};--ca:${ca}"><h3 class="mc-h">${title}</h3>${head}${rows}</section>`;
  const sum=k=>[msSum(H,k),msSum(A,k)];
  const tk=[msNum(tv("tackles",0,msSum(H,"t"))),msNum(tv("tackles",1,msSum(A,"t")))], mt=[msNum(tv("missed tackles",0,msSum(H,"mt"))),msNum(tv("missed tackles",1,msSum(A,"mt")))];
  const eff=i=>tk[i]+mt[i]?(tk[i]/(tk[i]+mt[i])*100).toFixed(1)+"%":"–";
  const B=(label,[l,r],lo,fmt)=>msBar(label,l,r,lo,fmt);
  const attack=card("Attack",
    B("Tries",[tv("tries",0,msSum(H,"tries")),tv("tries",1,msSum(A,"tries"))])
    +B("Line Breaks",[tv("line breaks",0,msSum(H,"lb")),tv("line breaks",1,msSum(A,"lb"))])
    +B("All Runs",sum("ar"))+B("All Run Metres",sum("arm"))
    +B("Tackle Busts",sum("tb"))+B("Try Assists",sum("ta"))+B("Passes",sum("pass")));
  const defence=card("Defence", B("Tackles Made",tk)+B("Missed Tackles",mt,true)+B("Effective Tackle %",[eff(0),eff(1)]));
  const kicking=card("Kicking", B("Kicks",sum("k"))+B("Kicking Metres",sum("kmg"))
    +B("Goals",[tv("goals",0,msSum(H,"c")+msSum(H,"pg")),tv("goals",1,msSum(A,"c")+msSum(A,"pg"))])+B("Field Goals",[tv("field goals",0,msSum(H,"fg")),tv("field goals",1,msSum(A,"fg"))]));
  const disc=card("Discipline", B("Errors",[tv("errors",0,msSum(H,"err")),tv("errors",1,msSum(A,"err"))],true)
    +B("Penalties Conceded",[tv("penalties conceded",0,msSum(H,"pen")),tv("penalties conceded",1,msSum(A,"pen"))],true));
  return poss+attack+defence+kicking+disc;
}

/* ---------- Player Stats tab ---------- */
const MS_TABLE=[
  ["Player",[["no","Number"],["pos","Position"],["mins","Mins Played"]]],
  ["Scoring",[["pts","Points"],["tries","Tries"],["c","Conversions"],["pg","Penalty Goals"],["fg","Field Goals"]]],
  ["Attack",[["ar","All Runs"],["arm","All Run Metres"],["lb","Line Breaks"],["tb","Tackle Busts"],["ta","Try Assists"],["pass","Passes"]]],
  ["Kicking",[["k","Kicks"],["kmg","Kicking Metres"]]],
  ["Defence",[["t","Tackles Made"],["mt","Missed Tackles"],["eff","Tackle Eff."]]],
  ["Discipline",[["err","Errors"],["pen","Penalties"]]],
  ["Rating",[["rating","Player Rating"]]] ];
// team-list order (jersey numbers) when given, otherwise by position
function msSorted(ps){ return ps.slice().sort((a,b)=> (a.no!=null&&b.no!=null) ? a.no-b.no : ((b.mins>0)-(a.mins>0))||(MS_ORDER.indexOf(a.role)-MS_ORDER.indexOf(b.role))||((b.rating||0)-(a.rating||0))); }
const msPos=p=>p.no!=null&&typeof TL_POS!=="undefined" ? (TL_POS[p.no]||"Reserve") : (MS_ROLE[p.role]||p.role);
function msPlayerStats(MS, m){
  const H=msSide(MS,m.home), A=msSide(MS,m.away);
  const top=(label,k,fmt=x=>x)=>{ const best=ps=>ps.filter(p=>p[k]!=null).sort((a,b)=>b[k]-a[k])[0]; const a=best(H), b=best(A); if(!a||!b) return "";
    return `<div class="ms-top"><div class="ms-topk">${label}</div><div class="ms-topb">
      <span class="ms-ts-l">${logo(m.home)}</span><b class="${a[k]>b[k]?"w":""}">${fmt(a[k])}</b><b class="${b[k]>a[k]?"w":""}">${fmt(b[k])}</b><span class="ms-ts-r">${logo(m.away)}</span></div>
      <div class="ms-topn"><span>${esc(a.name)}</span><span>${esc(b.name)}</span></div></div>`; };
  const topCard=`<section class="ms-tops"><h3 class="mc-h">Top Performing Players</h3>
    ${top("Most Tackles","t")}${top("Most Run Metres","arm")}${top("Most Line Breaks","lb")}${top("Highest Player Rating","rating")}</section>`;
  const cell=(p,k)=>{ if(k==="pos") return msPos(p); if(k==="no") return p.no??"-";
    if(p.mins===0 && k!=="rating") return k==="mins"?"–":"-";
    if(k==="mins") return p.mins+":00";
    if(k==="eff") return p.t+p.mt?Math.round(p.t/(p.t+p.mt)*100)+"%":"-";
    if(k==="rating") return p.rating==null?"N/A":p.rating;
    return p[k]||"-"; };
  const sv=(p,k)=>{ if(k==="pl") return p.name; if(k==="pos") return p.no??MS_ORDER.indexOf(p.role); if(k==="eff") return p.t+p.mt?p.t/(p.t+p.mt):-1; if(k==="rating") return p.rating??-1; if(p.mins===0&&k!=="no") return -1; return p[k]??-1; };
  const table=(ps,code)=>{ const rows=msSorted(ps);
    return `<div class="ms-tblw${code===m.home?" show":""}" data-team="${esc(code)}"><table class="ms-tbl"><thead>
      <tr><th class="pl srt" rowspan="2" data-k="pl" onclick="msSort(this)">Player</th>${MS_TABLE.map(([g,cols])=>`<th class="grp" colspan="${cols.length}">${g==="Player"?"":g}</th>`).join("")}</tr>
      <tr>${MS_TABLE.flatMap(([g,cols])=>cols.map(([k,l],i)=>`<th class="srt${i===0?" gs":""}" data-k="${k}" onclick="msSort(this)">${l}</th>`)).join("")}</tr></thead>
      <tbody>${rows.map((p,ri)=>`<tr data-i="${ri}" class="${p.mins===0?"dnp":""}"><td class="pl" data-v="${esc(p.name)}">${esc(p.name)}${MS.potm&&MS.potm.name===p.name?' <span class="ms-star" title="Player of the Match">★</span>':""}</td>${MS_TABLE.flatMap(([g,cols])=>cols.map(([k],i)=>`<td class="${i===0?"gs":""}${k==="pos"?" pos":""}" data-v="${sv(p,k)}">${cell(p,k)}</td>`)).join("")}</tr>`).join("")}</tbody></table></div>`; };
  const reset=`<button class="ms-reset" onclick="msSortReset(this)">↺ Default order</button>`;
  const toggle=`<div class="ms-toggle"><button class="on" onclick="msPick(this,'${esc(m.home)}')">${esc(team(m.home).nick)}</button><button onclick="msPick(this,'${esc(m.away)}')">${esc(team(m.away).nick)}</button></div>`;
  return topCard+`<section class="mc-card ms-full" data-show="${esc(m.home)}"><div class="ms-ctl">${toggle}${reset}</div><div class="ms-hint">Tap a stat to sort</div>${table(H,m.home)}${table(A,m.away)}</section>`;
}
// sort the player table: first tap = highest first, second tap = lowest first
function msSort(th){
  const card=th.closest(".ms-full"), k=th.dataset.k, text=k==="pl"||k==="pos";
  const dir = th.dataset.dir==="d" ? "a" : th.dataset.dir==="a" ? "d" : (text?"a":"d");
  card.querySelectorAll("th.srt").forEach(x=>{ x.classList.remove("on"); delete x.dataset.dir; });
  card.querySelectorAll(`th.srt[data-k="${k}"]`).forEach(x=>{ x.classList.add("on"); x.dataset.dir=dir; });
  card.querySelectorAll(".ms-tbl").forEach(tb=>{
    const idx=[...tb.querySelectorAll("thead tr:last-child th")].findIndex(x=>x.dataset.k===k), body=tb.tBodies[0];
    const val=tr=>{ const td=k==="pl"?tr.cells[0]:tr.cells[idx+1]; const v=td.dataset.v; return text&&k==="pl"?v:+v; };
    const keepDnp=!["pl","pos","no"].includes(k);
    [...body.rows].sort((a,b)=>{ if(keepDnp){ const d=a.classList.contains("dnp")-b.classList.contains("dnp"); if(d) return d; } const x=val(a), y=val(b); const c=typeof x==="string"?x.localeCompare(y):(x-y); return (dir==="a"?c:-c)||(+a.dataset.i-+b.dataset.i); }).forEach(r=>body.appendChild(r)); });
  card.classList.add("sorted");
}
function msSortReset(btn){
  const card=btn.closest(".ms-full");
  card.querySelectorAll("th.srt").forEach(x=>{ x.classList.remove("on"); delete x.dataset.dir; });
  card.querySelectorAll(".ms-tbl tbody").forEach(body=>[...body.rows].sort((a,b)=>+a.dataset.i-+b.dataset.i).forEach(r=>body.appendChild(r)));
  card.classList.remove("sorted");
}
function msPick(btn, code){ const card=btn.closest(".ms-full"); card.dataset.show=code; card.querySelectorAll(".ms-toggle button").forEach(b=>b.classList.toggle("on",b===btn)); card.querySelectorAll(".ms-tblw").forEach(w=>w.classList.toggle("show",w.dataset.team===code)); }

/* ---------- Team Lists tab (from the game's players) ---------- */
function msTeamLists(MS, m){
  const side=code=>{ const ps=msSorted(msSide(MS,code)), numbered=ps.every(p=>p.no!=null);
    const row=p=>`<div class="ms-tlr${p.mins?"":" dnp"}">${numbered?`<span class="no">${p.no}</span>`:""}<span class="nm">${esc(p.name)}</span><span class="ps">${msPos(p)}</span><span class="mn">${p.mins?p.mins+"'":"DNP"}</span></div>`;
    const groups = numbered ? [["",ps.filter(p=>p.no<=13)],["Interchange",ps.filter(p=>p.no===14||p.no===15)],["Reserves",ps.filter(p=>p.no>=16)]]
                            : [["",ps.filter(p=>p.mins>0)],["Did not take the field",ps.filter(p=>p.mins===0)]];
    return `<div class="ms-tlc"><div class="ms-tlh">${logo(code,"sm")}<b>${esc(team(code).nick)}</b></div>${groups.filter(g=>g[1].length).map(([h,l])=>`${h?`<div class="mc-sub">${h}</div>`:""}${l.map(row).join("")}`).join("")}</div>`; };
  return `<section class="mc-card"><h3 class="mc-h">Team Lists</h3><div class="ms-tl">${side(m.home)}${side(m.away)}</div></section>`;
}
