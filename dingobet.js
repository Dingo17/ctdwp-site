/* =========================================================
   DINGOBET — odds engine + just-for-fun virtual betting centre
   ---------------------------------------------------------
   Everything here is worked out from the results already on the site:
   - team attack/defence ratings (recent seasons and recent rounds count most)
   - home ground advantage (reduced at neutral/overseas venues)
   - IRL rankings for internationals
   Each match is simulated 20,000 times; every market is priced from those
   simulations with a bookmaker margin in the Sportsbet style
   (an even game = $1.90 / $1.90, line and totals set at $1.90 each way).
   Odds you type into the data files (e.g. "($1.45) AUS V TON ($3.00)")
   override the head-to-head price and the rest of the markets follow it.
   Season markets come from 10,000 simulated seasons.
   No real money: Dingo Dollars live in the viewer's own browser.
   ========================================================= */

const DB = {
  N: 20000, SEASON_SIMS: 10000, START: 1000, DAILY: 100,
  CFG: {
    draw:     {decay:0.4, gd:0.93, lam:4,   shrink:0.85, sdM:21, sdMk:0,    sdT:14, hfaScale:1},
    intl:     {decay:0.6, gd:0.97, lam:1.5, shrink:1,    sdM:18, sdMk:0.15, sdT:16, hfaScale:0.6, irlW:0.4, irlK:1.6},
    origin:   {decay:0.6, gd:1,    lam:3,   shrink:0.8,  sdM:19, sdMk:0,    sdT:14, hfaScale:1},
    allstars: {decay:0.7, gd:1,    lam:3,   shrink:0.8,  sdM:20, sdMk:0,    sdT:14, hfaScale:0.5},
    wcc:      {decay:0.5, gd:1,    lam:4,   shrink:0.8,  sdM:20, sdMk:0,    sdT:14, hfaScale:1}
  },
  OVER: { two:1.0526, wm:1.12, bands:1.2, tri:1.08, combo:1.09, tb:1.15, sgm:1.12, outright:1.22, yesno:1.07, pos:1.15 },
  // first season of each competition the computer punters bet on
  LAUNCH: { draw:14, intl:13, rlwc:14, test:14, origin:14, allstars:14, wcc:14 }
};
const DB_FAMC = { draw:"draw", origin:"origin", intl:"intl", rlwc:"intl", test:"intl", allstars:"allstars", wcc:"wcc" };
const DB_LADDER = (()=>{ const L=[]; for(let p=101;p<=200;p++) L.push(p/100); for(let p=205;p<=300;p+=5) L.push(p/100); for(let p=310;p<=400;p+=10) L.push(p/100);
  [4.2,4.4,4.5,4.6,4.8,5,5.5,6,6.5,7,7.5,8,8.5,9,9.5,10,11,12,13,14,15,17,19,21,23,26,29,31,34,41,46,51,61,67,71,81,91,101,126,151,201,251,301,401,501].forEach(x=>L.push(x)); return L; })();

/* ---------- maths helpers ---------- */
function dbHash(str){ let h=1779033703^str.length; for(let i=0;i<str.length;i++){ h=Math.imul(h^str.charCodeAt(i),3432918353); h=h<<13|h>>>19; } return h>>>0; }
function dbRng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function dbGauss(r){ let u=0,v=0; while(u===0) u=r(); v=r(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function dbPhi(x){ const t=1/(1+0.2316419*Math.abs(x)), d=0.3989423*Math.exp(-x*x/2); let p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return x>0?1-p:p; }
function dbPhiInv(p){ p=Math.min(0.9995,Math.max(0.0005,p)); let lo=-6,hi=6; for(let i=0;i<60;i++){ const m=(lo+hi)/2; if(dbPhi(m)<p) lo=m; else hi=m; } return (lo+hi)/2; }
function dbPrice(p, over, tail){ const q=Math.max(0.00199, p*over+(tail||0)); const raw=1/q; if(raw<=1.01) return 1.01; let best=1.01; for(const x of DB_LADDER){ if(x<=raw+1e-9) best=x; else break; } return best; }
const dbFmt = x => "$"+(x>=100?x.toFixed(0):x.toFixed(2));
const dbMoney = x => "D$"+(Math.round(x*100)/100).toLocaleString("en-AU",{minimumFractionDigits:2,maximumFractionDigits:2});
const dbSigned = x => (x>0?"+":x<0?"−":"")+dbMoney(Math.abs(x));
const dbLineTxt = x => (x>0?"+":"")+x;

/* ---------- ratings ---------- */
const DB_FITS = {};
function dbFamList(c){ return mcFamily(DB_FAMC[c]==="intl"?"intl":DB_FAMC[c]); }
function dbFit(fam, cutoff, target){
  const key=fam+"|"+cutoff+"|"+(target?target.sid+"."+target.ri:""); if(DB_FITS[key]) return DB_FITS[key];
  const cfg=DB.CFG[fam], list=mcFamily(fam==="intl"?"intl":fam), tr=[];
  for(let i=0;i<Math.min(cutoff,list.length);i++){ const g=list[i]; if(played(g.m)) tr.push(g); }
  if(!tr.length) return DB_FITS[key]={mu:23,hfa:2,att:{},con:{},n:0,games:0};
  const T=target||{sid:tr[tr.length-1].sid, ri:tr[tr.length-1].ri+1};
  const W=tr.map(g=>Math.pow(cfg.decay, Math.max(0,T.sid-g.sid)) * (g.sid===T.sid ? Math.pow(cfg.gd, Math.max(0,T.ri-g.ri)) : Math.pow(cfg.gd,18)));
  const G=tr.map(g=>({h:mcKey(g.m.home), a:mcKey(g.m.away), hs:g.m.hs, as:g.m.as}));
  const keys=[...new Set(G.flatMap(g=>[g.h,g.a]))], ix=Object.fromEntries(keys.map((k,i)=>[k,i])), n=keys.length;
  const att=new Array(n).fill(0), con=new Array(n).fill(0);
  let sw=0,sp=0; G.forEach((g,i)=>{ sw+=2*W[i]; sp+=W[i]*(g.hs+g.as); }); const mu=sp/sw; let hfa=0;
  const byT=keys.map(()=>[]); G.forEach((g,i)=>{ byT[ix[g.h]].push(i); byT[ix[g.a]].push(i); });
  for(let it=0;it<40;it++){
    let a=0,b=0; G.forEach((g,i)=>{ a+=W[i]*(g.hs-(mu+att[ix[g.h]]+con[ix[g.a]])); b+=W[i]; }); hfa=a/b;
    for(let k=0;k<n;k++){ let a1=0,b1=cfg.lam,c1=0,d1=cfg.lam;
      byT[k].forEach(i=>{ const g=G[i], w=W[i], h=ix[g.h], aw=ix[g.a];
        if(h===k){ a1+=w*(g.hs-mu-hfa-con[aw]); b1+=w; c1+=w*(g.as-mu-att[aw]); d1+=w; }
        else { a1+=w*(g.as-mu-con[h]); b1+=w; c1+=w*(g.hs-mu-hfa-att[h]); d1+=w; } });
      att[k]=a1/b1; con[k]=c1/d1; }
  }
  const fitObj={mu,hfa,att:Object.fromEntries(keys.map((k,i)=>[k,att[i]])),con:Object.fromEntries(keys.map((k,i)=>[k,con[i]])),games:tr.length};
  // pre-season nudges from data/dingobet.js (Premiership only), fading out over a club's first 8 games
  const adj=fam==="draw" && (window.DINGOBET_ADJUST||{})[T.sid];
  if(adj) Object.entries(adj).forEach(([code,v])=>{ const pts=Array.isArray(v)?+v[0]:+v; const played=tr.filter(g=>g.sid===T.sid&&(g.m.home===code||g.m.away===code)).length, f=Math.max(0,1-played/8);
    fitObj.att[code]=(fitObj.att[code]||0)+pts*f/2; fitObj.con[code]=(fitObj.con[code]||0)-pts*f/2; });
  return DB_FITS[key]=fitObj;
}
let DB_IRL=null;
function dbIrl(){ if(DB_IRL) return DB_IRL; DB_IRL={}; try{ irlRankings().forEach(r=>{ const code=Object.keys(IRL_NAMES).find(k=>IRL_NAMES[k]===r.name); if(code) DB_IRL[code]=r.rating; }); }catch(e){} return DB_IRL; }

// expected margin (home minus away) and total for one game
function dbPredict(fam, fit, home, away, opt={}){
  const cfg=DB.CFG[fam], h=mcKey(home), a=mcKey(away);
  let hfa=(fit.hfa||0)*cfg.hfaScale;
  if(opt.neutral) hfa=0;
  else if(fam==="draw" && opt.venue){ const gr=team(home).grounds||[]; if(gr.length && !gr.includes(opt.venue)) hfa*=0.25; }
  const eh=fit.mu+(fit.att[h]||0)+(fit.con[a]||0), ea=fit.mu+(fit.att[a]||0)+(fit.con[h]||0);
  let e=(eh-ea)*cfg.shrink+hfa, T=Math.max(20, eh+ea+hfa);
  if(fam==="intl"){ const irl=dbIrl(); if(irl[h]!=null && irl[a]!=null) e=(1-cfg.irlW)*e+cfg.irlW*(cfg.irlK*(irl[h]-irl[a])+hfa); }
  let sdM=cfg.sdM+cfg.sdMk*Math.abs(e), manual=null;
  if(opt.oh && opt.oa){ // typed-in head-to-head odds: match the model's margin to them
    const ph=(1/opt.oh)/((1/opt.oh)+(1/opt.oa)); manual={oh:opt.oh, oa:opt.oa};
    const z=dbPhiInv(ph); e=z*cfg.sdM; for(let i=0;i<20;i++){ sdM=cfg.sdM+cfg.sdMk*Math.abs(e); e=z*sdM; }
  }
  return {e, T, sdM, sdT:cfg.sdT, hfa, manual};
}

/* ---------- match lookup and current rounds ---------- */
function dbMatch(mid){
  const p=String(mid).split("-"); if(p.length<4) return null;
  const [c,sid,ri,mi]=[p[0],+p[1],+p[2],+p[3]];
  const s=mcSeason(c,sid); const r=s&&s.rounds[ri]; const m=r&&r.matches[mi];
  return m?{c,sid,ri,mi,s,r,m,fam:DB_FAMC[c]||"draw"}:null;
}
function dbCutoff(c, sid, ri){ const list=dbFamList(c); const i=list.findIndex(x=>x.c===c && x.sid===sid && x.ri===ri); return i<0?list.length:i; }
let DB_ROUNDS=null;
function dbRounds(){
  if(DB_ROUNDS) return DB_ROUNDS;
  const out=[];
  ["draw","origin","intl","rlwc","test","allstars","wcc"].forEach(c=>{
    const ids=mcIds(c); if(!ids.length) return;
    const s=mcSeason(c, Math.max(...ids)); if(!s) return;
    const ri=s.rounds.findIndex(r=>!(r.rep&&c==="draw") && r.matches.some(m=>!played(m) && m.home!=="TBC" && m.away!=="TBC"));
    if(ri<0) return;
    const r=s.rounds[ri];
    out.push({c, s, ri, r, comp:(COMPS.find(x=>(COMP_MC[x.id]||x.id)===c)||{name:c}).name,
      games:r.matches.map((m,mi)=>({c,sid:s.id,ri,mi,s,r,m,fam:DB_FAMC[c]})).filter(g=>g.m.home!=="TBC"&&g.m.away!=="TBC")});
  });
  const pr=["draw","origin","intl","rlwc","test","wcc","allstars"]; out.sort((a,b)=>pr.indexOf(a.c)-pr.indexOf(b.c));
  return DB_ROUNDS=out;
}
function dbIsCurrent(mid){ return dbRounds().some(R=>R.games.some(g=>g.m.mid===mid)); }

/* ---------- match simulation + markets ---------- */
const DB_SIMS={};
function dbGamePred(g){
  const cut=dbCutoff(g.c, g.sid, g.ri), fit=dbFit(g.fam, cut, {sid:g.sid, ri:g.ri});
  const neutral = g.r && g.r.isFinal && g.c!=="draw";
  return dbPredict(g.fam, fit, g.m.home, g.m.away, {venue:venueOf(g.m), neutral, oh:parseFloat(g.m.oh)||0, oa:parseFloat(g.m.oa)||0});
}
function dbSim(g){
  const mid=g.m.mid; if(DB_SIMS[mid]) return DB_SIMS[mid];
  const P=dbGamePred(g), r=dbRng(dbHash("sim|"+mid)), n=DB.N, hs=new Int16Array(n), as=new Int16Array(n);
  for(let i=0;i<n;i++){ const m=P.e+P.sdM*dbGauss(r), t=P.T+P.sdT*dbGauss(r);
    let h=Math.round((t+m)/2), a=Math.round((t-m)/2); if(h<0){ a-=h; h=0; } if(a<0){ h-=a; a=0; } hs[i]=h; as[i]=a; }
  return DB_SIMS[mid]={P,hs,as,n};
}
// settle one match selection from a final score: W / L / D (dead heat)
function dbEval(parts, hs, as){
  const M=hs-as, T=hs+as, [k,a,b,c]=parts;
  switch(k){
    case "h2h": return M===0?"D":((a==="h")===(M>0)?"W":"L");
    case "line": return (a==="h"?M>+b:M<+b)?"W":"L";
    case "tot": return (a==="o"?T>+b:T<+b)?"W":"L";
    case "wm": { const mm=a==="h"?M:-M; return (mm>=+b && mm<=+c)?"W":"L"; }
    case "draw": return M===0?"W":"L";
    case "tri": return (a==="h"?M>=7:a==="a"?M<=-7:Math.abs(M)<=6)?"W":"L";
    case "ht": return ((a==="h"?M>0:M<0) && (b==="o"?T>+c:T<+c))?"W":"L";
    case "tp": { const p=a==="h"?hs:as; return (b==="o"?p>+c:p<+c)?"W":"L"; }
    case "b20": return ((hs>=20&&as>=20)===(a==="y"))?"W":"L";
    case "tb": return (T>=+a && T<=+b)?"W":"L";
  }
  return "L";
}
function dbProb(sim, parts){ let s=0; for(let i=0;i<sim.n;i++){ const r=dbEval(parts,sim.hs[i],sim.as[i]); if(r==="W") s++; else if(r==="D") s+=0.5; } return s/sim.n; }
function dbJoint(sim, list){ let s=0; outer: for(let i=0;i<sim.n;i++){ for(const p of list) if(dbEval(p,sim.hs[i],sim.as[i])!=="W") continue outer; s++; } return s/sim.n; }
function dbMedianLine(sim, f){ const v=new Int16Array(sim.n); for(let i=0;i<sim.n;i++) v[i]=f(sim.hs[i],sim.as[i]); v.sort(); const med=v[sim.n>>1]; return Math.floor(med)+0.5 - (med>=0?0:0); }

const DB_MKTS={};
function dbMarkets(g){
  const mid=g.m.mid; if(DB_MKTS[mid]) return DB_MKTS[mid];
  const sim=dbSim(g), P=sim.P, H=team(g.m.home).nick, A=team(g.m.away).nick, ev=`${H} v ${A}`;
  const sel=(key,label,p,over,extra={})=>({key:`m|${mid}|${key}`, label, p, price:extra.price||dbPrice(p,over), ev, mid, ...extra});
  const mk=(id,name,sels,note)=>({id,name,sels,note});
  const out=[];
  // head to head
  const ph=dbProb(sim,["h2h","h"]), pa=1-ph;
  out.push(mk("h2h","Head to Head",[ sel("h2h|h",H,ph,DB.OVER.two,P.manual?{price:P.manual.oh}:{}), sel("h2h|a",A,pa,DB.OVER.two,P.manual?{price:P.manual.oa}:{}) ],"Draw: dead heat rules apply (half the stake paid at full odds)."));
  // line: the half-point line closest to 50/50, both sides $1.90
  let L=dbMedianLine(sim,(h,a)=>h-a), best=9, bestL=L;
  for(let d=-3; d<=3; d++){ const p=dbProb(sim,["line","h",L+d]); if(Math.abs(p-0.5)<best){ best=Math.abs(p-0.5); bestL=L+d; } } L=bestL;
  const lineSel=(Lv,main)=>{ const p=dbProb(sim,["line","h",Lv]); const even=main&&Math.abs(p-0.5)<0.05;
    return [ sel(`line|h|${Lv}`,`${H} ${dbLineTxt(-Lv)}`,p,DB.OVER.two,even?{price:1.9}:{}), sel(`line|a|${Lv}`,`${A} ${dbLineTxt(Lv)}`,1-p,DB.OVER.two,even?{price:1.9}:{}) ]; };
  out.push(mk("line","Line",lineSel(L,true)));
  // totals
  let TT=dbMedianLine(sim,(h,a)=>h+a); best=9; let bestT=TT;
  for(let d=-3; d<=3; d++){ const p=dbProb(sim,["tot","o",TT+d]); if(Math.abs(p-0.5)<best){ best=Math.abs(p-0.5); bestT=TT+d; } } TT=bestT;
  const totSel=(t,main)=>{ const p=dbProb(sim,["tot","o",t]), even=main&&Math.abs(p-0.5)<0.05;
    return [ sel(`tot|o|${t}`,`Over ${t}`,p,DB.OVER.two,even?{price:1.9}:{}), sel(`tot|u|${t}`,`Under ${t}`,1-p,DB.OVER.two,even?{price:1.9}:{}) ]; };
  out.push(mk("tot","Total Match Points",totSel(TT,true)));
  // winning margin 1-12 / 13+
  out.push(mk("wm","Winning Margin",[
    sel("wm|h|1|12",`${H} 1-12`,dbProb(sim,["wm","h",1,12]),DB.OVER.wm), sel("wm|h|13|999",`${H} 13+`,dbProb(sim,["wm","h",13,999]),DB.OVER.wm),
    sel("draw","Draw",dbProb(sim,["draw"]),DB.OVER.wm),
    sel("wm|a|1|12",`${A} 1-12`,dbProb(sim,["wm","a",1,12]),DB.OVER.wm), sel("wm|a|13|999",`${A} 13+`,dbProb(sim,["wm","a",13,999]),DB.OVER.wm) ]));
  // tri-bet
  out.push(mk("tri","Tri-Bet",[ sel("tri|h",`${H} by 7+`,dbProb(sim,["tri","h"]),DB.OVER.tri), sel("tri|x","Either by 6 or less",dbProb(sim,["tri","x"]),DB.OVER.tri), sel("tri|a",`${A} by 7+`,dbProb(sim,["tri","a"]),DB.OVER.tri) ],"Either by 6 or less includes a draw."));
  // head to head & total
  out.push(mk("ht",`Head to Head & Total (${TT})`,[
    sel(`ht|h|o|${TT}`,`${H} & Over`,dbProb(sim,["ht","h","o",TT]),DB.OVER.combo), sel(`ht|h|u|${TT}`,`${H} & Under`,dbProb(sim,["ht","h","u",TT]),DB.OVER.combo),
    sel(`ht|a|o|${TT}`,`${A} & Over`,dbProb(sim,["ht","a","o",TT]),DB.OVER.combo), sel(`ht|a|u|${TT}`,`${A} & Under`,dbProb(sim,["ht","a","u",TT]),DB.OVER.combo) ],"A draw loses."));
  // margin bands
  const bands=[[1,6],[7,12],[13,18],[19,24],[25,999]], bt=b=>b[1]>900?`${b[0]}+`:`${b[0]}-${b[1]}`;
  out.push(mk("bands","Winning Margin Bands",[ ...bands.map(b=>sel(`wm|h|${b[0]}|${b[1]}`,`${H} ${bt(b)}`,dbProb(sim,["wm","h",b[0],b[1]]),DB.OVER.bands)),
    sel("draw","Draw",dbProb(sim,["draw"]),DB.OVER.bands), ...bands.map(b=>sel(`wm|a|${b[0]}|${b[1]}`,`${A} ${bt(b)}`,dbProb(sim,["wm","a",b[0],b[1]]),DB.OVER.bands)) ]));
  // team points
  const tpLine=side=>{ const v=Array.from(side==="h"?sim.hs:sim.as).sort((x,y)=>x-y); return Math.floor(v[sim.n>>1])+0.5; };
  const tp=side=>{ const t=tpLine(side), nm=side==="h"?H:A, p=dbProb(sim,["tp",side,"o",t]), even=Math.abs(p-0.5)<0.05;
    return [ sel(`tp|${side}|o|${t}`,`${nm} Over ${t}`,p,DB.OVER.two,even?{price:1.9}:{}), sel(`tp|${side}|u|${t}`,`${nm} Under ${t}`,1-p,DB.OVER.two,even?{price:1.9}:{}) ]; };
  out.push(mk("tp","Team Points",[...tp("h"),...tp("a")]));
  // total bands
  const tb=[[0,29],[30,39],[40,49],[50,59],[60,69],[70,999]];
  out.push(mk("tb","Total Points Bands",tb.map(b=>sel(`tb|${b[0]}|${b[1]}`,b[1]>900?`${b[0]}+`:b[0]===0?"Under 30":`${b[0]}-${b[1]}`,dbProb(sim,["tb",b[0],b[1]]),DB.OVER.tb))));
  // both teams 20+
  const b20=dbProb(sim,["b20","y"]);
  out.push(mk("b20","Both Teams to Score 20+",[ sel("b20|y","Yes",b20,DB.OVER.yesno), sel("b20|n","No",1-b20,DB.OVER.yesno) ]));
  // alternative lines and totals
  const alts=[]; [-12,-6,6,12].forEach(d=>alts.push(...lineSel(L+d,false)));
  out.push(mk("altline","Alternative Lines",alts.sort((x,y)=>parseFloat(x.key.split("|").pop())-parseFloat(y.key.split("|").pop()))));
  const altT=[]; [-12,-6,6,12].sort((a,b)=>a-b).forEach(d=>altT.push(...totSel(TT+d,false)));
  out.push(mk("alttot","Alternative Totals",altT));
  out.forEach(mk=>mk.sels.forEach(s=>s.mkt=mk.name));
  const res={g, sim, P, markets:out, line:L, total:TT, ph, pa, H, A};
  return DB_MKTS[mid]=res;
}
function dbFindSel(key){
  const p=key.split("|");
  if(p[0]==="m"){ const g=dbMatch(p[1]); if(!g||!dbIsCurrent(p[1])) return null; const M=dbMarkets(g); for(const mk of M.markets) for(const s of mk.sels) if(s.key===key) return {...s, mkt:mk.name}; return null; }
  if(p[0]==="f"){ const F=dbFutures(); for(const mk of F.markets) for(const s of mk.sels) if(s.key===key) return {...s, mkt:mk.name}; }
  return null;
}
// the weekly boost: the biggest favourite of the round to win by 13+, price +25%
function dbBoost(R){
  // the favourite to win by 13+ in the game where that price is closest to $2.50 (never a "sure thing")
  let best=null; R.games.filter(g=>!played(g.m)).forEach(g=>{ const M=dbMarkets(g); const fav=M.ph>=M.pa?"h":"a";
    const s=M.markets.find(x=>x.id==="wm").sels.find(x=>x.key.endsWith(`wm|${fav}|13|999`)); if(!s||s.price<1.5) return;
    const d=Math.abs(Math.log(s.price/2.5)); if(!best||d<best.d) best={s,d}; });
  if(!best) return null;
  const sel=best.s;
  const boosted=DB_LADDER.find(x=>x>=sel.price*1.25)||sel.price;
  return {...sel, mkt:"Dingo Boost", was:sel.price, price:boosted, boost:true, key:sel.key+"|boost"};
}

/* ---------- season simulations (futures) ---------- */
let DB_FUT=null;
function dbFutSeasonId(){ const last=latestSeason(); const reg=last.rounds.filter(r=>!r.finals&&!r.rep); const gf=last.rounds.find(r=>r.finals&&/grand final/i.test(r.name)); return (gf && gf.matches.every(played)) ? last.id+1 : last.id; }
function dbPremSim(){
  const sid=dbFutSeasonId(), s=SEASONS.find(x=>x.id===sid);
  const list=mcFamily("draw"), fit=dbFit("draw", list.length, {sid, ri:0});
  let teams, fixtures=[];
  const clubs=Object.keys(CLUB_BG);
  if(s && s.rounds.some(r=>!r.finals&&!r.rep&&r.matches.length)){
    s.rounds.filter(r=>!r.finals&&!r.rep).forEach(r=>r.matches.forEach(m=>{ if(m.home==="TBC"||m.away==="TBC") return; fixtures.push({h:m.home,a:m.away,venue:venueOf(m),hs:played(m)?m.hs:null,as:played(m)?m.as:null}); }));
    teams=[...new Set(fixtures.flatMap(f=>[f.h,f.a]))];
  } else {
    teams=clubs; const r=dbRng(dbHash("fixtures|"+sid));
    for(let i=0;i<teams.length;i++) for(let j=i+1;j<teams.length;j++){ const flip=r()<0.5; fixtures.push({h:flip?teams[i]:teams[j], a:flip?teams[j]:teams[i]}); }
  }
  const ti=Object.fromEntries(teams.map((t,i)=>[t,i])), n=teams.length;
  fixtures.forEach(f=>{ if(f.hs==null){ const P=dbPredict("draw",fit,f.h,f.a,{venue:f.venue}); f.e=P.e; f.sd=P.sdM; } });
  const E=(h,a)=>{ const P=dbPredict("draw",fit,h,a,{}); return [P.e,P.sdM]; };
  const Emat=teams.map(h=>teams.map(a=>h===a?[0,21]:E(h,a)));
  const finalsRes={}; if(s) s.rounds.filter(r=>r.finals).forEach(r=>r.matches.forEach(m=>{ if(played(m)) finalsRes[m.home+"|"+m.away]=m.hs>m.as?m.home:m.away; }));
  const N=DB.SEASON_SIMS, rr=dbRng(dbHash("season|"+sid+"|"+list.length));
  const pos=teams.map(()=>new Float64Array(n)), wins=teams.map(()=>new Int32Array(40)), prem=new Float64Array(n), gf=new Float64Array(n), quin={};
  let firstTime=0, minorWins=0, outside4=0;
  const champs=new Set(); try{ (honoursAll().find(x=>/GRAND FINAL WINNERS/i.test(x.title))||{rows:[]}).rows.forEach(r=>{ if(r.s<sid){ const w=gfWinner(r.text); if(w) champs.add(w); } }); }catch(e){}
  const pts=new Float64Array(n), pd=new Float64Array(n), w=new Int32Array(n);
  const game=(h,a)=>{ const k=finalsRes[teams[h]+"|"+teams[a]]; if(k) return k===teams[h]; const [e,sd]=Emat[h][a]; const m=e+sd*dbGauss(rr); return m===0?rr()<0.5:m>0; };
  for(let it=0;it<N;it++){
    pts.fill(0); pd.fill(0); w.fill(0);
    for(const f of fixtures){ const h=ti[f.h], a=ti[f.a]; let m;
      if(f.hs!=null) m=f.hs-f.as; else m=Math.round(f.e+f.sd*dbGauss(rr));
      if(m>0){ pts[h]+=2; w[h]++; } else if(m<0){ pts[a]+=2; w[a]++; } else { pts[h]++; pts[a]++; }
      pd[h]+=m; pd[a]-=m; }
    const ord=[...Array(n).keys()].sort((x,y)=>(pts[y]-pts[x])||(pd[y]-pd[x])||(rr()-0.5));
    ord.forEach((t,i)=>{ pos[t][i]++; wins[t][Math.min(39,w[t])]++; });
    // NRL top-8 finals
    const S=ord; const q1=game(S[0],S[3]), q2=game(S[1],S[2]), e1=game(S[4],S[7]), e2=game(S[5],S[6]);
    const Q1w=q1?S[0]:S[3], Q1l=q1?S[3]:S[0], Q2w=q2?S[1]:S[2], Q2l=q2?S[2]:S[1], E1w=e1?S[4]:S[7], E2w=e2?S[5]:S[6];
    const s1=game(Q1l,E1w)?Q1l:E1w, s2=game(Q2l,E2w)?Q2l:E2w;
    const p1=game(Q1w,s2)?Q1w:s2, p2=game(Q2w,s1)?Q2w:s1;
    const [hi,lo]=ord.indexOf(p1)<ord.indexOf(p2)?[p1,p2]:[p2,p1];
    const champ=game(hi,lo)?hi:lo;
    prem[champ]++; gf[p1]++; gf[p2]++;
    const qk=[teams[p1],teams[p2]].sort().join("|"); quin[qk]=(quin[qk]||0)+1;
    if(!champs.has(teams[champ])) firstTime++;
    if(champ===S[0]) minorWins++;
    if(ord.indexOf(champ)>=4) outside4++;
  }
  return {sid, teams, ti, pos, wins, prem, gf, quin, firstTime, minorWins, outside4, N, s, fit, generated:!s};
}
function dbOriginSim(){
  const ids=Object.keys(window.ORIGIN_DATA||{}).map(Number), last=Math.max(...ids);
  const lastS=mcSeason("origin",last), done=lastS && lastS.rounds[0].matches.length && lastS.rounds[0].matches.every(played);
  const sid=done?last+1:last, s=done?null:lastS;
  const list=mcFamily("origin"), fit=dbFit("origin", list.length, {sid, ri:0});
  const games = s ? s.rounds[0].matches.map(m=>({h:m.home,a:m.away,hs:played(m)?m.hs:null,as:played(m)?m.as:null,venue:venueOf(m)}))
                  : (sid%2===0 ? [{h:"QLD",a:"NSW"},{h:"QLD",a:"NSW",neutral:true},{h:"NSW",a:"QLD"}] : [{h:"NSW",a:"QLD"},{h:"NSW",a:"QLD",neutral:true},{h:"QLD",a:"NSW"}]);
  games.forEach(g=>{ if(g.hs==null){ const P=dbPredict("origin",fit,g.h,g.a,{neutral:g.neutral}); g.e=P.e; g.sd=P.sdM; } });
  const r=dbRng(dbHash("origin|"+sid+"|"+list.length)), N=DB.SEASON_SIMS, score={}; let nsw=0;
  for(let it=0;it<N;it++){ let n=0,q=0; games.forEach(g=>{ const m=g.hs!=null?g.hs-g.as:Math.round(g.e+g.sd*dbGauss(r)); const hw=m>0?g.h:m<0?g.a:null; if(hw==="NSW") n++; else if(hw==="QLD") q++; });
    if(n===q){ if(r()<0.5) n+=0.001; else q+=0.001; }   // drawn series: holders keep it, treated 50/50 here
    const k=n>q?`NSW ${Math.floor(n)}-${Math.floor(q)}`:`QLD ${Math.floor(q)}-${Math.floor(n)}`; score[k]=(score[k]||0)+1; if(n>q) nsw++; }
  return {sid, nsw:nsw/N, score:Object.fromEntries(Object.entries(score).map(([k,v])=>[k,v/N])), N};
}
function dbIntlSim(){
  const ids=mcIds("intl"); if(!ids.length) return null; const sid=Math.max(...ids), s=mcSeason("intl",sid); if(!s) return null;
  const list=mcFamily("intl"), fit=dbFit("intl", list.length, {sid, ri:0});
  const groups={}; s.rounds.forEach(r=>r.matches.forEach(m=>{ if(!m.group) return; (groups[m.group]=groups[m.group]||{games:[],final:null}); if(r.isFinal) groups[m.group].final=m; else groups[m.group].games.push(m); }));
  const out={sid, groups:{}}; const r=dbRng(dbHash("intl|"+sid+"|"+list.length)), N=DB.SEASON_SIMS;
  Object.entries(groups).forEach(([gname,G])=>{
    if(G.final && played(G.final)) { const w=G.final.hs>G.final.as?G.final.home:G.final.away; out.groups[gname]={done:true, winner:w}; return; }
    const teams=[...new Set(G.games.flatMap(m=>[m.home,m.away]))]; if(teams.length<2) return;
    const fx=G.games.map(m=>{ if(played(m)) return {h:m.home,a:m.away,m:m.hs-m.as}; const P=dbPredict("intl",fit,m.home,m.away,{oh:parseFloat(m.oh)||0,oa:parseFloat(m.oa)||0}); return {h:m.home,a:m.away,e:P.e,sd:P.sdM}; });
    const fin=(x,y)=>{ const P=dbPredict("intl",fit,x,y,{neutral:true}); return P; };
    const win={}, final={}; teams.forEach(t=>{ win[t]=0; final[t]=0; });
    const known = G.final && G.final.home!=="TBC" && G.final.away!=="TBC" ? [G.final.home,G.final.away] : null;
    for(let it=0;it<N;it++){
      let top;
      if(known) top=known; else {
        const pts={}, pd={}; teams.forEach(t=>{pts[t]=0;pd[t]=0;});
        fx.forEach(f=>{ const m=f.m!=null?f.m:Math.round(f.e+f.sd*dbGauss(r)); if(m>0) pts[f.h]+=2; else if(m<0) pts[f.a]+=2; else {pts[f.h]++;pts[f.a]++;} pd[f.h]+=m; pd[f.a]-=m; });
        top=teams.slice().sort((x,y)=>(pts[y]-pts[x])||(pd[y]-pd[x])||(r()-0.5)).slice(0,2);
      }
      final[top[0]]++; final[top[1]]++;
      const P=fin(top[0],top[1]); const m=P.e+P.sdM*dbGauss(r); win[m>=0?top[0]:top[1]]++;
    }
    out.groups[gname]={teams, win, final, N, known:!!known};
  });
  return out;
}
function dbFutures(){
  if(DB_FUT) return DB_FUT;
  const P=dbPremSim(), O=dbOriginSim(), I=dbIntlSim(), markets=[], sid=P.sid, n=P.teams.length, N=P.N;
  const T=P.teams.map((t,i)=>({t,i})).sort((a,b)=>P.prem[b.i]-P.prem[a.i]);
  const sel=(key,label,p,over,extra={})=>({key:`f|${key}`, label, p, price:dbPrice(p,over,extra.tail??0.003), ev:extra.ev, team:extra.team, ...extra});
  const prem=`Season ${sid} Premiership`;
  const pc=(arr,i)=>arr[i]/N, posP=(i,a,b)=>{ let s=0; for(let k=a;k<=b;k++) s+=P.pos[i][k]; return s/N; };
  const add=(id,group,name,sels,note)=>markets.push({id,group,name,sels,note});
  add("premier","prem","Premiership Winner",T.map(x=>sel(`ctdwp|${sid}|premier|${x.t}`,team(x.t).nick,pc(P.prem,x.i),DB.OVER.outright,{ev:prem,team:x.t})));
  add("minor","prem","Minor Premiership",T.slice().sort((a,b)=>P.pos[b.i][0]-P.pos[a.i][0]).map(x=>sel(`ctdwp|${sid}|minor|${x.t}`,team(x.t).nick,posP(x.i,0,0),DB.OVER.outright,{ev:prem,team:x.t})));
  add("spoon","prem","Wooden Spoon",T.slice().sort((a,b)=>P.pos[b.i][n-1]-P.pos[a.i][n-1]).map(x=>sel(`ctdwp|${sid}|spoon|${x.t}`,team(x.t).nick,posP(x.i,n-1,n-1),DB.OVER.outright,{ev:prem,team:x.t})));
  add("top8","prem","To Make the Top 8",T.slice().sort((a,b)=>posP(b.i,0,7)-posP(a.i,0,7)).flatMap(x=>{ const p=posP(x.i,0,7); return [
    sel(`ctdwp|${sid}|top8|${x.t}|y`,`${team(x.t).nick} – Yes`,p,DB.OVER.yesno,{ev:prem,team:x.t,yes:true,tail:0.001}), sel(`ctdwp|${sid}|top8|${x.t}|n`,`${team(x.t).nick} – No`,1-p,DB.OVER.yesno,{ev:prem,team:x.t,tail:0.001}) ]; }),"yesno");
  add("top4","prem","To Make the Top 4",T.slice().sort((a,b)=>posP(b.i,0,3)-posP(a.i,0,3)).map(x=>sel(`ctdwp|${sid}|top4|${x.t}`,team(x.t).nick,posP(x.i,0,3),DB.OVER.yesno,{ev:prem,team:x.t})));
  add("gf","prem","To Make the Grand Final",T.slice().sort((a,b)=>P.gf[b.i]-P.gf[a.i]).map(x=>sel(`ctdwp|${sid}|gf|${x.t}`,team(x.t).nick,pc(P.gf,x.i),DB.OVER.yesno,{ev:prem,team:x.t})));
  const qs=Object.entries(P.quin).sort((a,b)=>b[1]-a[1]).slice(0,16);
  add("quin","prem","Grand Final Quinella",qs.map(([k,v])=>{ const [a,b]=k.split("|"); return sel(`ctdwp|${sid}|quin|${a}|${b}`,`${team(a).nick} & ${team(b).nick}`,v/N,DB.OVER.outright,{ev:prem,pair:[a,b]}); }),"The two Grand Final teams, either way around.");
  // regular season wins over/under
  const winSels=[]; T.forEach(x=>{ const arr=P.wins[x.i]; let c=0, med=0; for(let k=0;k<40;k++){ c+=arr[k]; if(c>=N/2){ med=k; break; } }
    let line=med+0.5, po=0; for(let k=Math.ceil(line);k<40;k++) po+=arr[k]; po/=N;
    if(po<0.4){ line=med-0.5; po=0; for(let k=Math.ceil(line);k<40;k++) po+=arr[k]; po/=N; }
    const even=Math.abs(po-0.5)<0.06;
    winSels.push(sel(`ctdwp|${sid}|wins|${x.t}|o|${line}`,`${team(x.t).nick} Over ${line}`,po,DB.OVER.two,{ev:prem,team:x.t,tail:0,...(even?{price:1.9}:{})}),
                 sel(`ctdwp|${sid}|wins|${x.t}|u|${line}`,`${team(x.t).nick} Under ${line}`,1-po,DB.OVER.two,{ev:prem,team:x.t,tail:0,...(even?{price:1.9}:{})})); });
  add("wins","prem","Regular Season Wins",winSels,"yesno");
  // finishing position bands (per team)
  const bandsDef=[["1-4","Top 4",0,3],["5-8","5th–8th",4,7],["9-12","9th–12th",8,11],[`13-${n}`,`13th–${n}th`,12,n-1]];
  add("band","team","Finishing Position",T.flatMap(x=>bandsDef.map(([k,l,a,b])=>sel(`ctdwp|${sid}|band|${x.t}|${k}`,`${team(x.t).nick} ${l}`,posP(x.i,a,b),DB.OVER.pos,{ev:prem,team:x.t,short:l}))),"team");
  // rivalries: who finishes higher
  const RIV=[["BRI","DOL"],["CAN","NEW"],["SOU","SYD"],["CRO","PAR"],["MEL","PEN"],["MAN","WAR"],["NQL","GLD"],["CBY","WST"],["SGI","PER"]].filter(([a,b])=>P.ti[a]!=null&&P.ti[b]!=null);
  add("riv","prem","Season Head to Head (finish higher)",RIV.flatMap(([a,b])=>{ let s=0; for(let k=0;k<n;k++){ let below=0; for(let j=k+1;j<n;j++) below+=P.pos[P.ti[b]][j]; }
    // P(a above b) estimated from independent marginals
    for(let k=0;k<n;k++) for(let j=k+1;j<n;j++) s+=P.pos[P.ti[a]][k]/N*P.pos[P.ti[b]][j]/N;
    const tie=P.pos[P.ti[a]].reduce((acc,v,k)=>acc+v/N*P.pos[P.ti[b]][k]/N,0); const pA=s+tie/2;
    return [ sel(`ctdwp|${sid}|riv|${a}|${b}`,team(a).nick,pA,DB.OVER.two,{ev:`${team(a).nick} v ${team(b).nick}`,tail:0}), sel(`ctdwp|${sid}|riv|${b}|${a}`,team(b).nick,1-pA,DB.OVER.two,{ev:`${team(a).nick} v ${team(b).nick}`,tail:0}) ]; }),"pairs");
  add("spec","prem","Season Specials",[
    sel(`ctdwp|${sid}|spec|first|y`,"A first-time premier",P.firstTime/N,DB.OVER.yesno,{ev:prem}),
    sel(`ctdwp|${sid}|spec|first|n`,"A previous premier wins it",1-P.firstTime/N,DB.OVER.yesno,{ev:prem}),
    sel(`ctdwp|${sid}|spec|minor|y`,"Minor premiers win the Grand Final",P.minorWins/N,DB.OVER.yesno,{ev:prem}),
    sel(`ctdwp|${sid}|spec|out4|y`,"Premiers finish outside the top 4",P.outside4/N,DB.OVER.yesno,{ev:prem}) ]);
  // Origin
  const og=`State of Origin – Season ${O.sid}`;
  add("origin","origin","Series Winner",[ sel(`origin|${O.sid}|series|NSW`,"New South Wales",O.nsw,DB.OVER.two,{ev:og,team:"NSW",tail:0}), sel(`origin|${O.sid}|series|QLD`,"Queensland",1-O.nsw,DB.OVER.two,{ev:og,team:"QLD",tail:0}) ]);
  add("oscore","origin","Series Correct Score",["NSW 3-0","NSW 2-1","QLD 2-1","QLD 3-0"].map(k=>sel(`origin|${O.sid}|score|${k.replace(" ","_")}`,k.replace("NSW","Blues").replace("QLD","Maroons"),O.score[k]||0.001,DB.OVER.pos,{ev:og,team:k.slice(0,3)})));
  // International Series tournaments
  if(I) Object.entries(I.groups).forEach(([g,G])=>{ if(G.done||!G.teams) return;
    const ev=`${g} – Season ${I.sid}`, tt=G.teams.slice().sort((a,b)=>G.win[b]-G.win[a]), slug=g.replace(/\s+/g,"_");
    add("grp-"+slug,"intl",`${g} Winner`,tt.map(t=>sel(`intl|${I.sid}|grp|${slug}|${t}`,team(t).nick,G.win[t]/G.N,DB.OVER.outright,{ev,team:t,tail:0.002})));
    if(!G.known) add("grpf-"+slug,"intl",`${g}: To Make the Final`,tt.map(t=>sel(`intl|${I.sid}|grpf|${slug}|${t}`,team(t).nick,G.final[t]/G.N,DB.OVER.yesno,{ev,team:t,tail:0.002})));
  });
  markets.forEach(mk=>mk.sels.forEach(s=>s.mkt=mk.name));
  return DB_FUT={markets, P, O, I, sid};
}
// settle a futures selection: null = not decided yet
function dbFutResult(key){
  const p=key.split("|").slice(1); const [comp,sid]=[p[0],+p[1]];
  if(comp==="ctdwp"){
    const s=SEASONS.find(x=>x.id===sid); if(!s) return null;
    const reg=s.rounds.filter(r=>!r.finals&&!r.rep), fins=s.rounds.filter(r=>r.finals);
    const regDone=reg.length && reg.every(r=>r.matches.every(played)) && fins.length;
    const lad=regDone?computeLadder({...s,rounds:reg}).map(r=>r.code):null;
    const gfR=fins.find(r=>/grand final/i.test(r.name)), gfm=gfR&&gfR.matches[0];
    const gfTeams=gfm&&gfm.home!=="TBC"&&gfm.away!=="TBC"?[gfm.home,gfm.away]:null;
    const champ=gfm&&played(gfm)&&gfm.hs!==gfm.as?(gfm.hs>gfm.as?gfm.home:gfm.away):null;
    const k=p[2], t=p[3], R=b=>b?"W":"L";
    if(k==="premier") return champ?R(champ===t):null;
    if(k==="minor") return lad?R(lad[0]===t):null;
    if(k==="spoon") return lad?R(lad[lad.length-1]===t):null;
    if(k==="top8") return lad?R((lad.indexOf(t)<8)===(p[4]==="y")):null;
    if(k==="top4") return lad?R(lad.indexOf(t)<4):null;
    if(k==="gf") return gfTeams?R(gfTeams.includes(t)):null;
    if(k==="quin") return gfTeams?R(gfTeams.includes(p[3])&&gfTeams.includes(p[4])):null;
    if(k==="wins"){ if(!lad) return null; const row=computeLadder({...s,rounds:reg}).find(r=>r.code===t); const line=+p[5]; return R(p[4]==="o"?row.W>line:row.W<line); }
    if(k==="band"){ if(!lad) return null; const [a,b]=p[4].split("-").map(Number), i=lad.indexOf(t)+1; return R(i>=a&&i<=b); }
    if(k==="riv") return lad?R(lad.indexOf(p[3])<lad.indexOf(p[4])):null;
    if(k==="spec"){ if(!champ) return null;
      if(p[3]==="first"){ const prev=(honoursAll().find(x=>/GRAND FINAL WINNERS/i.test(x.title))||{rows:[]}).rows.filter(r=>r.s<sid).map(r=>gfWinner(r.text)); return R(!prev.includes(champ)===(p[4]==="y")); }
      if(p[3]==="minor") return lad?R(lad[0]===champ):null;
      if(p[3]==="out4") return lad?R(lad.indexOf(champ)>=4):null; }
    return null;
  }
  if(comp==="origin"){
    const s=mcSeason("origin",sid); if(!s) return null; const ms=s.rounds[0].matches; if(!ms.length||!ms.every(played)) return null;
    let n=0,q=0; ms.forEach(m=>{ const w=m.hs>m.as?m.home:m.as>m.hs?m.away:null; if(w==="NSW") n++; else if(w==="QLD") q++; });
    if(p[2]==="series") return n===q?"V":((n>q)===(p[3]==="NSW")?"W":"L");
    if(p[2]==="score"){ const want=p[3].replace("_"," "), got=n>q?`NSW ${n}-${q}`:`QLD ${q}-${n}`; return got===want?"W":"L"; }
  }
  if(comp==="intl"){
    const s=mcSeason("intl",sid); if(!s) return null; const g=p[3].replace(/_/g," ");
    const fin=s.rounds.filter(r=>r.isFinal).flatMap(r=>r.matches).find(m=>m.group===g);
    if(p[2]==="grpf") return fin&&fin.home!=="TBC"&&fin.away!=="TBC"?([fin.home,fin.away].includes(p[4])?"W":"L"):null;
    if(p[2]==="grp") return fin&&played(fin)&&fin.hs!==fin.as?(((fin.hs>fin.as?fin.home:fin.away)===p[4])?"W":"L"):null;
  }
  return null;
}

/* ---------- wallet (this browser only) ---------- */
const DBW_KEY="dingobet.wallet.v1";
let DBW=null, DB_SLIP=[], DB_STAKES={}, DB_MULTI="";
// logged in: the wallet comes from the account (server); otherwise this browser's guest wallet
const dbServer=()=>typeof acIn==="function" && acIn();
function dbWalletFromAccount(){
  const w=AC.me.wallet;
  const W={server:true, v:AC.v, balance:+w.balance, bets:(w.bets||[]).map(b=>({...b, stake:+b.stake, price:+b.price, ret:+b.ret})), created:AC.me.created,
    daily:(w.daily&&w.daily>=w.today)?dbToday():null, resets:w.resets||0, badges:w.badges||{}, bonus:+w.bonus||0, tickets:w.tickets||[], ballot:w.ballot||{}};
  W._saved={badges:JSON.stringify(W.badges), ballot:JSON.stringify(W.ballot)};
  return W;
}
function dbWallet(){
  if(dbServer()){ if(!DBW||!DBW.server||DBW.v!==AC.v){ DBW=dbWalletFromAccount(); dbLoadSlip(); } return DBW; }
  if(DBW&&DBW.server) DBW=null;
  if(DBW) return DBW;
  try{ DBW=JSON.parse(localStorage.getItem(DBW_KEY)||"null"); }catch(e){ DBW=null; }
  if(!DBW||typeof DBW.balance!=="number") DBW={balance:DB.START, bets:[], created:Date.now(), daily:null, resets:0, badges:{}, bonus:0};
  dbLoadSlip();
  return DBW;
}
let DB_SLIP_LOADED=false;
function dbLoadSlip(){ if(DB_SLIP_LOADED) return; DB_SLIP_LOADED=true; try{ const s=JSON.parse(localStorage.getItem(DBW_KEY+".slip")||"null"); if(s){ DB_SLIP=s.slip||[]; DB_STAKES=s.stakes||{}; DB_MULTI=s.multi||""; } }catch(e){} }
function dbSave(){
  try{ localStorage.setItem(DBW_KEY+".slip", JSON.stringify({slip:DB_SLIP,stakes:DB_STAKES,multi:DB_MULTI})); }catch(e){}
  if(!DBW) return;
  if(DBW.server){ // only badges and ticket ballots are saved from the page; money moves go through the account functions
    ["badges","ballot"].forEach(k=>{ const s=JSON.stringify(DBW[k]||{}); if(s!==DBW._saved[k]){ DBW._saved[k]=s; acRpc("save_extra",{p_token:AC.token,p_key:k,p_value:DBW[k]||{}}).then(()=>{ AC.me.wallet[k]=JSON.parse(s); }).catch(()=>{}); } });
    return; }
  try{ localStorage.setItem(DBW_KEY, JSON.stringify(DBW)); }catch(e){} }
function dbLegResult(leg){
  if(leg.sgm){ const rs=leg.sgm.map(k=>dbLegResult({key:k})); if(rs.includes("L")||rs.includes("D")) return "L"; if(rs.includes(null)) return null; return "W"; }
  const p=leg.key.split("|");
  if(p[0]==="m"){ const g=dbMatch(p[1]); if(!g) return "V"; if(!played(g.m)) return null; return dbEval(p.slice(2).filter(x=>x!=="boost"), g.m.hs, g.m.as); }
  if(p[0]==="f") return dbFutResult(leg.key);
  return null;
}
// work out a bet's result from the results on the site: null = not finished yet
function dbBetOutcome(b){
  const rs=b.legs.map(dbLegResult);
  if(rs.includes("L")) return {status:"lost", ret:0, legRes:rs};
  if(rs.includes(null)) return null;
  const mult=b.legs.reduce((acc,l,i)=>acc*(rs[i]==="W"?+l.price:rs[i]==="D"?+l.price/2:1),1);
  return {status:rs.every(r=>r==="V")?"void":"won", ret:Math.round(b.stake*mult*100)/100, legRes:rs};
}
let DB_LOSS_SENT={};
function dbSettle(){
  const W=dbWallet(); let changed=false;
  if(W.server){
    // show results straight away; losses are settled from here, wins are paid out by the admin's browser
    const losses=[];
    W.bets.forEach(b=>{ if(b.status!=="open") return; const o=dbBetOutcome(b); b.legRes=o?o.legRes:b.legs.map(dbLegResult); b.pending=o&&o.status!=="lost"?o:null;
      if(o&&o.status==="lost"&&!DB_LOSS_SENT[b.id]){ DB_LOSS_SENT[b.id]=1; losses.push({id:b.id, legRes:o.legRes}); } });
    if(losses.length) acRpc("settle_losses",{p_token:AC.token,p_updates:losses}).then(me=>{ acUpdate(me); if(typeof render==="function") render(true); }).catch(()=>{});
    if(typeof acAdminSettle==="function") acAdminSettle();
    dbBadges(); return;
  }
  W.bets.forEach(b=>{ if(b.status!=="open") return;
    const rs=b.legs.map(dbLegResult); b.legRes=rs;
    if(rs.includes("L")){ b.status="lost"; b.ret=0; changed=true; }
    else if(!rs.includes(null)){ const mult=b.legs.reduce((acc,l,i)=>acc*(rs[i]==="W"?l.price:rs[i]==="D"?l.price/2:1),1);
      b.ret=Math.round(b.stake*mult*100)/100; b.status=rs.every(r=>r==="V")?"void":"won"; W.balance+=b.ret; changed=true; }
    if(b.status!=="open") b.settled=Date.now();
  });
  if(changed){ dbBadges(); dbSave(); }
}
function dbStats(){
  const W=dbWallet(), st=W.bets.filter(b=>b.status!=="open"&&b.status!=="void"), staked=st.reduce((a,b)=>a+b.stake,0), ret=st.reduce((a,b)=>a+b.ret,0);
  const open=W.bets.filter(b=>b.status==="open");
  return {staked, ret, profit:ret-staked, won:st.filter(b=>b.status==="won").length, lost:st.filter(b=>b.status==="lost").length, settled:st.length,
    open:open.length, openStake:open.reduce((a,b)=>a+b.stake,0), biggest:st.reduce((a,b)=>Math.max(a,b.ret-b.stake),0)};
}
const DB_BADGES=[
  ["first","First Punt","Place your first bet",W=>W.bets.length>0],
  ["fut","Crystal Ball","Place a season futures bet",W=>W.bets.some(b=>b.legs.some(l=>l.key.startsWith("f|")))],
  ["multi","Multi Maestro","Win a multi with 3+ legs",W=>W.bets.some(b=>b.status==="won"&&dbLegCount(b)>=3)],
  ["sgm","Same Game Genius","Win a Same Game Multi",W=>W.bets.some(b=>b.status==="won"&&b.legs.some(l=>l.sgm))],
  ["roughie","Roughie Hunter","Win a single at $3.50 or more",W=>W.bets.some(b=>b.status==="won"&&b.legs.length===1&&b.price>=3.5)],
  ["boost","Boosted","Back a Dingo Boost",W=>W.bets.some(b=>b.legs.some(l=>l.boost))],
  ["high","High Roller","Place a D$500+ bet",W=>W.bets.some(b=>b.stake>=500)],
  ["five","On Fire","Win 5 bets in a row",W=>{ let r=0,m=0; W.bets.filter(b=>b.status==="won"||b.status==="lost").sort((a,b)=>a.settled-b.settled).forEach(b=>{ r=b.status==="won"?r+1:0; m=Math.max(m,r); }); return m>=5; }],
  ["10k","Dingo Millionaire","Reach a D$10,000 balance",W=>W.balance>=10000],
  ["broke","Back to the Kennel","Reset your wallet",W=>W.resets>0]
];
function dbBadges(){ const W=dbWallet(); W.badges=W.badges||{}; let fresh=[]; DB_BADGES.forEach(([id,name,,test])=>{ if(!W.badges[id] && test(W)){ W.badges[id]=Date.now(); fresh.push(name); } }); if(fresh.length) setTimeout(()=>dbToast("🏅 Badge unlocked: "+fresh.join(", ")),300); }
function dbToday(){ const d=new Date(); return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate(); }

/* ---------- computer punters (leaderboard) ---------- */
function dbBots(){
  const bots=[
    {id:"mick", name:"Mug Punter Mick", desc:"D$100 on the favourite, every game", pick:(M)=>({side:M.ph>=M.pa?"h":"a", mkt:"h2h", stake:100})},
    {id:"rhonda", name:"Roughie Rhonda", desc:"D$50 on the underdog, every game", pick:(M)=>({side:M.ph>=M.pa?"a":"h", mkt:"h2h", stake:50})},
    {id:"harry", name:"Home Ground Harry", desc:"D$100 on the home team", pick:()=>({side:"h", mkt:"h2h", stake:100})},
    {id:"lucy", name:"Line Lucy", desc:"D$100 on the underdog at the line", pick:(M)=>({side:M.e>=0?"a":"h", mkt:"line", stake:100})},
    {id:"ollie", name:"Over Ollie", desc:"D$100 on the Over, every game", pick:()=>({side:"o", mkt:"tot", stake:100})}
  ];
  const games=[]; Object.keys(DB.LAUNCH).forEach(c=>{ const from=DB.LAUNCH[c]; mcIds(c).filter(id=>id>=from).forEach(id=>{ const s=mcSeason(c,id); if(!s) return;
    s.rounds.forEach((r,ri)=>{ if(r.rep&&c==="draw") return; r.matches.forEach((m,mi)=>{ if(played(m)&&m.home!=="TBC") games.push({c,sid:id,ri,mi,s,r,m,fam:DB_FAMC[c]}); }); }); }); });
  const tips={right:0,n:0};
  bots.forEach(b=>{ b.bal=DB.START; b.n=0; b.w=0; b.staked=0; });
  games.forEach(g=>{
    const P=dbGamePred(g), pH=dbPhi(P.e/P.sdM), oh=P.manual?P.manual.oh:dbPrice(pH,DB.OVER.two), oa=P.manual?P.manual.oa:dbPrice(1-pH,DB.OVER.two);
    const L=Math.floor(P.e)+0.5, TT=Math.floor(P.T)+0.5, M={ph:pH,pa:1-pH,e:P.e}, hs=g.m.hs, as=g.m.as;
    tips.n++; if((hs-as)*(P.e)>0) tips.right++;
    bots.forEach(b=>{ const k=b.pick(M); let res, price;
      if(k.mkt==="h2h"){ res=dbEval(["h2h",k.side],hs,as); price=k.side==="h"?oh:oa; }
      else if(k.mkt==="line"){ res=dbEval(["line",k.side,L],hs,as); price=1.9; }
      else { res=dbEval(["tot",k.side,TT],hs,as); price=1.9; }
      b.n++; b.staked+=k.stake; const ret=res==="W"?k.stake*price:res==="D"?k.stake*price/2:0; if(res==="W") b.w++; b.bal+=ret-k.stake; });
  });
  return {bots, tips, games:games.length};
}

/* ---------- views ---------- */
function dbBtn(s, cls=""){
  if(!s) return "";
  const on=DB_SLIP.some(x=>x.key===s.key);
  DB_SELS[s.key]=s;
  return `<button class="db-pr ${cls}${on?" on":""}" data-sel="${esc(s.key)}"><span class="db-pl">${esc(s.label)}</span><b>${dbFmt(s.price)}</b>${s.was?`<s>${dbFmt(s.was)}</s>`:""}</button>`;
}
const DB_SELS={};
function dbHeader(active){
  const W=dbWallet(), canDaily=W.daily!==dbToday();
  const tabs=[["","Matches"],["futures","Futures"],["sim","Season Simulator"],["bets","My Bets"],["board","Leaderboard"],["how","How It Works"]];
  return `<div class="db-head"><div class="wrap">
    <div class="db-top"><div class="db-brand"><span class="db-logo"><b>dingo</b>bet<i></i></span><span class="db-tag">Just for fun · Dingo Dollars only · No real money</span></div>
      <div class="db-wallet"><span class="db-bal"><small>${W.server?`👤 ${esc(AC.me.username)}`:`Guest wallet · <a href="javascript:void 0" data-act="login" data-m="signup">Sign up</a> / <a href="javascript:void 0" data-act="login" data-m="login">Log in</a>`}</small><b id="dbBal">${dbMoney(W.balance)}</b></span>
        ${canDaily?`<button class="db-daily" data-act="daily">Claim daily D$${DB.DAILY}</button>`:`<span class="db-claimed">Daily bonus claimed ✓</span>`}</div></div>
    <nav class="db-tabs">${tabs.map(([k,l])=>`<a href="#dingobet${k?"-"+k:""}" class="${active===k?"on":""}">${l}${k==="bets"&&dbStats().open?` <em>${dbStats().open}</em>`:""}</a>`).join("")}</nav>
  </div></div>`;
}
function dbLayout(active, main){
  return `${dbHeader(active)}<section class="section db-page"><div class="wrap db-grid"><div class="db-main">${main}</div><aside class="db-slip" id="dbSlip">${dbSlipHtml()}</aside></div></section>
  <button class="db-slipbar" id="dbSlipBar" data-act="openslip">${dbSlipBarHtml()}</button>
  <div class="db-toast" id="dbToast"></div>
  <footer class="db-rg">Dingobet is a just-for-fun game on the ${esc(COMP.name)} site. Dingo Dollars have no value and can't be bought, sold or withdrawn. Odds are generated automatically from results and are for entertainment only. Real gambling can cause harm — if it's affecting you or someone you know, call Gambling Help Online on 1800 858 858 or visit gamblinghelponline.org.au.</footer>`;
}
function dbMatchTile(g, boost){
  const m=g.m, p=played(m);
  if(p) return `<div class="db-tile done"><div class="db-tl">${esc(dbLabel(g))}<span>Result</span></div><div class="db-res">${logo(m.home,"sm")} ${esc(team(m.home).nick)} <b>${m.hs} – ${m.as}</b> ${esc(team(m.away).nick)} ${logo(m.away,"sm")}</div></div>`;
  const M=dbMarkets(g), mk=id=>M.markets.find(x=>x.id===id), count=M.markets.reduce((a,x)=>a+x.sels.length,0);
  const fav=M.ph>=M.pa?M.H:M.A, fp=Math.round(Math.max(M.ph,M.pa)*100), upset=Math.min(M.ph,M.pa)>=0.4;
  return `<div class="db-tile" id="dbm-${m.mid}"><div class="db-tl">${esc(dbLabel(g))}<span>${esc(venueOf(m))}</span></div>
    <div class="db-teams"><div>${logo(m.home)}<b>${esc(M.H)}</b></div><i>v</i><div>${logo(m.away)}<b>${esc(M.A)}</b></div></div>
    <div class="db-row3"><div><small>Head to Head</small>${mk("h2h").sels.map(s=>dbBtn(s)).join("")}</div>
      <div><small>Line</small>${mk("line").sels.map(s=>dbBtn(s)).join("")}</div>
      <div><small>Total Points</small>${mk("tot").sels.map(s=>dbBtn(s)).join("")}</div></div>
    <div class="db-tipline"><span class="db-tip">🐕 Dingo's tip: <b>${esc(fav)}</b> (${fp}%)${upset?` <em class="db-upset">Upset alert</em>`:""}</span><a class="db-more" href="#dingobet-${m.mid}">All markets (${count}) ›</a></div>
  </div>`;
}
function dbLabel(g){ const m=g.m, r=g.r; return [r.intl?(m.group||""):"", r.rep?(m.label||r.name):r.name, m.day, m.time].filter(Boolean).join(" · "); }
function viewDbHome(){
  const W=dbWallet(); dbSettle();
  const Rs=dbRounds(); let html="";
  if(!Rs.length) html+=`<div class="db-empty"><h3>No games to bet on right now</h3><p>Odds appear here as soon as the next round's games are on the draw. Season futures are open in the meantime.</p><a class="db-cta" href="#dingobet-futures">Browse futures ›</a></div>`;
  Rs.forEach(R=>{ const B=dbBoost(R);
    html+=`<div class="db-sec"><h2 class="section-title">${esc(R.comp)} · ${esc(R.r.rep?R.r.name:R.r.name)} <span class="db-sub">${esc(R.s.name)}</span></h2>
    ${B?`<div class="db-boost"><div><span class="db-bt">⚡ Dingo Boost</span><b>${esc(B.label)}</b><small>${esc(B.ev)} · Winning Margin · singles only, max D$50</small></div>${dbBtn(B,"boost")}</div>`:""}
    <div class="db-tiles">${R.games.map(g=>dbMatchTile(g)).join("")}</div></div>`; });
  const F=dbFutures(), pm=F.markets.find(x=>x.id==="premier");
  html+=`<div class="db-sec"><h2 class="section-title">Season ${F.sid} Premiership – Top of the market <a href="#dingobet-futures">All futures ›</a></h2>
    <div class="db-fav">${pm.sels.slice(0,6).map(s=>`<div class="db-favc">${logo(s.team)}<span>${esc(s.label)}</span>${dbBtn({...s,label:"Win"})}</div>`).join("")}</div></div>`;
  return dbLayout("", html);
}
function dbWhy(g, M){
  const P=M.P, m=g.m, H=m.home, A=m.away;
  const fam=mcFamily(DB_FAMC[g.c]==="intl"?"intl":DB_FAMC[g.c]).filter(x=>played(x.m));
  const k=x=>mcKey(x), form=t=>fam.filter(x=>mcHas(x,k(t))).slice(-5).map(x=>mcRes(x,k(t)));
  const h2h=fam.filter(x=>mcHas(x,k(H))&&mcHas(x,k(A))), hw=h2h.filter(x=>mcRes(x,k(H))==="W").length, aw=h2h.filter(x=>mcRes(x,k(A))==="W").length;
  const f=s=>s.map(x=>`<i class="${x}">${x}</i>`).join("")||"–";
  const proj=[Math.max(0,Math.round((P.T+P.e)/2)),Math.max(0,Math.round((P.T-P.e)/2))];
  const irl=dbIrl(), ir=t=>irl[k(t)]!=null?irl[k(t)].toFixed(2):null;
  return `<div class="db-why">
    <div class="db-proj"><div>${logo(H)}<b>${proj[0]}</b></div><span>Dingo's projected score</span><div><b>${proj[1]}</b>${logo(A)}</div></div>
    <div class="db-bar"><i style="flex:${Math.round(M.ph*100)}"></i><i class="a" style="flex:${Math.round(M.pa*100)}"></i></div>
    <div class="db-barl"><span>${Math.round(M.ph*100)}%</span><span>Win chance</span><span>${Math.round(M.pa*100)}%</span></div>
    <table class="db-wt"><tr><td>${f(form(H))}</td><th>Last 5</th><td>${f(form(A))}</td></tr>
      <tr><td>${hw}</td><th>Head-to-head wins (${h2h.length} game${h2h.length===1?"":"s"})</th><td>${aw}</td></tr>
      ${ir(H)&&ir(A)?`<tr><td>${ir(H)}</td><th>IRL ranking points</th><td>${ir(A)}</td></tr>`:""}
      <tr><td colspan="3" class="db-note">${P.manual?"Head-to-head price set by the competition; every other market is built to match it.":
        `Home ground advantage ${P.hfa>=1?`worth about ${P.hfa.toFixed(1)} points`:"is minimal at this venue"}. Line ${esc(M.H)} ${dbLineTxt(-M.line)}, total ${M.total}.`}</td></tr></table></div>`;
}
function viewDbMatch(mid){
  dbSettle();
  const g=dbMatch(mid);
  if(!g) return dbLayout("", `<div class="db-empty"><h3>Match not found</h3><a class="db-cta" href="#dingobet">Back to Dingobet ›</a></div>`);
  if(played(g.m)||!dbIsCurrent(mid)) return dbLayout("", `<a class="back" href="#dingobet">‹ All matches</a><div class="db-empty"><h3>${esc(team(g.m.home).nick)} v ${esc(team(g.m.away).nick)}</h3><p>${played(g.m)?`Markets are closed — full time: ${g.m.hs}–${g.m.as}.`:"Markets open when this game's round is up next."}</p><a class="db-cta" href="#match-${mid}">Match Centre ›</a></div>`);
  const M=dbMarkets(g), R=dbRounds().find(x=>x.games.some(y=>y.m.mid===mid)), B=R&&dbBoost(R);
  const boostHere=B&&B.mid===mid;
  const sections=M.markets.map((mk,i)=>`<details class="db-mk" ${i<4?"open":""}><summary>${esc(mk.name)}<span>${mk.sels.length}</span></summary>
    <div class="db-sels ${mk.sels.length===2||mk.id==="tp"||mk.id.startsWith("alt")?"two":mk.sels.length===3?"three":mk.id==="wm"||mk.id==="bands"?"five":mk.id==="ht"?"two":""}">${mk.sels.map(s=>dbBtn(s)).join("")}</div>${mk.note?`<div class="db-mnote">${esc(mk.note)}</div>`:""}</details>`).join("");
  return dbLayout("", `<a class="back" href="#dingobet">‹ All matches</a>
    <div class="db-mhead"><div class="db-tl">${esc(dbLabel(g))} · ${esc(venueOf(g.m))}</div>
      <div class="db-teams big"><div>${logo(g.m.home,"lg")}<b>${esc(M.H)}</b></div><i>v</i><div>${logo(g.m.away,"lg")}<b>${esc(M.A)}</b></div></div>
      <a class="db-mclink" href="#match-${mid}">Match Centre ›</a></div>
    ${boostHere?`<div class="db-boost"><div><span class="db-bt">⚡ Dingo Boost</span><b>${esc(B.label)}</b><small>Singles only, max D$50</small></div>${dbBtn(B,"boost")}</div>`:""}
    <div class="db-sgmtip">🧩 <b>Same Game Multi:</b> pick two or more selections from this game and they're priced together from Dingo's 20,000 simulations of the match.</div>
    ${dbWhy(g,M)}${sections}`);
}
function viewDbFutures(sub){
  dbSettle();
  const F=dbFutures(), grp={prem:`Season ${F.sid} Premiership`, origin:`State of Origin – Season ${F.O.sid}`, intl:`International Series – Season ${F.I?F.I.sid:""}`};
  const tabs=[["prem",grp.prem],["team","Team Markets"],["origin","State of Origin"],["intl","International Series"]].filter(([k])=>k!=="intl"||F.markets.some(m=>m.group==="intl"));
  const cur=sub&&tabs.some(t=>t[0]===sub)?sub:"prem";
  let body="";
  if(cur==="team"){
    const t=DB_TEAM&&F.P.ti[DB_TEAM]!=null?DB_TEAM:F.P.teams[0];
    const sels=F.markets.flatMap(m=>m.sels.map(s=>({...s,mk:m.name,mid:m.id}))).filter(s=>s.team===t && (s.key.includes(`|${t}`)) && !s.key.includes("|riv|"));
    const by=id=>sels.filter(s=>s.mid===id);
    body=`<div class="db-teampick">${F.P.teams.slice().sort((a,b)=>team(a).nick.localeCompare(team(b).nick)).map(x=>`<button data-act="team" data-team="${x}" class="${x===t?"on":""}" title="${esc(team(x).nick)}">${logo(x,"sm")}</button>`).join("")}</div>
      <div class="db-teamcard" style="--tc:${CLUB_BG[t]||"#111"}">${logo(t,"lg")}<div><h3>${esc(team(t).name||team(t).nick)}</h3><span>Season ${F.sid} markets</span></div></div>
      ${[["premier","Premiership"],["minor","Minor Premiership"],["gf","Make the Grand Final"],["top4","Make the Top 4"],["top8","Make the Top 8"],["spoon","Wooden Spoon"],["wins","Regular Season Wins"],["band","Finishing Position"]].map(([id,l])=>{ const ss=by(id); return ss.length?`<div class="db-trow"><span>${l}</span><div>${ss.map(s=>dbBtn({...s,label:id==="band"?s.short:id==="top8"?(s.yes?"Yes":"No"):id==="wins"?s.label.replace(team(t).nick+" ",""):"Yes"})).join("")}</div></div>`:""; }).join("")}`;
  } else {
    body=F.markets.filter(m=>m.group===cur).map((mk,i)=>{
      const pairs=mk.note==="pairs", yn=mk.note==="yesno";
      const inner = pairs ? `<div class="db-pairs">${chunk(mk.sels,2).map(([a,b])=>`<div class="db-pair">${logo(a.key.split("|")[4])}${dbBtn(a)}${dbBtn(b)}${logo(b.key.split("|")[4])}</div>`).join("")}</div>`
        : yn ? `<div class="db-yn">${chunk(mk.sels,2).map(([a,b])=>`<div class="db-ynr">${a.team?logo(a.team,"sm"):""}<span>${esc(a.team?team(a.team).nick:a.label)}</span>${dbBtn({...a,label:a.key.endsWith("|y")?"Yes":a.label.split(" ").slice(-2).join(" ")})}${dbBtn({...b,label:b.key.endsWith("|n")?"No":b.label.split(" ").slice(-2).join(" ")})}</div>`).join("")}</div>`
        : `<div class="db-out">${mk.sels.map(s=>`<div class="db-outr">${s.team?logo(s.team,"sm"):s.pair?`<span class="db-two">${logo(s.pair[0],"sm")}${logo(s.pair[1],"sm")}</span>`:""}<span>${esc(s.label)}</span>${dbBtn({...s,label:""})}</div>`).join("")}</div>`;
      return `<details class="db-mk" ${i<3?"open":""}><summary>${esc(mk.name)}<span>${mk.sels.length}</span></summary>${inner}${mk.note&&!["pairs","yesno","team"].includes(mk.note)?`<div class="db-mnote">${esc(mk.note)}</div>`:""}</details>`; }).join("");
    if(cur==="prem"&&F.P.generated) body=`<div class="db-mnote top">The Season ${F.sid} draw isn't out yet, so these prices come from 10,000 simulated seasons in which every team plays every other team once. They'll update automatically once the full draw and results are added.</div>`+body;
  }
  return dbLayout("futures", `<div class="db-subtabs">${tabs.map(([k,l])=>`<a href="#dingobet-futures-${k}" class="${k===cur?"on":""}">${esc(l)}</a>`).join("")}</div>${body}`);
}
let DB_TEAM=null;
function chunk(a,n){ const o=[]; for(let i=0;i<a.length;i+=n) o.push(a.slice(i,i+n)); return o; }
function viewDbSim(){
  const F=dbFutures(), P=F.P, n=P.teams.length, N=P.N;
  const rows=P.teams.map((t,i)=>{ let ew=0, tot=0; P.wins[i].forEach((c,k)=>{ ew+=k*c; tot+=c; }); let ep=0; P.pos[i].forEach((c,k)=>ep+=(k+1)*c/N);
    const sum=(a,b)=>{ let s=0; for(let k=a;k<=b;k++) s+=P.pos[i][k]; return s/N; };
    return {t,i,ew:ew/tot,ep,top8:sum(0,7),top4:sum(0,3),prem:P.prem[i]/N,spoon:P.pos[i][n-1]/N}; }).sort((a,b)=>a.ep-b.ep);
  const pct=x=>x<0.005?"<1%":Math.round(x*100)+"%";
  const heat=(i,k)=>{ const v=P.pos[i][k]/N; return `<td style="background:rgba(0,207,93,${Math.min(0.95,v*3.2).toFixed(3)})" title="${(v*100).toFixed(1)}%">${v>=0.065?Math.round(v*100):""}</td>`; };
  const fit=P.fit, pr=P.teams.map(t=>({t,att:(fit.att[t]||0),def:-(fit.con[t]||0)})).map(x=>({...x,net:x.att+x.def})).sort((a,b)=>b.net-a.net);
  return dbLayout("sim", `<h2 class="section-title">Season ${F.sid} projected ladder <span class="db-sub">${N.toLocaleString()} simulated seasons</span></h2>
    <div class="db-simwrap"><table class="db-sim"><thead><tr><th class="l">Team</th><th>Avg finish</th><th>Proj. wins</th><th>Top 8</th><th>Top 4</th><th>Premiers</th><th>Spoon</th></tr></thead>
    <tbody>${rows.map((r,k)=>`<tr${k===7?' class="cut"':""}><td class="l">${logo(r.t,"sm")}<a href="#club-${r.t}">${esc(team(r.t).nick)}</a></td><td>${r.ep.toFixed(1)}</td><td>${r.ew.toFixed(1)}</td><td>${pct(r.top8)}</td><td>${pct(r.top4)}</td><td><b>${pct(r.prem)}</b></td><td>${pct(r.spoon)}</td></tr>`).join("")}</tbody></table></div>
    <h2 class="section-title" style="margin-top:34px">Where every team finishes <span class="db-sub">% of simulations</span></h2>
    <div class="db-simwrap"><table class="db-heat"><thead><tr><th class="l">Team</th>${[...Array(n).keys()].map(k=>`<th>${k+1}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r=>`<tr><td class="l">${logo(r.t,"sm")}${esc(team(r.t).nick)}</td>${[...Array(n).keys()].map(k=>heat(r.i,k)).join("")}</tr>`).join("")}</tbody></table></div>
    <h2 class="section-title" style="margin-top:34px">Dingo's power rankings <span class="db-sub">points above an average team</span></h2>
    <div class="db-power">${pr.map((x,k)=>`<div class="db-pw"><span class="n">${k+1}</span>${logo(x.t,"sm")}<b>${esc(team(x.t).nick)}</b><span class="db-pwb"><i style="width:${Math.min(100,Math.abs(x.net)*7)}%" class="${x.net<0?"neg":""}"></i></span><span class="v">${x.net>0?"+":""}${x.net.toFixed(1)}</span><small>Attack ${x.att>0?"+":""}${x.att.toFixed(1)} · Defence ${x.def>0?"+":""}${x.def.toFixed(1)}</small></div>`).join("")}</div>
    <p class="db-mnote">Ratings use every Premiership result, with recent seasons and recent rounds counting most. Results in this competition are close to a coin flip — Dingo's model picks the winner a little over half the time — so the ratings are deliberately cautious.</p>`);
}
function dbLegCount(b){ return b.legs.reduce((a,l)=>a+(l.sgm?l.sgm.length:1),0); }
function dbBetHtml(b){
  const st=b.pending?(b.pending.status==="void"?"Refund pending":"Won – payout pending"):{open:"Open",won:"Won",lost:"Lost",void:"Void"}[b.status];
  const nLegs=dbLegCount(b), kind=b.legs.length>1?`${nLegs}-leg ${b.legs.some(l=>l.sgm)?"Multi (incl. SGM)":"Multi"}`:b.legs[0].sgm?`${nLegs}-leg Same Game Multi`:"Single";
  return `<div class="db-bet ${b.pending?"won pending":b.status}"><div class="db-bh"><span>${kind} @ ${dbFmt(b.price)}</span><em>${st}</em></div>
    ${b.legs.map((l,i)=>`<div class="db-bl"><i class="${(b.legRes||[])[i]||""}"></i><div><b>${esc(l.label)}</b><small>${esc(l.mkt)} · ${esc(l.ev)}</small></div><span>${dbFmt(l.price)}</span></div>`).join("")}
    <div class="db-bf"><span>Stake ${dbMoney(b.stake)}</span><span>${b.pending?`Return ${dbMoney(b.pending.ret)}`:b.status==="open"?`To win ${dbMoney(b.stake*b.price)}`:`Return ${dbMoney(b.ret)}`}</span><small>${new Date(b.t).toLocaleDateString("en-AU",{day:"numeric",month:"short"})}</small></div></div>`;
}
function viewDbBets(){
  dbSettle();
  const W=dbWallet(), S=dbStats(), open=W.bets.filter(b=>b.status==="open").reverse(), done=W.bets.filter(b=>b.status!=="open").reverse();
  return dbLayout("bets", `<div class="db-stats">
      <div><small>Balance</small><b>${dbMoney(W.balance)}</b></div><div><small>Profit / loss</small><b class="${S.profit>=0?"pos":"neg"}">${dbSigned(S.profit)}</b></div>
      <div><small>Strike rate</small><b>${S.settled?Math.round(S.won/S.settled*100)+"%":"–"}</b></div><div><small>Bets won</small><b>${S.won} / ${S.settled}</b></div>
      <div><small>Biggest win</small><b>${dbMoney(S.biggest)}</b></div><div><small>In play</small><b>${dbMoney(S.openStake)}</b></div></div>
    <h2 class="section-title">Badges <span class="db-sub">${Object.keys(W.badges||{}).length} / ${DB_BADGES.length}</span></h2>
    <div class="db-badges">${DB_BADGES.map(([id,name,desc])=>`<div class="db-badge ${W.badges&&W.badges[id]?"got":""}"><span>${W.badges&&W.badges[id]?"🏅":"🔒"}</span><b>${esc(name)}</b><small>${esc(desc)}</small></div>`).join("")}</div>
    <h2 class="section-title" style="margin-top:30px">Open bets <span class="db-sub">${open.length}</span></h2>
    ${open.length?`<div class="db-betlist">${open.map(dbBetHtml).join("")}</div>`:`<p class="db-mnote">No open bets. <a href="#dingobet">Find a game ›</a></p>`}
    <h2 class="section-title" style="margin-top:30px">Settled <span class="db-sub">${done.length}</span></h2>
    ${done.length?`<div class="db-betlist">${done.map(dbBetHtml).join("")}</div>`:`<p class="db-mnote">Bets settle automatically as soon as results are added to the site.</p>`}
    <div class="db-reset"><div><b>Gone to the dogs?</b><span>Reset your wallet to ${dbMoney(DB.START)}. Your bet history is cleared, and the reset count shows on the leaderboard.</span></div><button data-act="reset">Reset wallet</button></div>`);
}
function viewDbBoard(){
  dbSettle();
  const B=dbBots(), S=dbStats(), W=dbWallet(), me=dbServer()?AC.me.username:null;
  const players=AC.board||[];
  if(typeof acBoard==="function" && (!AC.board || Date.now()-AC.boardAt>30000)) acBoard().then(x=>{ if(x && /^#dingobet-board/.test(location.hash)) render(true); });
  const rows=players.map(p=>({name:p.username, desc:`${p.open?p.open+" open bet"+(p.open>1?"s":"")+" · ":""}Balance ${dbMoney(+p.balance)}${p.resets?` · ${p.resets} reset${p.resets>1?"s":""}`:""}`, n:+p.settled, w:+p.won, profit:+p.profit, you:p.username===me}));
  if(!me) rows.push({name:"You (guest)", desc:"This device only – sign up to join the leaderboard", n:S.settled, w:S.won, profit:S.profit, you:true, guest:true});
  B.bots.forEach(b=>rows.push({name:b.name, desc:b.desc, n:b.n, w:b.w, profit:b.bal-DB.START, bot:true}));
  rows.sort((a,b)=>b.profit-a.profit||a.name.localeCompare(b.name));
  const join = me ? "" : `<div class="db-join"><div><b>Get on the board</b><span>Create a free account to save your wallet on every device and take on everyone else.</span></div><button data-act="login" data-m="signup">Sign up</button></div>`;
  return dbLayout("board", `<h2 class="section-title">Punters' leaderboard <span class="db-sub">profit from settled bets</span></h2>
    <p class="db-mnote">Everyone with an account, plus Dingobet's five computer punters (🤖), who each stick to one strategy on every game from the International Series (Season 13) and the Premiership (Season 14) onwards.${AC.board?"":" Loading players…"}</p>
    ${join}
    <div class="db-board">${rows.map((r,i)=>`<div class="db-br${r.you?" you":""}${r.bot?" bot":""}"><span class="n">${i+1}</span><div><b>${r.bot?"🤖 ":""}${esc(r.name)}${r.you&&!r.guest?' <span class="db-me">You</span>':""}</b><small>${esc(r.desc)}</small></div><span class="rec">${r.w}/${r.n}</span><span class="p ${r.profit>=0?"pos":"neg"}">${dbSigned(r.profit)}</span></div>`).join("")}</div>
    <div class="db-tipsrec">🐕 Dingo's tips: <b>${B.tips.right} / ${B.tips.n}</b> correct${B.tips.n?` (${Math.round(B.tips.right/B.tips.n*100)}%)`:""} since launch.</div>`);
}
function viewDbHow(){
  return dbLayout("how", `<div class="db-how">
    <h2 class="section-title">How Dingobet works</h2>
    <p><b>Dingo Dollars only.</b> Everyone starts with ${dbMoney(DB.START)} and can claim a free D$${DB.DAILY} every day. Your wallet is saved in this browser, and there's no real money involved at all.</p>
    <h3>Where the odds come from</h3>
    <p>Every price is generated automatically from the results on this site. Each team gets an attack rating and a defence rating, with recent seasons and recent rounds counting most. Home ground advantage is reduced when a game is played away from a team's usual ground, and internationals also take the IRL rankings into account. Every game is then simulated 20,000 times, and each market is priced from how often it lands in those simulations.</p>
    <h3>The margins</h3>
    <p>Prices follow Sportsbet's NRL style. An even game is $1.90 a side, and the line and total points are set as close to 50/50 as possible at $1.90 each way. Markets with more outcomes carry a bigger margin, and long shots are trimmed slightly, the way real bookmakers do it.</p>
    <h3>Typed-in odds</h3>
    <p>If a competition's odds are typed into the data, as for International Series Round 1, Dingobet uses those head-to-head prices and builds every other market around them.</p>
    <h3>Which games are open</h3>
    <p>Only the current round of each competition (or the next one, if nothing is under way) is open for betting. The same odds appear on the Draw page, and clicking them brings you straight here.</p>
    <h3>Settling bets</h3>
    <p><b>Accounts:</b> without an account your wallet lives in this browser only. With a free account (just a username and password) your wallet, bets and badges are saved to your account on every device and you appear on the leaderboard. Losing bets settle as soon as the result is on the site; winning bets show as "Won – payout pending" until they're paid out, which happens automatically shortly after the result goes up.</p>
    <p>Bets settle themselves once a result is entered. If a head-to-head bet ends in a draw, dead heat rules apply and you're paid half your stake at full odds. A Same Game Multi leg that ends in a draw counts as a loss. Futures settle when the season, series or tournament finishes.</p>
    <h3>Multis and Same Game Multis</h3>
    <p>Add two or more selections and the slip offers a multi. Selections from the same game are priced together as a Same Game Multi from the simulations, so related picks such as "Kangaroos -8.5" and "Kangaroos 13+" are priced realistically. Futures from the same competition can go in one multi too: picks that can't both happen are blocked, a pick that's already guaranteed by another (say "Premiers" with "To Make the Top 8") adds nothing to the price, and linked picks on the same team are priced a little shorter. Match selections that can't both happen are blocked too. Boosts are singles only.</p>
    <h3>Just for fun</h3>
    <p>Real gambling can cause harm. If it's affecting you or someone you know, call Gambling Help Online on 1800 858 858.</p></div>`);
}
function viewDingobet(rest){
  dbWallet();
  if(!rest) return viewDbHome();
  if(/^[a-z]+-\d+-\d+-\d+$/.test(rest)) return viewDbMatch(rest);
  const [p,q]=rest.split(/-(.*)/s);
  if(p==="futures") return viewDbFutures(q);
  if(p==="sim") return viewDbSim();
  if(p==="bets") return viewDbBets();
  if(p==="board") return viewDbBoard();
  if(p==="how") return viewDbHow();
  return viewDbHome();
}

/* ---------- futures in the same multi ----------
   Futures from one competition can share a multi. Picks that can't both
   happen are blocked, a pick that's already guaranteed by another (e.g.
   "Premiers" makes "Top 8" certain) adds nothing to the price, and other
   picks on the same team are trimmed because they tend to land together. */
function dbFutCombine(ls){
  const n=(dbFutures().P.teams||[]).length||17;
  const info=l=>{ const p=l.key.split("|").slice(1), c=p[0], m=p[2];
    const o={l, c, m, p, t:null, lo:1, hi:n, gf:false, champ:false};
    if(c==="ctdwp"){
      if(m==="premier"){ o.t=p[3]; o.hi=8; o.gf=o.champ=true; }
      else if(m==="gf"){ o.t=p[3]; o.hi=8; o.gf=true; }
      else if(m==="minor"){ o.t=p[3]; o.hi=1; }
      else if(m==="spoon"){ o.t=p[3]; o.lo=n; }
      else if(m==="top4"){ o.t=p[3]; o.hi=4; }
      else if(m==="top8"){ o.t=p[3]; if(p[4]==="y") o.hi=8; else o.lo=9; }
      else if(m==="band"){ o.t=p[3]; const [a,b]=p[4].split("-").map(Number); o.lo=a; o.hi=b; }
      else if(m==="wins"){ o.t=p[3]; }
    }
    return o; };
  const I=ls.map(info), name=x=>`"${x.l.mkt?x.l.mkt+": ":""}${x.l.label}"`;
  const clash=(a,b)=>`${name(a)} and ${name(b)} can't both happen.`;
  for(let i=0;i<I.length;i++) for(let j=i+1;j<I.length;j++){ const a=I[i], b=I[j];
    if(a.c!==b.c) continue;
    if(a.c==="ctdwp"){
      if(a.m===b.m && ["premier","minor","spoon","quin"].includes(a.m)) return {err:clash(a,b)};
      if(a.m===b.m && a.m==="spec" && a.p[3]===b.p[3]) return {err:clash(a,b)};
      if(a.m===b.m && ["top8","wins","band"].includes(a.m) && a.t===b.t) return {err:clash(a,b)};
      if(a.m==="riv" && b.m==="riv" && a.p[3]===b.p[4] && a.p[4]===b.p[3]) return {err:clash(a,b)};
      if(a.t && a.t===b.t && Math.max(a.lo,b.lo)>Math.min(a.hi,b.hi)) return {err:clash(a,b)};
      const q=a.m==="quin"?a:b.m==="quin"?b:null, o=q===a?b:a;
      if(q && o.champ && !q.p.slice(3,5).includes(o.t)) return {err:clash(a,b)};
      if(q && o.t && q.p.slice(3,5).includes(o.t) && o.lo>8) return {err:clash(a,b)};
      if(a.m==="minor" && b.m==="minor") return {err:clash(a,b)};
      if(a.hi===1 && b.hi===1 && a.t!==b.t) return {err:clash(a,b)};
      if(a.lo===n && b.lo===n && a.t!==b.t) return {err:clash(a,b)};
    }
    if(a.c==="origin"){
      if(a.m===b.m) return {err:clash(a,b)};
      const side=x=>x.m==="series"?x.p[3]:x.p[3].slice(0,3);
      if(side(a)!==side(b)) return {err:clash(a,b)};
    }
    if(a.c==="intl" && a.p[3]===b.p[3]){
      if(a.m==="grp" && b.m==="grp") return {err:clash(a,b)};
    }
  }
  // International Series: only two sides can make each final
  const fin={}; I.filter(x=>x.c==="intl").forEach(x=>{ const g=x.p[3]; (fin[g]=fin[g]||new Set()).add(x.p[4]); });
  for(const [g,s] of Object.entries(fin)) if(s.size>2) return {err:`Only two teams can make the ${g.replace(/_/g," ")} final.`};
  // does a imply b?
  const implies=(a,b)=>{ if(a===b||a.c!==b.c) return false;
    if(a.c==="ctdwp"){
      const inQuin=(q,t)=>q.m==="quin"&&q.p.slice(3,5).includes(t);
      if(b.m==="gf") return (a.m==="premier"&&a.t===b.t)||inQuin(a,b.t);
      if(["top8","top4","band"].includes(b.m)){ const lo=inQuin(a,b.t)?1:a.t===b.t?a.lo:null, hi=inQuin(a,b.t)?8:a.hi; return lo!=null && lo>=b.lo && hi<=b.hi && (a.lo!==b.lo||a.hi!==b.hi||I.indexOf(a)<I.indexOf(b)); }
    }
    if(a.c==="origin") return a.m==="score" && b.m==="series" && a.p[3].slice(0,3)===b.p[3];
    if(a.c==="intl") return a.m==="grp" && b.m==="grpf" && a.p[3]===b.p[3] && a.p[4]===b.p[4];
    return false; };
  const keep=I.filter(b=>!I.some(a=>implies(a,b)));
  let price=keep.reduce((acc,x)=>acc*x.l.price,1);
  // linked picks on the same team (or the same final) tend to land together
  const seen={}; let linked=0;
  keep.forEach(x=>{ const k=x.c+"|"+(x.t||(x.c==="intl"?x.p[3]:x.c==="origin"?"series":"")); if(!x.t&&x.c==="ctdwp") return; if(seen[k]) linked++; seen[k]=1; });
  if(linked) price=Math.max(Math.max(...keep.map(x=>x.l.price)), price*Math.pow(0.85,linked));
  return {price};
}
/* ---------- bet slip ---------- */
function dbSlipGroups(){
  // group match legs by game so same-game legs become one Same Game Multi leg
  const groups={}, out=[];
  DB_SLIP.forEach(s=>{ if(s.boost){ out.push({boost:true,legs:[s]}); return; } const k=s.mid||("fut:"+s.key.split("|").slice(1,3).join("|")); (groups[k]=groups[k]||[]).push(s); });
  return {groups, extra:out};
}
function dbMultiInfo(){
  const legs=DB_SLIP.filter(s=>!s.boost); if(legs.length<2) return null;
  const {groups}=dbSlipGroups(); let price=1, err="", parts=[];
  for(const [k,ls] of Object.entries(groups)){
    if(k.startsWith("fut:")){ const F=dbFutCombine(ls); if(F.err){ err=F.err; break; } price*=F.price; ls.forEach(l=>parts.push({key:l.key,label:l.label,mkt:l.mkt,ev:l.ev,price:l.price})); continue; }
    if(ls.length===1){ price*=ls[0].price; parts.push({key:ls[0].key,label:ls[0].label,mkt:ls[0].mkt,ev:ls[0].ev,price:ls[0].price}); continue; }
    const g=dbMatch(k); const sim=dbSim(g); const p=dbJoint(sim, ls.map(s=>s.key.split("|").slice(2)));
    if(p<=0.0004){ err=`These ${team(g.m.home).nick} v ${team(g.m.away).nick} selections can't all happen.`; break; }
    const pr=Math.min(dbPrice(p,DB.OVER.sgm), ls.reduce((a,s)=>a*s.price,1));
    price*=pr; parts.push({key:"sgm|"+k, sgm:ls.map(s=>s.key), label:ls.map(s=>s.label).join(" + "), mkt:"Same Game Multi", ev:ls[0].ev, price:pr});
  }
  if(!err && parts.length<1) err="";
  return {price:Math.round(price*100)/100, err, parts, sgm:parts.some(p=>p.sgm), n:legs.length};
}
function dbSlipHtml(){
  const W=dbWallet();
  if(!DB_SLIP.length) return `<div class="db-slh"><b>Bet Slip</b><button class="db-x" data-act="closeslip" aria-label="Close">×</button></div><div class="db-slempty">Tap any price to add it to your slip.<small>Balance ${dbMoney(W.balance)}</small></div>`;
  const MI=dbMultiInfo();
  const singles=DB_SLIP.map(s=>`<div class="db-sl${s.boost?" boost":""}"><div class="db-slt"><b>${esc(s.label)}</b><span>${dbFmt(s.price)}</span><button data-act="rm" data-key="${esc(s.key)}" aria-label="Remove">×</button></div>
    <small>${esc(s.mkt)} · ${esc(s.ev)}</small>
    <div class="db-stk"><input type="number" min="0" step="1" inputmode="decimal" placeholder="Stake" data-stake="${esc(s.key)}" value="${esc(DB_STAKES[s.key]||"")}"><span data-ret="${esc(s.key)}">${DB_STAKES[s.key]?"Returns "+dbMoney((+DB_STAKES[s.key])*s.price):""}</span></div></div>`).join("");
  const multi = MI ? `<div class="db-sl multi"><div class="db-slt"><b>${MI.n}-leg ${MI.sgm?"Multi (incl. SGM)":"Multi"}</b><span>${MI.err?"–":dbFmt(MI.price)}</span></div>
    ${MI.err?`<small class="err">${esc(MI.err)}</small>`:`<small>${MI.parts.map(p=>esc(p.label)).join(" · ")}</small>
    <div class="db-stk"><input type="number" min="0" step="1" inputmode="decimal" placeholder="Stake" data-stake="__multi" value="${esc(DB_MULTI||"")}"><span data-ret="__multi">${DB_MULTI?"Returns "+dbMoney((+DB_MULTI)*MI.price):""}</span></div>`}</div>` : "";
  return `<div class="db-slh"><b>Bet Slip <em>${DB_SLIP.length}</em></b><button class="db-clear" data-act="clear">Clear</button><button class="db-x" data-act="closeslip" aria-label="Close">×</button></div>
    <div class="db-slbody"><div class="db-sllab">Singles</div>${singles}${multi?`<div class="db-sllab">Multi</div>${multi}`:""}</div>
    <div class="db-slfoot"><div class="db-quick">${[5,10,25,50,100].map(v=>`<button data-act="quick" data-v="${v}">D$${v}</button>`).join("")}</div>
      <div class="db-tot"><span>Total stake</span><b id="dbTotStake">${dbMoney(dbTotalStake())}</b></div>
      <button class="db-place" data-act="place">Place bets</button><small>Balance ${dbMoney(W.balance)}</small></div>`;
}
function dbSlipBarHtml(){ const n=DB_SLIP.length; return n?`<span class="c">${n}</span> Bet Slip <b>${dbMoney(dbWallet().balance)}</b>`:`Bet Slip <b>${dbMoney(dbWallet().balance)}</b>`; }
function dbTotalStake(){ let t=DB_SLIP.reduce((a,s)=>a+(+DB_STAKES[s.key]||0),0); const MI=dbMultiInfo(); if(MI&&!MI.err) t+=(+DB_MULTI||0); return t; }
function dbRefreshSlip(){ const el=document.getElementById("dbSlip"); if(el) el.innerHTML=dbSlipHtml(); const bar=document.getElementById("dbSlipBar"); if(bar) bar.innerHTML=dbSlipBarHtml();
  document.querySelectorAll("[data-sel]").forEach(b=>b.classList.toggle("on",DB_SLIP.some(x=>x.key===b.dataset.sel))); dbSave(); }
function dbToast(msg){ const t=document.getElementById("dbToast"); if(!t) return; t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),2600); }
function dbPlace(){
  const W=dbWallet(), MI=dbMultiInfo(), bets=[];
  for(const s of DB_SLIP){ const st=+DB_STAKES[s.key]||0; if(st<=0) continue;
    if(s.boost && st>50){ dbToast("Boosts are capped at D$50."); return; }
    const live=dbFindSel(s.key.replace("|boost","")); if(!live){ dbToast(`${s.label}: this market has closed.`); return; }
    bets.push({stake:st, price:s.price, legs:[{key:s.key.replace("|boost",""), label:s.label, mkt:s.mkt, ev:s.ev, price:s.price, boost:!!s.boost}]}); }
  const ms=+DB_MULTI||0; if(MI && !MI.err && ms>0) bets.push({stake:ms, price:MI.price, legs:MI.parts});
  if(!bets.length){ dbToast("Enter a stake first."); return; }
  const total=bets.reduce((a,b)=>a+b.stake,0);
  if(total>W.balance+1e-9){ dbToast(`Not enough Dingo Dollars: you have ${dbMoney(W.balance)}.`); return; }
  if(W.server){
    const btn=document.querySelector(".db-place"); if(btn){ if(btn.disabled) return; btn.disabled=true; btn.textContent="Placing…"; }
    acRpc("place_bets",{p_token:AC.token, p_bets:bets.map(b=>({stake:b.stake, price:Math.round(b.price*100)/100, legs:b.legs}))})
      .then(me=>{ acUpdate(me); DB_SLIP=[]; DB_STAKES={}; DB_MULTI=""; dbWallet(); dbBadges(); dbSave(); document.body.classList.remove("db-slip-open");
        render(true); setTimeout(()=>dbToast(`✅ ${bets.length} bet${bets.length>1?"s":""} placed – ${dbMoney(total)}`),50); })
      .catch(e=>{ dbToast(acErr(e)); if(btn){ btn.disabled=false; btn.textContent="Place bets"; } });
    return;
  }
  bets.forEach(b=>W.bets.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6), t:Date.now(), stake:b.stake, price:Math.round(b.price*100)/100, legs:b.legs, status:"open", ret:0}));
  W.balance=Math.round((W.balance-total)*100)/100; DB_SLIP=[]; DB_STAKES={}; DB_MULTI=""; dbBadges(); dbSave();
  document.body.classList.remove("db-slip-open");
  render(true); setTimeout(()=>dbToast(`✅ ${bets.length} bet${bets.length>1?"s":""} placed – ${dbMoney(total)}`),50);
}
document.addEventListener("click", e=>{
  const b=e.target.closest("[data-sel]");
  if(b){ e.preventDefault(); e.stopPropagation(); const key=b.dataset.sel, s=(key.startsWith("f|")&&dbFindSel(key))||DB_SELS[key]||dbFindSel(key); if(!s) return;
    const i=DB_SLIP.findIndex(x=>x.key===key);
    if(i>=0){ DB_SLIP.splice(i,1); delete DB_STAKES[key]; } else { DB_SLIP.push({key, label:s.label||s.ev, mkt:s.mkt||"", ev:s.ev, price:s.price, mid:s.mid||null, boost:!!s.boost, was:s.was}); if(DB_SLIP.length===1 && window.innerWidth<1200) document.body.classList.add("db-slip-open"); }
    dbRefreshSlip(); return; }
  const a=e.target.closest("[data-act]"); if(!a) return;
  const act=a.dataset.act, W=dbWallet();
  if(act==="rm"){ DB_SLIP=DB_SLIP.filter(x=>x.key!==a.dataset.key); delete DB_STAKES[a.dataset.key]; dbRefreshSlip(); }
  else if(act==="clear"){ DB_SLIP=[]; DB_STAKES={}; DB_MULTI=""; dbRefreshSlip(); }
  else if(act==="quick"){ const v=+a.dataset.v; DB_SLIP.forEach(s=>DB_STAKES[s.key]=v); if(dbMultiInfo()) DB_MULTI=""; dbRefreshSlip(); }
  else if(act==="place") dbPlace();
  else if(act==="openslip") document.body.classList.add("db-slip-open");
  else if(act==="closeslip") document.body.classList.remove("db-slip-open");
  else if(act==="daily" && W.server){ if(W.daily!==dbToday()) acRpc("claim_daily",{p_token:AC.token}).then(me=>{ acUpdate(me); render(true); setTimeout(()=>dbToast(`🎁 D$${DB.DAILY} added. See you tomorrow!`),50); }).catch(e=>dbToast(acErr(e))); }
  else if(act==="reset" && W.server){ if(confirmReset(a)) acRpc("reset_wallet",{p_token:AC.token}).then(me=>{ acUpdate(me); render(true); setTimeout(()=>dbToast("Wallet reset to "+dbMoney(DB.START)),50); }).catch(e=>dbToast(acErr(e))); }
  else if(act==="login"){ acOpen(a.dataset.m||"signup"); }
  else if(act==="daily"){ if(W.daily!==dbToday()){ W.daily=dbToday(); W.balance+=DB.DAILY; W.bonus=(W.bonus||0)+DB.DAILY; dbSave(); render(true); setTimeout(()=>dbToast(`🎁 D$${DB.DAILY} added. See you tomorrow!`),50); } }
  else if(act==="reset"){ if(confirmReset(a)){ DBW={balance:DB.START, bets:[], created:Date.now(), daily:W.daily, resets:(W.resets||0)+1, badges:W.badges||{}, bonus:0}; dbBadges(); dbSave(); render(true); setTimeout(()=>dbToast("Wallet reset to "+dbMoney(DB.START)),50); } }
  else if(act==="team"){ DB_TEAM=a.dataset.team; render(true); }
});
// two-tap reset (no browser dialogs)
function confirmReset(btn){ if(btn.dataset.armed){ return true; } btn.dataset.armed="1"; btn.textContent="Tap again to confirm"; setTimeout(()=>{ if(btn.isConnected){ delete btn.dataset.armed; btn.textContent="Reset wallet"; } },4000); return false; }
document.addEventListener("input", e=>{
  const i=e.target.closest("[data-stake]"); if(!i) return;
  const k=i.dataset.stake, v=i.value; let price;
  if(k==="__multi"){ DB_MULTI=v; const MI=dbMultiInfo(); price=MI?MI.price:0; } else { DB_STAKES[k]=v; const s=DB_SLIP.find(x=>x.key===k); price=s?s.price:0; }
  const r=document.querySelector(`[data-ret="${CSS.escape(k)}"]`); if(r) r.textContent=+v>0?"Returns "+dbMoney(+v*price):"";
  const t=document.getElementById("dbTotStake"); if(t) t.textContent=dbMoney(dbTotalStake()); dbSave();
});

/* ---------- used by the Draw page and Match Centre ---------- */
function dbH2H(m){
  if(!m || !m.mid || played(m) || m.home==="TBC" || m.away==="TBC" || !dbIsCurrent(m.mid)) return null;
  const g=dbMatch(m.mid); if(!g) return null; const M=dbMarkets(g);
  return {oh:M.markets[0].sels[0].price, oa:M.markets[0].sels[1].price, ph:M.ph, pa:M.pa, line:M.line, total:M.total, H:M.H, A:M.A, e:M.P.e};
}
