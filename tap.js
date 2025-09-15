
(function(){
  const s = requireSession();
  // hydrate user (mirror to per-user key)
  const users=S.get("tq_users",{});
  const u = Object.values(users).find(x=>x.userId===s.userId);
  if(!u){ location.href="login.html"; return; }
  S.set('tq_user_'+s.userId, u);
  const el = (id)=>document.getElementById(id);
  el('uname').textContent = u.name;
  function ensureDaily(){
    const today=new Date().toDateString();
    if(u.tapsDate!==today){ u.tapsDate=today; u.tapsToday=0; save(); }
  }
  function update(){
    el('bal').textContent = u.coins||0;
    el('tapCount').textContent = u.tapsToday||0;
    el('bar').style.width = Math.min(100, ((u.coins||0)/2000)*100)+'%';
    el('wAmount').value = u.coins||0;
  }
  function save(){ S.set('tq_user_'+s.userId, u); users[u.name]=u; S.set("tq_users",users); }

  // tabs
  const tabs=[['t1','box1'],['t2','box2'],['t3','box3'],['t4','box4'],['t5','box5']];
  tabs.forEach(([t,b])=>{ el(t).onclick=()=>{ tabs.forEach(([tt,bb])=>{ document.getElementById(tt).classList.remove('active'); document.getElementById(bb).style.display='none';}); el(t).classList.add('active'); el(b).style.display='grid'; }; });

  // tap
  let last=0, burst=0;
  el('tapBtn').onclick=()=>{
    const t=Date.now(); if(t-last<90){ if(++burst>10){ toast("Muy rápido: bloqueado 3s", true); const b=el('tapBtn'); b.disabled=true; setTimeout(()=>{b.disabled=false; burst=0;},3000); return; } }
    last=t; ensureDaily(); if((u.tapsToday||0)>=3000){ toast("Llegaste al tope diario", true); return; }
    u.tapsToday=(u.tapsToday||0)+1; u.coins=(u.coins||0)+1; save(); update();
  };

  // ad
  el('adBtn').onclick=async()=>{
    const cd=30000-(Date.now()-(u.lastAdAt||0)); if(cd>0){ toast("Espera "+Math.ceil(cd/1000)+"s", true); return; }
    const btn=el('adBtn'); btn.disabled=true; btn.textContent="Anuncio (5s)";
    await new Promise(r=>setTimeout(r,5000));
    u.lastAdAt=Date.now(); u.coins=(u.coins||0)+100; save(); update(); btn.disabled=false; btn.textContent="🎁 Ver anuncio recompensado (+100)"; toast("+100 coins");
    // referral pending credit
    if(u.inviterId){ const pend=S.get("tq_ref_pending",{}); pend[u.inviterId]=(pend[u.inviterId]||0)+150; S.set("tq_ref_pending",pend); }
  };

  // daily bonus
  function renderDaily(){ const can=(Date.now()-(u.lastDaily||0))>=86400000; el('dailyBtn').disabled=!can; el('dailyInfo').textContent = can ? "Disponible" : "Disponible en 24h desde tu último cobro"; }
  renderDaily();
  el('dailyBtn').onclick=()=>{ if((Date.now()-(u.lastDaily||0))<86400000) return; u.lastDaily=Date.now(); u.coins=(u.coins||0)+1000; save(); update(); renderDaily(); toast("Bono +1000"); };

  // withdrawals
  function renderW(){ const all=S.get("tq_withdrawals",{}); const mine=(all[u.userId]||[]); const box=el('wList'); box.innerHTML = mine.length? mine.map(w=>`<div class="badge">[${w.t}] ${w.amount} — <b>${w.state}</b></div>`).join('') : "<span class='small'>No hay solicitudes</span>"; }
  renderW();
  el('wSend').onclick=()=>{ const email=el('wEmail').value.trim(), amt=Number(el('wAmount').value); if(!email || !(amt>0)){ toast("Datos inválidos", true); return; } if((u.coins||0)<2000){ toast("Mínimo 2000", true); return; } const all=S.get("tq_withdrawals",{}); const mine=(all[u.userId]||[]); if(mine.some(w=>w.state==='Pendiente')){{ toast("Ya tienes una solicitud pendiente", true); return; }} mine.unshift({t:new Date().toLocaleString(), amount:amt, state:"Pendiente"}); all[u.userId]=mine; S.set("tq_withdrawals",all); renderW(); toast("Solicitud enviada"); };

  // invite link
  const refLink = location.origin ? `${location.origin}${location.pathname.replace(/[^\/]+$/, '')}register.html?ref=${u.userId}` : `register.html?ref=${u.userId}`;
  el('refLink').value = refLink; el('copyRef').onclick=async()=>{ try{ await navigator.clipboard.writeText(refLink); toast("Copiado"); }catch{{ toast("Copia manual: "+refLink); }} }

  // credit inviter pending to user on load
  const pend=S.get("tq_ref_pending",{}); const add=pend[u.userId]||0; if(add>0){ u.coins=(u.coins||0)+add; save(); update(); delete pend[u.userId]; S.set("tq_ref_pending",pend); }

  update();
})();
