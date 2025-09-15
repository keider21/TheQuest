
(function(){
  const s=session(); if(!s){ location.href="login.html"; return; }
  const key="tq_posts"; const posts=S.get(key,[]);
  function render(){ const box=document.getElementById('pList'); box.innerHTML = posts.length? posts.map((p,i)=>`<div class="card"><div class="row"><b>${p.user}</b><span class="small">${new Date(p.t).toLocaleString()}</span></div><div style="margin:6px 0">${p.text}</div><div class="row"><button data-i="${i}" data-r="u" class="btn ghost">👍 ${p.up||0}</button><button class="btn ghost" data-i="${i}" data-r="d">👎 ${p.down||0}</button></div></div>`).join('') : "<small class='small'>Aún no hay publicaciones</small>"; }
  render();
  document.getElementById('pSend').onclick=()=>{
    const txt=document.getElementById('pTxt').value.trim(); if(!txt){ toast("Escribe algo", true); return; }
    if(/http:|https:|porno|violencia/i.test(txt)){ toast("Bloqueado por filtros", true); return; }
    posts.unshift({user:s.name||'Anon', text:txt, t:Date.now(), up:0, down:0}); S.set(key,posts); document.getElementById('pTxt').value=""; render();
  };
  document.getElementById('pList').onclick=(e)=>{ const b=e.target.closest('button'); if(!b)return; const i=Number(b.dataset.i), r=b.dataset.r; if(r==='u') posts[i].up=(posts[i].up||0)+1; else posts[i].down=(posts[i].down||0)+1; S.set(key,posts); render(); };
})();