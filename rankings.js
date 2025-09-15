
(function(){
  const sample=S.get("tq_rank_demo",null)||(function(){const a=[]; for(let i=0;i<20;i++){a.push({name:"Player"+(i+1),coins:Math.floor(Math.random()*50000)+1000,active:Math.floor(Math.random()*100)});} S.set("tq_rank_demo",a); return a;})();
  function table(items){ return `<table><thead><tr><th>#</th><th>Jugador</th><th>Coins</th></tr></thead><tbody>${items.map((p,i)=>`<tr><td>${i+1}</td><td>${p.name}</td><td>${fmt(p.coins)}</td></tr>`).join('')}</tbody></table>`; }
  document.getElementById('rank1').innerHTML=table([...sample].sort((a,b)=>b.coins-a.coins).slice(0,10));
  document.getElementById('rank2').innerHTML=`<table><thead><tr><th>#</th><th>Jugador</th><th>Actividad</th></tr></thead><tbody>${[...sample].sort((a,b)=>b.active-a.active).slice(0,10).map((p,i)=>`<tr><td>${i+1}</td><td>${p.name}</td><td>${p.active}</td></tr>`).join('')}</tbody></table>`;
  const clans=Array.from({length:10}).map((_,i)=>({name:"Clan "+(i+1),reserve:Math.floor(Math.random()*100000)}));
  document.getElementById('rank3').innerHTML = `<table><thead><tr><th>#</th><th>Clan</th><th>Reserva</th></tr></thead><tbody>${clans.sort((a,b)=>b.reserve-a.reserve).map((c,i)=>`<tr><td>${i+1}</td><td>${c.name}</td><td>${fmt(c.reserve)}</td></tr>`).join('')}</tbody></table>`;
  const tabs=[["rt1","rank1"],["rt2","rank2"],["rt3","rank3"]];
  tabs.forEach(([t,b])=>{document.getElementById(t).onclick=()=>{tabs.forEach(([tt,bb])=>{document.getElementById(tt).classList.remove('active');document.getElementById(bb).style.display='none'});document.getElementById(t).classList.add('active');document.getElementById(b).style.display='block'}});
})();