
const S={get:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),del:(k)=>localStorage.removeItem(k)};
const fmt=(n)=> new Intl.NumberFormat().format(n);
function toast(msg, isErr=false, ms=2200){const t=document.getElementById('toast'); if(!t)return; t.textContent=msg; t.className='toast'+(isErr?' err':''); t.style.display='block'; clearTimeout(toast._t); toast._t=setTimeout(()=>t.style.display='none',ms);}
function navActive(){ const here=location.pathname.split('/').pop()||'index.html'; document.querySelectorAll('.nav a').forEach(a=>a.classList.toggle('active', a.getAttribute('href')===here)); const y=document.getElementById('y'); if(y) y.textContent=new Date().getFullYear(); }
function session(){ return S.get('tq_session', null); }
function requireSession(redirect='login.html'){ const s=session(); if(!s||!s.userId){ location.href = redirect; } return s; }
function userKey(){ const s=session(); return s?('tq_user_'+s.userId):null; }
function loadUser(){ return S.get(userKey(), null); }
function saveUser(u){ S.set(userKey(), u); }

// Referral capture from ?ref=
(function(){ const p=new URLSearchParams(location.search); const r=p.get('ref'); if(r) S.set('tq_last_ref', r); })();

document.addEventListener('DOMContentLoaded', navActive);
