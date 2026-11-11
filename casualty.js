/* =========================================================
   CASUALTY WARD   #casualty[-CLUB|all][-inj|sus]
   ========================================================= */
function cwParse(sid){
  const txt=(window.CASUALTY_WARD||{})[sid]||"", out=[];
  const code=x=>{ x=(x||"").toUpperCase(); return teamMap[x]?x:x.replace(/2$/,""); };
  txt.replace(/\*/g,"").split(/\r?\n/).map(l=>l.trim()).filter(l=>l&&!l.startsWith("//")).forEach(l=>{
    const m=l.match(/^:(\w+):\s*(.+)$/); if(!m) return;
    const parts=m[2].split(/\s+[-–]\s+/).map(x=>x.trim());
    const reason=parts[1]||"", type=/suspen/i.test(reason)?"sus":"inj";
    out.push({code:code(m[1]), name:parts[0], reason:type==="sus"?reason.replace(/^suspen(ded|sion)\s*/i,"").replace(/^\((.*)\)$/,"$1"):reason||"Injury", ret:parts.slice(2).join(" - ")||"TBC", type});
  });
  return out;
}
function viewCasualty(clubArg, typeArg){
  const seasons=Object.keys(window.CASUALTY_WARD||{}).map(Number).sort((a,b)=>a-b);
  const sid=seasons.length?seasons[seasons.length-1]:latestSeason().id+1;
  const all=cwParse(sid);
  const clubs=Object.keys(CLUB_BG).sort((a,b)=>team(a).nick.localeCompare(team(b).nick));
  const club=clubArg&&clubs.includes(clubArg.toUpperCase())?clubArg.toUpperCase():null;
  const type=["inj","sus"].includes(typeArg)?typeArg:"all";
  const list=all.filter(p=>(!club||p.code===club)&&(type==="all"||p.type===type));
  const clubDD=dd({cls:"f-team",label:"Club",tiles:true,cols:3,trigger:club?`${logo(club,"sm")}<span class="lbl">${esc(team(club).nick)}</span>`:`<span class="lbl">All Clubs</span>`,
    items:[{href:`casualty-all-${type}`,label:"All Clubs",sel:!club}, ...clubs.map(c=>({href:`casualty-${c}-${type}`,label:team(c).nick,icon:logo(c,"sm"),sel:c===club}))]});
  const cnt=t=>all.filter(p=>(!club||p.code===club)&&(t==="all"||p.type===t)).length;
  const tabs=`<div class="cw-tabs">${[["all","All"],["inj","Injuries"],["sus","Suspensions"]].map(([k,l])=>`<a href="#casualty-${club||"all"}-${k}" class="${k===type?"on":""}">${l} <em>${cnt(k)}</em></a>`).join("")}</div>`;
  const tile=(v,l,cls="")=>`<div class="club-tile ${cls}"><b>${v}</b><span>${esc(l)}</span></div>`;
  const tiles=`<div class="club-tiles cw-tiles">${tile(all.length,"Players out")}${tile(all.filter(p=>p.type==="inj").length,"Injured","inj")}${tile(all.filter(p=>p.type==="sus").length,"Suspended","sus")}${tile(new Set(all.map(p=>p.code)).size+" / "+clubs.length,"Clubs affected")}</div>`;
  const shown=club?[club]:[...clubs.filter(c=>list.some(p=>p.code===c)),...clubs.filter(c=>!list.some(p=>p.code===c))];
  const what=type==="inj"?"injured players":type==="sus"?"suspended players":"players in the casualty ward";
  const cards=shown.map(c=>{ const ps=list.filter(p=>p.code===c);
    return `<section class="cw-club${ps.length?"":" ok"}" style="--tc:${CLUB_BG[c]||team(c).c1||"#222"}">
      <a class="cw-ch" href="#club-${c}">${logoOnDark(c)}<b>${esc(team(c).name||team(c).nick)}</b><span>${ps.length?`${ps.length} out`:"Full strength"}</span></a>
      ${ps.length?`<table class="cw-table"><thead><tr><th class="l">Player</th><th class="l">${type==="sus"?"Suspension":type==="inj"?"Injury":"Injury / Suspension"}</th><th class="l">Expected return</th></tr></thead><tbody>
        ${ps.map(p=>`<tr><td class="l"><b>${esc(p.name)}</b></td><td class="l"><span class="cw-tag ${p.type}">${p.type==="sus"?"Suspended":"Injured"}</span> ${esc(p.reason)}</td><td class="l">${esc(p.ret)}</td></tr>`).join("")}</tbody></table>`
      :(club?`<div class="cw-empty">No ${what}.</div>`:"")}
    </section>`; }).join("");
  return `${pageHead("Casualty Ward")}<div class="pbody cw-page">
    <div class="filters">${clubDD}</div>
    <div class="cw-intro"><b>Season ${sid} · ${esc(COMP.name)}</b><span>Every injured and suspended player, club by club, with their expected return.</span></div>
    ${tiles}${tabs}
    ${!all.length?`<div class="cw-clear">🩹 The casualty ward is empty. Every club is at full strength.</div>`:""}
    <div class="cw-grid${club?" one":""}">${cards}</div></div>`;
}
