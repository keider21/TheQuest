
(function(){
  const s=requireSession();
  const key="tq_polls"; const polls=S.get(key,null)||(function(){const p=[{id:"p1",q:"¿Qué área expandimos primero?",opts:["Ciudad Central","Forja de Herreros","Granjas"],votes:[0,0,0],open:true}]; S.set(key,p); return p;})();
  const u=loadUser()||Object.values(S.get("tq_users",{})).find(x=>x.userId===s.userId);
  function total(p){return p.votes.reduce((a,b)=>a+b,0)}
  function render(){ const box=document.getElementById('plist'); box.innerHTML = polls.map(p=>`<div class="card"><b>${p.q}</b>${p.opts.map((o,idx)=>`
      <div class="row" style="margin-top:8px">
        <button class="btn ghost" data-id="${p.id}" data-opt="${idx}" ${p.open?'':'disabled'}>Votar (1000)</button>
        <div class="progress" style="flex:1"><span style="width:${total(p)>0?(p.votes[idx]/total(p)*100):0}%"></span></div>
        <small style="width:60px;text-align:right">${(p.votes[idx])}</small>
      </div>`).join('')}<small>Estado: ${p.open?'Abierta':'Cerrada'}</small></div>`).join(''); }
  render();
  document.getElementById('plist').onclick=(e)=>{
    const b=e.target.closest('button[data-id]'); if(!b) return;
    const id=b.dataset.id, opt=Number(b.dataset.opt); const p=polls.find(x=>x.id===id); if(!p||!p.open) return;
    const uu=loadUser()||u; if((uu.coins||0)<1000){ toast("Coins insuficientes", true); return; }
    uu.coins-=1000; saveUser(uu); p.votes[opt]++; S.set(key,polls); toast("Voto registrado"); render();
  };
})();