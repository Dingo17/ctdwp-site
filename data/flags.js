/* Simplified national flags drawn as SVG (viewBox 30 x 20). */
(function(){
  const star=(cx,cy,r,f,pts=5)=>{ let p=[]; for(let i=0;i<pts*2;i++){ const a=Math.PI/pts*i-Math.PI/2, rr=i%2?r*0.42:r; p.push((cx+rr*Math.cos(a)).toFixed(2)+","+(cy+rr*Math.sin(a)).toFixed(2)); } return `<polygon points="${p.join(" ")}" fill="${f}"/>`; };
  const h3=(a,b,c)=>`<rect width="30" height="20" fill="${b}"/><rect width="30" height="6.67" fill="${a}"/><rect y="13.33" width="30" height="6.67" fill="${c}"/>`;
  const v3=(a,b,c)=>`<rect width="30" height="20" fill="${b}"/><rect width="10" height="20" fill="${a}"/><rect x="20" width="10" height="20" fill="${c}"/>`;
  const uj=`<g><rect width="15" height="10" fill="#012169"/><path d="M0 0L15 10M15 0L0 10" stroke="#fff" stroke-width="2"/><path d="M0 0L15 10M15 0L0 10" stroke="#C8102E" stroke-width=".7"/><path d="M7.5 0V10M0 5H15" stroke="#fff" stroke-width="3"/><path d="M7.5 0V10M0 5H15" stroke="#C8102E" stroke-width="1.8"/></g>`;
  let usa=`<rect width="30" height="20" fill="#fff"/>`; for(let i=0;i<13;i+=2) usa+=`<rect y="${(i*20/13).toFixed(2)}" width="30" height="${(20/13).toFixed(2)}" fill="#B22234"/>`;
  usa+=`<rect width="12" height="10.77" fill="#3C3B6E"/>`; for(let y=0;y<5;y++) for(let x=0;x<6;x++) usa+=`<circle cx="${1+x*2}" cy="${1.1+y*2.1}" r=".45" fill="#fff"/>`;
  let greece=""; for(let i=0;i<9;i++) greece+=`<rect y="${(i*20/9).toFixed(2)}" width="30" height="${(20/9).toFixed(2)}" fill="${i%2?"#fff":"#0D5EAF"}"/>`;
  greece+=`<rect width="11.1" height="11.1" fill="#0D5EAF"/><rect x="4.44" width="2.22" height="11.1" fill="#fff"/><rect y="4.44" width="11.1" height="2.22" fill="#fff"/>`;
  let cook=`<rect width="30" height="20" fill="#012169"/>${uj}`; for(let i=0;i<15;i++){ const a=2*Math.PI*i/15; cook+=star(22.5+4.6*Math.cos(a),10+4.6*Math.sin(a),.8,"#fff"); }
  window.FLAGS = {
    "New Zealand": `<rect width="30" height="20" fill="#012169"/>${uj}${star(22,5,1.3,"#fff")}${star(22,5,.9,"#C8102E")}${star(19.5,10,1.4,"#fff")}${star(19.5,10,1,"#C8102E")}${star(24.8,9,1.3,"#fff")}${star(24.8,9,.9,"#C8102E")}${star(22,15.5,1.5,"#fff")}${star(22,15.5,1.1,"#C8102E")}`,
    "Australia": `<rect width="30" height="20" fill="#012169"/>${uj}${star(7.5,15.5,2.3,"#fff",7)}${star(22.5,4,1.1,"#fff",7)}${star(18.5,9,1.1,"#fff",7)}${star(26,8,1.1,"#fff",7)}${star(22.5,16.5,1.2,"#fff",7)}${star(24,11.5,.6,"#fff")}`,
    "Tonga": `<rect width="30" height="20" fill="#C10000"/><rect width="12" height="10" fill="#fff"/><rect x="5" y="1.6" width="2" height="6.8" fill="#C10000"/><rect x="2.6" y="4" width="6.8" height="2" fill="#C10000"/>`,
    "Samoa": `<rect width="30" height="20" fill="#CE1126"/><rect width="15" height="10" fill="#002B7F"/>${star(7.5,2.4,1.2,"#fff")}${star(4.6,5,1.2,"#fff")}${star(10.3,4.4,1.2,"#fff")}${star(7.5,8,1.3,"#fff")}${star(9,6.3,.7,"#fff")}`,
    "England": `<rect width="30" height="20" fill="#fff"/><rect x="13" width="4" height="20" fill="#CE1124"/><rect y="8" width="30" height="4" fill="#CE1124"/>`,
    "Fiji": `<rect width="30" height="20" fill="#68BFE5"/>${uj}<path d="M19 6h7v6.5c0 2.5-1.8 4-3.5 4.6-1.7-.6-3.5-2.1-3.5-4.6z" fill="#fff" stroke="#CE1126" stroke-width=".3"/><rect x="19" y="6" width="7" height="2.2" fill="#CE1126"/><rect x="22" y="8.2" width="1" height="8.5" fill="#CE1126"/><rect x="19" y="11" width="7" height="1" fill="#CE1126"/><rect x="20" y="6.4" width="5" height="1.2" fill="#FFD100"/>`,
    "Papua New Guinea": `<path d="M0 0H30V20z" fill="#CE1126"/><path d="M0 0V20H30z" fill="#000"/><path d="M17 4.5c2.5-1.5 6-1 7.5 1.5-1.8-.4-3.3 0-4.2 1.4 1.8.3 3.5 1.5 4.2 3.1-2-.8-4-.9-5.6-.2.6 1.2.7 2.6.2 3.7-.8-1.6-2.3-2.6-4-2.9 1.5-1.8 2.5-4.4 1.9-6.6z" fill="#FCD116"/>${star(6,10.5,1,"#fff")}${star(4,13.3,1,"#fff")}${star(8,13.6,1,"#fff")}${star(6,16.8,1,"#fff")}${star(6.9,14.8,.55,"#fff")}`,
    "Italy": v3("#009246","#fff","#CE2B37"),
    "Cook Islands": cook,
    "Lebanon": `<rect width="30" height="20" fill="#fff"/><rect width="30" height="5" fill="#ED1C24"/><rect y="15" width="30" height="5" fill="#ED1C24"/><path d="M15 5.8l3.4 4.2h-1.6l2.3 2.8h-1.9l2 2.2H10.8l2-2.2h-1.9l2.3-2.8h-1.6z" fill="#00A651"/><rect x="14.4" y="15" width="1.2" height="1.6" fill="#00A651"/>`,
    "Greece": greece,
    "Jamaica": `<rect width="30" height="20" fill="#000"/><path d="M0 0H30L15 10zM0 20H30L15 10z" fill="#009B3A"/><path d="M0 0L30 20M30 0L0 20" stroke="#FED100" stroke-width="2.6"/>`,
    "France": v3("#002395","#fff","#ED2939"),
    "Scotland": `<rect width="30" height="20" fill="#0065BD"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="3"/>`,
    "United States": usa,
    "Ireland": v3("#169B62","#fff","#FF883E"),
    "Ukraine": `<rect width="30" height="10" fill="#0057B7"/><rect y="10" width="30" height="10" fill="#FFD700"/>`,
    "Wales": `<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#00AB39"/><path d="M8 13c0-3 2-5.5 5-5.5 1.6 0 2.4-1.6 1.6-3 2 .4 3 2 2.6 3.6 2.4-.4 4.4.6 5.4 2.4-1.8-.6-3.4-.2-4.4.8 1.6.6 2.6 2 2.8 3.6h-2c-.2-1.4-1.4-2.4-2.8-2.4h-2.6l-1.6 2.4h-2l1.2-2.4c-1 .2-1.8.4-3.2.5z" fill="#D30731"/>`,
    "Argentina": `<rect width="30" height="20" fill="#74ACDF"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2" fill="#F6B40E"/><circle cx="15" cy="10" r="1.3" fill="#F6B40E" stroke="#85340A" stroke-width=".2"/>`,
    "Serbia": `${h3("#C6363C","#0C4076","#fff")}<path d="M8.2 5.8h4.6v4.4c0 1.8-1.2 2.8-2.3 3.2-1.1-.4-2.3-1.4-2.3-3.2z" fill="#C6363C" stroke="#EDB92E" stroke-width=".35"/><path d="M10.5 6.6v6M8.6 9.2h3.8" stroke="#fff" stroke-width=".8"/><path d="M8.6 5.6l.6-1.4.7.8.6-1 .6 1 .7-.8.6 1.4z" fill="#EDB92E"/>`,
    "Canada": `<rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#D52B1E"/><rect x="22.5" width="7.5" height="20" fill="#D52B1E"/><path d="M15 4.2l1.1 2.1 1.2-.6-.4 3 1.6-1.8.5 1 1.7-.3-.6 1.8.8.4-2.8 2.3.3 1-2.9-.4v2.6h-1v-2.6l-2.9.4.3-1-2.8-2.3.8-.4-.6-1.8 1.7.3.5-1 1.6 1.8-.4-3 1.2.6z" fill="#D52B1E"/>`,
    "Malta": `<rect width="15" height="20" fill="#fff"/><rect x="15" width="15" height="20" fill="#CF142B"/><path d="M3 1.8h1.6v1.4h1.4v1.6H4.6v1.4H3V4.8H1.6V3.2H3z" fill="#A0A0A0" stroke="#CF142B" stroke-width=".2"/>`,
    "Netherlands": h3("#AE1C28","#fff","#21468B")
  };
})();
