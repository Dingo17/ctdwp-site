/* =========================================================
   GET TICKETS   #tickets-<match id>
   A just-for-fun ticket office. Pick a bay on the stadium map, choose
   how many tickets, add a pie or a jersey, and pay in Dingo Dollars from
   your Dingobet wallet. Tickets are saved in this browser.
   ========================================================= */
// Real stadiums: [name to match, capacity, shape, has a grass hill]. Capacities are the usual rugby league
// capacity (approximate). Shape "oval" = cricket/AFL-style oval, "rect" = rectangular football stadium.
const TK_VENUES = [
  ["suncorp",52500,"rect",0],["accor",83500,"rect",0],["commbank",30000,"rect",0],["aami park",30050,"rect",0],
  ["4 pines",17000,"rect",1],["allianz",42500,"rect",0],["gio stadium",25011,"rect",1],["mcdonald jones",30000,"rect",0],
  ["cbus",27400,"rect",0],["ocean protect",12000,"rect",1],["go media",25000,"rect",1],["queensland country bank",25000,"rect",0],
  ["helloworld",22500,"rect",1],["win stadium",23750,"rect",1],["leichhardt",20000,"oval",1],["sydney cricket ground",48000,"oval",0],
  ["optus stadium",60000,"oval",0],["belmore",19000,"oval",1],["kayo stadium",11500,"rect",1],["santos national",15000,"rect",0],
  ["industree",20059,"rect",1],["campbelltown",17500,"rect",1],["jubilee",20500,"rect",1],["1300smiles",26500,"rect",1],
  ["tio stadium",12500,"oval",1],["adelaide oval",53583,"oval",0],["carrington park",12000,"rect",1],["glen willow",10000,"rect",1],
  ["eden park",50000,"oval",0],["fmg stadium",25800,"rect",1],["allegiant",65000,"rect",0],["c.ex coffs",10000,"rect",1],
  ["brick community",25138,"rect",0],["hbf park",20500,"rect",0],["hfc bank",15446,"rect",0],["brewdog",18000,"rect",0],
  ["accu stadium",24121,"rect",0],["forsyth barr",30748,"rect",0],["melbourne cricket",100024,"oval",0],["hnry stadium",34500,"oval",0],
  ["salter oval",10000,"oval",1],["headingley",21062,"rect",0],["mkm stadium",25586,"rect",0],["apollo projects",18000,"rect",0],
  ["wembley",90000,"rect",0],["sunshine coast",12000,"rect",1],["mcdonalds park",10000,"rect",1],["gabba",42000,"oval",0],
  ["marvel",53359,"oval",0],["everbank",67814,"rect",0],["old trafford",74000,"rect",0],["stadium taranaki",25000,"rect",1],
  ["bb print",12000,"rect",1],["apex oval",9000,"oval",1],["barlow park",18000,"oval",1],["crown oil",10249,"rect",0],
  ["doncaster",15231,"rect",0],["corpacq",12000,"rect",0],["halliwell jones",15300,"rect",0],["progress with unity",12000,"rect",0],
  ["onebore",12000,"rect",0],["scully park",10000,"rect",1],["skully park",10000,"rect",1],["north sydney oval",20000,"oval",1],
  ["dcbl",13350,"rect",0],["craven park",12225,"rect",0],["york community",8500,"rect",0],["the shay",14000,"rect",0],
  ["cherry red",9215,"rect",0],["alexander stadium",18000,"oval",0],["odsal",22000,"oval",1],["hill dickinson",52888,"rect",0],
  ["mufg",68000,"oval",0],["national stadium",68000,"oval",0]
];
function tkVenue(venue){ const v=(venue||"").toLowerCase(); const f=TK_VENUES.find(x=>v.includes(x[0]));
  return f?{cap:f[1],shape:f[2],hill:!!f[3],known:true}:{cap:12000+dbHash(v)%18000,shape:"rect",hill:false,known:false}; }
/* ---------- stadium layouts ----------
   Every ground is drawn with a rectangular field and one of five real-world layouts:
   bowl  – fully enclosed two-tier stadium (Suncorp, Accor, CommBank, AAMI Park…)
   oval  – cricket/AFL oval with two tiers (MCG, SCG, Optus, Adelaide Oval…)
   ovalhill – suburban oval: grandstand plus grass hills (Leichhardt, Belmore…)
   ground – main grandstand, opposite stand or hill, ends as stands or hills (Brookvale, Penrith, Canberra…)
   four  – four separate stands with open corners (English Super League grounds, Suva, Port Moresby…)
   Angles: 0 = right end, 90 = far side, 180 = left end, 270 = main grandstand (bottom). */
const TK_STYLE = [
  ["suncorp",{t:"bowl"}],["accor",{t:"bowl",names:{L:"Southern Stand",R:"Northern Stand"}}],["commbank",{t:"bowl"}],["aami park",{t:"bowl"}],
  ["allianz",{t:"bowl"}],["cbus",{t:"bowl"}],["queensland country bank",{t:"bowl"}],["mcdonald jones",{t:"bowl"}],["allegiant",{t:"bowl"}],
  ["wembley",{t:"bowl"}],["old trafford",{t:"bowl",names:{M:"Sir Bobby Charlton Stand",O:"Sir Alex Ferguson Stand",L:"Stretford End",R:"East Stand"}}],
  ["everbank",{t:"bowl"}],["hill dickinson",{t:"bowl"}],["forsyth barr",{t:"bowl"}],
  ["melbourne cricket",{t:"oval",names:{M:"Great Southern Stand",O:"MCC Members Reserve",L:"Ponsford Stand",R:"Shane Warne Stand"}}],
  ["sydney cricket ground",{t:"oval",names:{M:"Members Pavilion & M.A. Noble Stand",O:"Victor Trumper Stand",L:"Dally Messenger Stand",R:"Clive Churchill Stand"}}],
  ["adelaide oval",{t:"oval",hillR:true,names:{M:"Western Stand",O:"Eastern Stand",L:"Riverbank Stand",R:"The Hill"}}],
  ["optus stadium",{t:"oval"}],["marvel",{t:"oval"}],["gabba",{t:"oval"}],["eden park",{t:"oval",names:{M:"South Stand",O:"North Stand",L:"West Stand",R:"East Terrace"}}],
  ["hnry stadium",{t:"oval"}],["mufg",{t:"oval"}],["national stadium",{t:"oval"}],
  ["leichhardt",{t:"ovalhill"}],["belmore",{t:"ovalhill"}],["north sydney oval",{t:"ovalhill"}],["apex oval",{t:"ovalhill"}],["salter oval",{t:"ovalhill"}],
  ["barlow park",{t:"ovalhill"}],["tio stadium",{t:"ovalhill"}],["alexander stadium",{t:"ovalhill"}],["odsal",{t:"ovalhill"}],
  ["4 pines",{t:"ground",O:"hill",L:"stand",R:"hill"}],["helloworld",{t:"ground",O:"hill",L:"hill",R:"hill"}],["gio stadium",{t:"ground",O:"stand",L:"hill",R:"hill"}],
  ["win stadium",{t:"ground",O:"stand",L:"stand",R:"hill"}],["ocean protect",{t:"ground",O:"stand",L:"stand",R:"hill"}],["go media",{t:"ground",O:"stand",L:"stand",R:"hill"}],
  ["jubilee",{t:"ground",O:"hill",L:"hill",R:"hill"}],["campbelltown",{t:"ground",O:"hill",L:"hill",R:"hill"}],["kayo stadium",{t:"ground",O:"hill",L:"hill",R:"hill"}],
  ["industree",{t:"ground",O:"stand",L:"stand",R:"hill"}],["1300smiles",{t:"ground",O:"hill",L:"hill",R:"hill"}],["fmg stadium",{t:"ground",O:"stand",L:"hill",R:"hill"}],
  ["stadium taranaki",{t:"ground",O:"stand",L:"hill",R:"hill"}],["carrington",{t:"ground",O:"hill",L:"hill",R:"hill"}],["glen willow",{t:"ground",O:"hill",L:"hill",R:"hill"}],
  ["c.ex coffs",{t:"ground",O:"hill",L:"hill",R:"hill"}],["sunshine coast",{t:"ground",O:"hill",L:"hill",R:"hill"}],["mcdonalds park",{t:"ground",O:"hill",L:"hill",R:"hill"}],
  ["scully park",{t:"ground",O:"hill",L:"hill",R:"hill"}],["skully park",{t:"ground",O:"hill",L:"hill",R:"hill"}],["bb print",{t:"ground",O:"hill",L:"hill",R:"hill"}]
];
const TK_BASE = { "Platinum":160, "Gold":115, "Silver":75, "Bronze":52, "Home Bay":42, "Away Bay":42, "General Admission":29, "The Hill":24, "Family Zone":22, "Corporate":0 };
const TK_VIEW = {
  "Platinum":"Right on halfway, low enough to hear the hits land. The best seats in the house.",
  "Gold":"Sideline seats near halfway. You'll see every set play develop.",
  "Silver":"Up high on the sideline, perfect for watching the shape of the game (and the Mexican wave).",
  "Bronze":"Behind the posts with a front-row view of every try at this end.",
  "Home Bay":"Behind the posts with the home faithful. Drums, flags and a lot of noise.",
  "Away Bay":"Where the travelling fans sit. Wear your colours with pride.",
  "General Admission":"General admission. Grab any spare seat. Great value and a great atmosphere.",
  "The Hill":"Grass, sunshine and questionable singing. Bring a blanket.",
  "Family Zone":"Alcohol-free, face painting at half-time and the mascot visits twice.",
  "Corporate":"Members and sponsors only."
};
function tkStyle(venue){ const v=(venue||"").toLowerCase(); const f=TK_STYLE.find(x=>v.includes(x[0])); if(f) return f[1];
  const known=TK_VENUES.find(x=>v.includes(x[0])); return known&&known[3]?{t:"ground",O:"hill",L:"hill",R:"hill"}:{t:"four"}; }
// [code, name, category, base, {tier,a0,a1}, gate, view]
function tkLayout(venue){
  const st=tkStyle(venue), N=Object.assign({M:(st.t==="bowl"||st.t==="oval")?"Western Stand":"Western Grandstand",O:"Eastern Stand",L:"Southern End",R:"Northern End"}, st.names||{});
  const out=[], add=(name,cat,tier,a0,a1,gate)=>out.push([null,name,cat,TK_BASE[cat],{tier,a0,a1},gate,TK_VIEW[cat]]);
  const two=st.t==="bowl"||st.t==="oval", lvl=t=>two?(t?" – Upper":" – Lower"):"";
  if(two){
    add(N.M+lvl(0),"Gold",0,215,250,"A"); add(N.M+lvl(0),"Platinum",0,250,290,"A"); add(N.M+lvl(0),"Gold",0,290,325,"A");
    add(N.O+lvl(0),"Family Zone",0,35,62,"C"); add(N.O+lvl(0),"Silver",0,62,118,"C"); add(N.O+lvl(0),"Gold",0,118,145,"C");
    if(st.hillR) add(N.R,"The Hill",0,-35,35,"B"); else add(N.R+lvl(0),"Home Bay",0,-35,35,"B");
    add(N.L+lvl(0),"Bronze",0,145,180,"D"); add(N.L+lvl(0),"Away Bay",0,180,215,"D");
    add(N.M+lvl(1),"Silver",1,215,255,"A"); add(N.M+" – Corporate Level","Corporate",1,255,285,"A"); add(N.M+lvl(1),"Silver",1,285,325,"A");
    add(N.O+lvl(1),"Silver",1,35,145,"C"); if(!st.hillR) add(N.R+lvl(1),"General Admission",1,-35,35,"B"); else add(N.L.replace(/ Stand$/,"")+" – Home Bay","Home Bay",1,-35,35,"B"); add(N.L+lvl(1),"General Admission",1,145,215,"D");
  } else if(st.t==="ovalhill"){
    add(N.M,"Gold",0,225,255,"A"); add(N.M,"Platinum",0,255,285,"A"); add(N.M,"Gold",0,285,315,"A");
    add("Family Mound","Family Zone",0,315,345,"A"); add("Northern Hill – Home Fans","Home Bay",0,-15,45,"B");
    add("Eastern Hill","The Hill",0,45,135,"C"); add("Southern Hill – Away Fans","Away Bay",0,135,175,"D"); add("Southern Hill","The Hill",0,175,225,"D");
  } else if(st.t==="ground"){
    add(N.M,"Family Zone",0,218,245,"A"); add(N.M,"Platinum",0,245,295,"A"); add(N.M,"Gold",0,295,322,"A");
    if(st.O==="hill") add("Eastern Hill","The Hill",0,40,140,"C"); else { add(N.O,"Bronze",0,40,70,"C"); add(N.O,"Silver",0,70,110,"C"); add(N.O,"Bronze",0,110,140,"C"); }
    add(N.R.replace("End",st.R==="hill"?"Hill":"End")+" – Home Fans","Home Bay",0,-32,32,"B");
    if(st.L==="hill"){ add(N.L.replace("End","Hill"),"The Hill",0,148,182,"D"); add(N.L.replace("End","Hill")+" – Away Fans","Away Bay",0,182,212,"D"); }
    else { add(N.L,"General Admission",0,148,180,"D"); add(N.L+" – Away Bay","Away Bay",0,180,212,"D"); }
  } else {
    add(N.M,"Gold",0,225,252,"A"); add(N.M,"Platinum",0,252,288,"A"); add(N.M,"Gold",0,288,315,"A");
    add(N.O,"Family Zone",0,48,72,"C"); add(N.O,"Silver",0,72,132,"C");
    add(N.R+" – Home Bay","Home Bay",0,-28,28,"B"); add(N.L,"Bronze",0,152,180,"D"); add(N.L+" – Away Bay","Away Bay",0,180,208,"D");
  }
  const cnt=[100,200]; let hc=0;
  return out.map(s=>{ s[0]=(s[2]==="The Hill")?"H"+(++hc):String(++cnt[s[4].tier]); s[7]=/Hill|Mound|Terrace/.test(s[1])||s[2]==="The Hill"; return s; });
}
const TK_CAT_COL = { "Platinum":"#1b1b1b", "Gold":"#c9a227", "Silver":"#8e9aa6", "Bronze":"#b87333", "General Admission":"#3b7dd8", "The Hill":"#2e9e4f", "Family Zone":"#f08c00", "Corporate":"#bbb" };
const TK_ADDONS = [
  ["pie","Pie & drink combo",12,"🥧","per person"],
  ["jersey","Home team jersey",95,"👕",""],
  ["scarf","Club scarf",25,"🧣",""],
  ["park","Parking pass",20,"🚗",""],
  ["shout","Big-screen shout-out",15,"📺","your message on the screen at half-time"]
];
let TK={mid:null, sec:null, qty:{adult:2,child:0,conc:0}, add:{}, msg:"", done:null};
const TK_NAT_COL={AUS:"#00843d",NZL:"#1a1a1a",ENG:"#c8102e",TON:"#c8102e",SAM:"#1d4ea0",FIJ:"#3a8fd0",PNG:"#b5121b",COK:"#0b6b3a",NSW:"#2a8fd6",QLD:"#7a0026",MAO:"#1a1a1a",IND:"#c8102e",FRA:"#1d4ea0",WAL:"#c8102e",SCO:"#1d4ea0",IRE:"#0b6b3a",ITA:"#1d4ea0",LEB:"#c8102e",GRE:"#1d4ea0",JAM:"#0b6b3a",NED:"#f07c00",SRB:"#c8102e",USA:"#1d4ea0",CAN:"#c8102e",WIG:"#a6192e",STH:"#c8102e"};
const tkCol=c=>CLUB_BG[c]||TK_NAT_COL[c]||TK_NAT_COL[mcKey(c)]||team(c).c1||"#333";
function tkGame(mid){ const g=dbMatch(mid); return g&&g.m.home!=="TBC"&&g.m.away!=="TBC"?g:null; }
function tkCapacity(venue){ return tkVenue(venue).cap; }
// how big a crowd each team pulls (0 = small, 1 = huge)
const TK_FANS = { BRI:1, WAR:0.9, DOL:0.65, NQL:0.55, SOU:0.55, PER:0.55, MEL:0.45, PEN:0.45, NEW:0.45, PAR:0.4, CBY:0.4, CAN:0.35,
  SYD:0.35, WST:0.35, MAN:0.3, SGI:0.3, GLD:0.2, CRO:0.2, NSW:1, QLD:1, AUS:0.7, NZL:0.7, PNG:0.9, TON:0.8, SAM:0.6, ENG:0.5, FIJ:0.5,
  WIG:0.5, STH:0.4, MAO:0.6, IND:0.6 };
const tkFan=c=>TK_FANS[c]??TK_FANS[mcKey(c)]??0.3;
// 1 = the two best teams in the comp, 0 = the two worst
function tkRankScore(g){
  try{
    if(g.c==="draw"){ const PS=pwrBuild().seasons.find(x=>x.id===g.sid); if(!PS) return 0.5;
      const snap=[...PS.snaps].reverse().find(x=>x.ri==null||x.ri<g.ri)||PS.snaps[0], n=snap.rows.length;
      const a=snap.rank[g.m.home], b=snap.rank[g.m.away]; return a&&b?1-((a+b-2)/(2*(n-1))):0.5; }
    if(["intl","rlwc","test"].includes(g.c)){ const irl=dbIrl(), list=Object.entries(irl).sort((x,y)=>y[1]-x[1]).map(x=>x[0]), n=list.length;
      const a=list.indexOf(mcKey(g.m.home))+1, b=list.indexOf(mcKey(g.m.away))+1; return a>0&&b>0?1-((a+b-2)/(2*(n-1))):0.4; }
  }catch(e){}
  return 0.5;
}
// how many rounds away a game is: 0 = this round / next up
function tkDistance(g){
  const s=g.s; if(!s) return 0;
  if(g.c==="origin"){ const ms=s.rounds[g.ri].matches; let n=0; for(let i=0;i<g.mi;i++) if(!played(ms[i])) n++; return n; }
  const cur=s.rounds.findIndex(r=>!(r.rep&&g.c==="draw") && r.matches.some(m=>!played(m)));
  return cur<0?0:Math.max(0,g.ri-cur);
}
function tkDemand(g){
  const r=g.r, m=g.m, tags=[], noise=((dbHash(m.mid)%17)-8)/100;
  const fan=(tkFan(m.home)+tkFan(m.away))/2, big=Math.max(tkFan(m.home),tkFan(m.away)), rank=tkRankScore(g);
  let sold=0.28+0.32*fan+0.08*big+0.22*rank+noise, d=1+0.3*fan+0.25*rank;
  const origin=g.c==="origin";
  if(r.name==="Grand Final"){ sold+=1; d=Math.max(d,3.4); tags.push("Grand Final"); }
  else if(/week 3/i.test(r.name)){ sold+=0.45; d*=2.1; tags.push("Preliminary final"); }
  else if(/week 2/i.test(r.name)){ sold+=0.35; d*=1.8; tags.push("Semi-final"); }
  else if(r.finals){ sold+=0.28; d*=1.6; tags.push("Finals footy"); }
  else if(r.isFinal){ sold+=/^final$/i.test(r.name)||(m.label||"").match(/final$/i)?0.5:0.3; d*=/^final$/i.test(r.name)?2:1.6; tags.push(/^final$/i.test(r.name)?"Final":"Knockout footy"); }
  if(origin){ sold+=1; d=Math.max(d,2.8); tags.push("State of Origin"); }
  if(r.theme){ sold+=0.04; d+=0.05; tags.push(r.theme); }
  const DERBY=[["BRI","DOL"],["SOU","SYD"],["CRO","SGI"],["PAR","WST"],["NQL","BRI"],["CBY","CAN"],["MAN","SYD"],["PEN","PAR"],["AUS","NZL"],["NSW","QLD"]];
  if(!origin && DERBY.some(([a,b])=>(m.home===a&&m.away===b)||(m.home===b&&m.away===a))){ sold+=0.1; d+=0.15; tags.push("Derby"); }
  if(rank>=0.82 && !r.finals && !origin) tags.push("Top-of-the-table clash");
  if(big>=0.9 && !origin) tags.push(`${team(tkFan(m.home)>=tkFan(m.away)?m.home:m.away).nick} fans turn out in force`);
  // Origin and Grand Finals: sold out 9 times in 10, otherwise a handful of resale seats
  let soldOut=false;
  if(origin||r.name==="Grand Final"){ soldOut=dbHash("so"+m.mid)%10!==0; sold=soldOut?1:0.995; }
  else { sold=Math.min(/week [12]/i.test(r.name)?0.985:1,Math.max(0.2,sold)); soldOut=sold>=0.995; }
  // games further away haven't sold as many yet: demand builds as the game gets closer
  const dist=tkDistance(g);
  if(dist>0){ const floor=0.1+0.12*fan, target=Math.min(sold,0.99); sold=floor+(target-floor)*Math.exp(-dist/3.2); soldOut=false;
    if(dist>=6){ d=Math.round(d*0.9*100)/100; tags.unshift("Early bird: 10% off"); } else tags.unshift(`${dist} round${dist>1?"s":""} away`); }
  else if(!soldOut){ sold=Math.min(r.finals&&/week [12]/i.test(r.name)?0.985:0.99, sold+0.15); if(!r.finals && !origin) tags.unshift("Next up"); }   // the last-week rush
  let resale=null; try{ const b=(dbWallet().ballot||{})[m.mid]; if(soldOut&&b&&b.won) resale=b.sec; }catch(e){}
  return {d:Math.round(d*100)/100, tags, sold, soldOut, resale};
}
function tkPrice(base, d){ return base ? Math.max(9.95, Math.round(base*d)-0.05) : 0; }
function tkSeatsLeft(sec, g, dm){ const cap=tkCapacity(venueOf(g.m)), h=dbHash(g.m.mid+sec[0]);
  if(dm.resale) return sec[0]===dm.resale?4:0;
  if(sec[2]==="Corporate"||dm.soldOut) return 0;
  const base=cap*({"Platinum":.07,"Gold":.12,"Silver":.11,"Bronze":.1,"Home Bay":.08,"Away Bay":.04,"General Admission":.12,"The Hill":.06,"Family Zone":.05}[sec[2]]||.05);
  const prem={"Platinum":1.4,"Gold":1.2,"Home Bay":1.3}[sec[2]]||1;   // the best seats go first
  const left=Math.round(base*Math.max(0,1-dm.sold*prem*0.92)*(0.4+(h%120)/100)*(dm.sold>0.97?0.3:1)); return left<15?0:left; }
function tkTickets(){ const W=dbWallet(); W.tickets=W.tickets||[]; return W.tickets; }
function tkCode(id){ // a QR-style pattern from the ticket id
  const r=dbRng(dbHash(id)), n=21, cells=[]; const finder=(x,y)=>(x<7&&y<7)||(x>=n-7&&y<7)||(x<7&&y>=n-7);
  for(let y=0;y<n;y++) for(let x=0;x<n;x++){ let on;
    if(finder(x,y)){ const fx=x>=n-7?x-(n-7):x, fy=y>=n-7?y-(n-7):y; on=fx===0||fy===0||fx===6||fy===6||(fx>=2&&fx<=4&&fy>=2&&fy<=4); } else on=r()<0.5;
    if(on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`); }
  return `<svg class="tk-qr" viewBox="-1 -1 ${n+2} ${n+2}"><rect x="-1" y="-1" width="${n+2}" height="${n+2}" fill="#fff"/><g fill="#111">${cells.join("")}</g></svg>`;
}
function tkTicketCard(t){
  const g=tkGame(t.mid), m=g?g.m:null, H=t.home, A=t.away, col=tkCol(H), done=m&&played(m);
  return `<div class="tk-ticket${done?" used":""}" style="--tc:${col}">
    <div class="tk-tl"><div class="tk-tteams">${logoOnDark(H)}<b>${esc(team(H).nick)} <i>v</i> ${esc(team(A).nick)}</b>${logoOnDark(A)}</div>
      <div class="tk-tmeta">${esc(t.when)}<br>${esc(t.venue)}</div>
      <div class="tk-tseat"><div><small>Gate</small><b>${esc(t.gate)}</b></div><div><small>Bay</small><b>${esc(t.sec)}</b></div><div><small>Row</small><b>${esc(t.row)}</b></div><div><small>Seats</small><b>${esc(t.seats)}</b></div></div>
      <div class="tk-tcat">${esc(t.cat)} · ${t.n} ticket${t.n>1?"s":""}${t.addons&&t.addons.length?" · "+t.addons.map(esc).join(", "):""}</div>
      ${t.msg?`<div class="tk-tmsg">📺 “${esc(t.msg)}”</div>`:""}</div>
    <div class="tk-tr">${tkCode(t.id)}<small>${esc(t.id.toUpperCase())}</small>${done?`<span class="tk-stamp">Attended<br>${m.hs}–${m.as}</span>`:""}</div></div>`;
}
function tkMap(g, dm){
  const H=g.m.home, A=g.m.away, hc=tkCol(H), ac=tkCol(A), venue=venueOf(g.m), st=tkStyle(venue), secs=tkLayout(venue);
  const oval=st.t==="oval"||st.t==="ovalhill", n=oval?2:4.2;
  const R=oval?[[184,122,220,152],[226,158,258,184]]:[[156,102,194,136],[200,142,234,172]];
  const cx=300, cy=205, f=x=>x.toFixed(1);
  const pt=(a,b,deg)=>{ const r=deg*Math.PI/180, c=Math.cos(r), s=Math.sin(r); return [cx+a*Math.sign(c)*Math.pow(Math.abs(c),2/n), cy-b*Math.sign(s)*Math.pow(Math.abs(s),2/n)]; };
  const band=(ia,ib,oa,ob,a0,a1)=>{ const P=[]; for(let d=a0; d<a1; d+=2) P.push(pt(oa,ob,d)); P.push(pt(oa,ob,a1)); for(let d=a1; d>a0; d-=2) P.push(pt(ia,ib,d)); P.push(pt(ia,ib,a0)); return "M"+P.map(p=>f(p[0])+","+f(p[1])).join("L")+"Z"; };
  const tn=c=>{ const nk=team(c).nick; return (nk.length>11?mcKey(c):nk).toUpperCase(); };
  const label=cat=>cat==="Home Bay"?tn(H):cat==="Away Bay"?tn(A):cat==="General Admission"?"GA":cat==="The Hill"?"HILL":cat==="Family Zone"?"FAMILY":cat==="Corporate"?"BOXES":cat.toUpperCase();
  const colour=cat=>cat==="Home Bay"?hc:cat==="Away Bay"?ac:TK_CAT_COL[cat];
  const shapes=secs.map(s=>{ const [id,name,cat,,G]=s, [ia,ib,oa,ob]=R[G.tier], a0=G.a0+1.2, a1=G.a1-1.2;
    const left=tkSeatsLeft(s,g,dm), sold=!left, mid=(G.a0+G.a1)/2, lp=pt((ia+oa)/2,(ib+ob)/2,mid), span=G.a1-G.a0;
    const side=Math.abs(Math.cos(mid*Math.PI/180))>0.8, small=span<34;
    return `<g class="tk-sec${sold?" sold":""}${cat==="The Hill"?" hill":s[7]?" grass":""}${TK.sec===id?" on":""}" data-sec="${id}" ${sold?"":`onclick="tkPick('${id}')"`}><title>${esc(name)} · Bay ${esc(id)}</title><path d="${band(ia,ib,oa,ob,a0,a1)}" fill="${colour(cat)}"/>
      <text x="${f(lp[0])}" y="${f(lp[1]+3.5)}" text-anchor="middle"${small?' class="sm"':""}${side?` transform="rotate(-90 ${f(lp[0])} ${f(lp[1])})"`:""}>${esc(label(cat))}</text></g>`; }).join("");
  const fw=262, fh=150, fx=cx-fw/2, fy=cy-fh/2, ig=18, ln=[0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9];
  const field=`<rect x="${fx-7}" y="${fy-7}" width="${fw+14}" height="${fh+14}" rx="3" fill="#1c7d3c"/>
    <g fill="#219048">${[0,2,4,6,8].map(i=>`<rect x="${f(fx+ig+(fw-2*ig)*i/10)}" y="${fy}" width="${f((fw-2*ig)/10)}" height="${fh}"/>`).join("")}</g>
    <g stroke="rgba(255,255,255,.8)" stroke-width="1.1" fill="none"><rect x="${fx}" y="${fy}" width="${fw}" height="${fh}"/>
      ${ln.map(l=>`<line x1="${f(fx+ig+(fw-2*ig)*l)}" y1="${fy}" x2="${f(fx+ig+(fw-2*ig)*l)}" y2="${fy+fh}"${l===0.5?' stroke-width="1.7"':(l===0.2||l===0.8)?'':' stroke-dasharray="3 3"'}/>`).join("")}
      <line x1="${fx+ig}" y1="${fy}" x2="${fx+ig}" y2="${fy+fh}" stroke-width="1.7"/><line x1="${fx+fw-ig}" y1="${fy}" x2="${fx+fw-ig}" y2="${fy+fh}" stroke-width="1.7"/></g>
    <g stroke="#fff" stroke-width="2.4"><line x1="${fx+ig}" y1="${cy-9}" x2="${fx+ig}" y2="${cy+9}"/><line x1="${fx+fw-ig}" y1="${cy-9}" x2="${fx+fw-ig}" y2="${cy+9}"/></g>
    <image href="${esc(team(A).logo)}" x="${cx-80}" y="${cy-17}" width="34" height="34" opacity=".5"/><image href="${esc(team(H).logo)}" x="${cx+46}" y="${cy-17}" width="34" height="34" opacity=".5"/>`;
  const W=oval?556:500, Hh=oval?396:372, main=(secs.find(s=>s[2]==="Platinum")||["","Main grandstand"])[1].replace(/ – .*$/,"");
  return `<svg class="tk-map" viewBox="${cx-W/2} ${cy-Hh/2-4} ${W} ${Hh+14}">${oval?`<ellipse cx="${cx}" cy="${cy}" rx="${R[0][0]-3}" ry="${R[0][1]-3}" fill="#176b33"/>`:""}${field}${shapes}
    <text x="${cx}" y="${cy+Hh/2+7}" text-anchor="middle" class="tk-main">${esc(main)} (main grandstand)</text></svg>`;
}
function tkTotals(g, dm){
  const s=tkLayout(venueOf(g.m)).find(x=>x[0]===TK.sec); if(!s) return null;
  const p=tkPrice(s[3], dm.d*(dm.resale?1.5:1)), n=TK.qty.adult+TK.qty.child+TK.qty.conc;
  const tix=TK.qty.adult*p+TK.qty.child*(Math.round(p*0.5)-0.05)+TK.qty.conc*(Math.round(p*0.7)-0.05);
  const add=TK_ADDONS.reduce((a,[k,,pr])=>a+(TK.add[k]?(k==="pie"?pr*n:pr):0),0);
  const fee=n?2.95:0;
  return {s,p,n,tix,add,fee,total:Math.round((tix+add+fee)*100)/100};
}
function tkApp(){
  const g=tkGame(TK.mid), dm=tkDemand(g), m=g.m, W=dbWallet(), T=tkTotals(g,dm);
  const sel=T&&T.s, mine=tkTickets().filter(t=>t.mid===TK.mid);
  const counter=(k,l,sub)=>`<div class="tk-cnt"><div><b>${l}</b><small>${sub}</small></div><button onclick="tkQty('${k}',-1)" ${TK.qty[k]<=0?"disabled":""}>−</button><span>${TK.qty[k]}</span><button onclick="tkQty('${k}',1)">+</button></div>`;
  const step2 = sel ? `<div class="tk-step"><h3><span>2</span>How many?</h3>
      ${counter("adult","Adult",dbMoney(T.p))}${counter("child","Child (under 16)",dbMoney(Math.round(T.p*0.5)-0.05))}${counter("conc","Concession",dbMoney(Math.round(T.p*0.7)-0.05))}</div>
    <div class="tk-step"><h3><span>3</span>Make it a day out</h3><div class="tk-adds">
      ${TK_ADDONS.map(([k,l,pr,ic,note])=>`<label class="tk-add${TK.add[k]?" on":""}"><input type="checkbox" ${TK.add[k]?"checked":""} onchange="tkAdd('${k}',this.checked)"><span class="ic">${ic}</span><span class="tx"><b>${k==="jersey"?esc(team(m.home).nick)+" jersey":l}</b><small>${dbMoney(pr)}${note?" "+note:""}</small></span></label>`).join("")}</div>
      ${TK.add.shout?`<div class="tk-shout"><input maxlength="60" placeholder="Your big-screen message (60 characters)" value="${esc(TK.msg)}" oninput="TK.msg=this.value;document.getElementById('tkScreen').textContent=this.value||'Your message here'"><div class="tk-screen"><span id="tkScreen">${esc(TK.msg||"Your message here")}</span></div></div>`:""}
    </div>` : `<div class="tk-hint">👆 Tap a bay on the stadium map to see prices and seats.</div>`;
  const summary = sel ? `<div class="tk-sum"><h3>Your order</h3>
      <div class="tk-line"><span>${esc(sel[1])}</span></div>
      <div class="tk-line"><span>${T.n} ticket${T.n===1?"":"s"}</span><b>${dbMoney(T.tix)}</b></div>
      ${T.add?`<div class="tk-line"><span>Extras</span><b>${dbMoney(T.add)}</b></div>`:""}
      <div class="tk-line sm"><span>Booking fee (it wouldn't feel real without one)</span><b>${dbMoney(T.fee)}</b></div>
      <div class="tk-line tot"><span>Total</span><b>${dbMoney(T.total)}</b></div>
      <button class="tk-buy" onclick="tkBuy()" ${!T.n||T.total>W.balance?"disabled":""}>${!T.n?"Choose your tickets":T.total>W.balance?"Not enough Dingo Dollars":"Buy tickets"}</button>
      <small>Paid with Dingo Dollars from your <a href="#dingobet">Dingobet</a> wallet · Balance ${dbMoney(W.balance)}${T.total>W.balance?" · claim your daily bonus there":""}</small></div>` : "";
  const info = sel ? `<div class="tk-info" style="--cc:${sel[2]==="Home Bay"?(tkCol(m.home)):sel[2]==="Away Bay"?(tkCol(m.away)):TK_CAT_COL[sel[2]]}"><small>${esc(sel[2])} · Gate ${sel[5]}</small><b>${esc(sel[1])}</b><p>${esc(sel[6])}</p><div><span>${dbMoney(T.p)} <small>per adult</small></span><span>${tkSeatsLeft(sel,g,dm).toLocaleString()} <small>seats left</small></span></div></div>` : "";
  return `${TK.done?`<div class="tk-done"><div class="tk-confetti">${Array.from({length:40},(_,i)=>`<i style="left:${(i*37)%100}%;animation-delay:${(i%10)/10}s;background:${["#00cf5d","#ffd23f","#ff5c8a","#3b7dd8","#fff"][i%5]}"></i>`).join("")}</div><h2>🎉 You're going to the footy!</h2><p>Your tickets are below. See you at Gate ${esc(TK.done.gate)}.</p></div>`:""}
    ${mine.length?`<h2 class="section-title">Your tickets</h2><div class="tk-mine">${mine.slice().reverse().map(tkTicketCard).join("")}</div>`:""}
    ${played(m)?`<div class="tk-hint">This game has been played (${m.hs}–${m.as}). Tickets are no longer on sale.</div>`:dm.soldOut&&!dm.resale?tkSoldOut(g,dm):`
    ${dm.resale?`<div class="tk-won">🎉 You won the ballot! ${tkMaxTix()} resale seats are waiting for you in Bay ${esc(dm.resale)} (resale prices are 50% higher).</div>`:""}
    <h2 class="section-title">${mine.length?"Buy more tickets":"Pick your seats"}</h2>
    <div class="tk-grid"><div class="tk-left"><div class="tk-step"><h3><span>1</span>Choose a bay</h3><div class="tk-venue"><b>${esc(venueOf(m).split(",")[0])}</b> · ${({bowl:"Enclosed two-tier stadium",oval:"Oval, two tiers",ovalhill:"Suburban oval with hills",ground:"Grandstand and hills",four:"Four-stand ground"})[tkStyle(venueOf(m)).t]} · ${tkVenue(venueOf(m)).cap.toLocaleString()} capacity</div>${tkMap(g,dm)}
        <div class="tk-legend">${["Platinum","Gold","Silver","Bronze","General Admission","The Hill","Family Zone"].filter(c=>tkLayout(venueOf(m)).some(s=>s[2]===c)).map(c=>`<span><i style="background:${TK_CAT_COL[c]}"></i>${c}</span>`).join("")}<span><i style="background:${tkCol(m.home)}"></i>Home bay</span><span><i style="background:${tkCol(m.away)}"></i>Away bay</span></div></div>${info}</div>
      <div class="tk-right">${step2}${summary}</div></div>`}`;
}
function tkMaxTix(){ return 4; }
function tkSoldOut(g,dm){
  const W=dbWallet(), b=(W.ballot||{})[g.m.mid];
  return `<div class="tk-soldout"><div class="tk-so-badge">SOLD OUT</div>
    <h3>Every seat for this one is gone.</h3>
    <p>${g.c==="origin"?"Origin tickets never last long.":g.r.name==="Grand Final"?"It's the Grand Final. Of course it's sold out.":"Demand was through the roof."} But a few fans always hand their tickets back…</p>
    ${b?`<div class="tk-ballot lost">😔 No luck in the ballot this time. You were entry #${b.n.toLocaleString()}. Better luck next game!</div>`
       :`<button class="tk-buy" onclick="tkBallot()">🎟️ Enter the resale ballot</button><small>One entry per game · about 1 in 4 entries win</small>`}
    <div class="tk-somap">${tkMap(g,dm)}</div></div>`;
}
function tkBallot(){
  const g=tkGame(TK.mid), W=dbWallet(); W.ballot=W.ballot||{}; if(W.ballot[TK.mid]) return;
  const won=Math.random()<0.25, secs=tkLayout(venueOf(g.m)).filter(s=>s[2]!=="Corporate"), sec=secs[Math.floor(Math.random()*secs.length)][0];
  W.ballot[TK.mid]={won, sec, n:1000+Math.floor(Math.random()*48000), t:Date.now()}; dbSave();
  const el=document.getElementById("tkApp"); if(el){ el.innerHTML=`<div class="tk-drawing"><div class="tk-spin">🎟️</div><b>Drawing the ballot…</b></div>`; setTimeout(()=>{ if(won) TK.sec=sec; tkRedraw(); },1800); }
}
function tkRedraw(){ const el=document.getElementById("tkApp"); if(el) el.innerHTML=tkApp(); }
function tkPick(id){ TK.sec=id; TK.done=null; tkRedraw(); }
function tkQty(k,d){ const n=TK.qty.adult+TK.qty.child+TK.qty.conc, g=tkGame(TK.mid), cap=tkDemand(g).resale?4:10; if(d>0&&n>=cap) return; TK.qty[k]=Math.max(0,TK.qty[k]+d); tkRedraw(); }
function tkAdd(k,on){ TK.add[k]=on; tkRedraw(); }
function tkBuy(){
  const g=tkGame(TK.mid), dm=tkDemand(g), T=tkTotals(g,dm), W=dbWallet(); if(!T||!T.n||T.total>W.balance) return;
  const id=(Date.now().toString(36)+Math.random().toString(36).slice(2,6)), r=dbRng(dbHash(id));
  const row=T.s[2]==="General Admission"||T.s[2]==="The Hill"?"GA":String.fromCharCode(65+Math.floor(r()*20)), first=1+Math.floor(r()*30);
  const seats=row==="GA"?"Any":(T.n>1?`${first}–${first+T.n-1}`:String(first));
  const when=[g.m.day&&(DAY_NAMES[g.m.day]||g.m.day), g.m.time, g.r.name, g.s.name].filter(Boolean).join(" · ");
  const addons=TK_ADDONS.filter(a=>TK.add[a[0]]).map(a=>a[0]==="jersey"?team(g.m.home).nick+" jersey":a[1]);
  const t={id, mid:TK.mid, home:g.m.home, away:g.m.away, when, venue:venueOf(g.m), sec:T.s[0], cat:T.s[2], gate:T.s[5], row, seats, n:T.n, addons, msg:TK.add.shout?TK.msg.trim():"", paid:T.total, t:Date.now()};
  tkTickets().push(t); W.balance=Math.round((W.balance-T.total)*100)/100; dbSave();
  TK.done=t; TK.sec=null; TK.add={}; TK.msg=""; TK.qty={adult:2,child:0,conc:0}; tkRedraw(); window.scrollTo({top:0,behavior:"smooth"});
}
function viewTickets(mid){
  const g=tkGame(mid);
  if(!g) return `${pageHead("Tickets")}<div class="pbody"><div class="empty">Tickets for this game aren't on sale yet.</div></div>`;
  if(TK.mid!==mid) TK={mid, sec:null, qty:{adult:2,child:0,conc:0}, add:{}, msg:"", done:null};
  const m=g.m, H=m.home, A=m.away, dm=tkDemand(g), cap=tkCapacity(venueOf(m));
  const when=[m.day&&(DAY_NAMES[m.day]||m.day), m.time].filter(Boolean).join(" · ");
  const back = g.r.rep ? `${g.c}-${g.s.id}` : `${g.c}-${g.s.id}-${g.ri+1}`;
  return `${pageHead("Tickets")}<div class="pbody tk-page">
    <a class="back" href="#${back}">‹ Back to Draw</a>
    <div class="tk-hero" style="--hc:${tkCol(H)};--ac:${tkCol(A)}">
      <div class="tk-ht">${logoOnDark(H)}<div><small>${esc(MC_COMP[g.c]?MC_COMP[g.c].name():"")} · ${esc(g.r.name)} · ${esc(g.s.name)}</small><b>${esc(team(H).nick)} v ${esc(team(A).nick)}</b><span>${esc(when||"Time TBC")} · ${esc(venueOf(m))}</span></div>${logoOnDark(A)}</div>
      <div class="tk-demand"><div class="tk-bar${dm.soldOut?" out":""}"><i style="width:${Math.round(dm.sold*100)}%"></i></div><span>${dm.soldOut?"🚫 SOLD OUT":dm.sold>0.95?"🔥 Almost sold out":dm.sold>0.8?"🔥 Selling fast":"🎟️ Tickets available"} · ${dm.soldOut?`all ${cap.toLocaleString()} seats gone`:`${Math.round(dm.sold*100)}% of ${cap.toLocaleString()} seats sold`}${dm.tags.length?" · "+dm.tags.map(esc).join(" · "):""}</span></div>
    </div>
    <div id="tkApp">${tkApp()}</div>
    <p class="tk-fine">Just for fun: tickets are paid for with Dingo Dollars, have no value and won't get you into a real stadium.</p></div>`;
}
