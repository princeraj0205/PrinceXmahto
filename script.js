document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.menu');
  const nav=document.querySelector('.nav-links');
  if(menu&&nav){const closeMenu=()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')};menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menu.contains(e.target))closeMenu()});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()})}
  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>18);updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
  const reveals=document.querySelectorAll('.reveal');if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('show');observer.unobserve(entry.target)}}),{threshold:.08});reveals.forEach(el=>observer.observe(el))}else reveals.forEach(el=>el.classList.add('show'));
  const visual=document.querySelector('.hero-visual'),core=document.querySelector('.visual-core'),motionOK=window.matchMedia('(prefers-reduced-motion: no-preference)').matches;if(visual&&core&&motionOK&&window.matchMedia('(pointer:fine)').matches){let raf=0;visual.addEventListener('pointermove',e=>{const r=visual.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{visual.style.transform=`rotateX(${-y*2.8}deg) rotateY(${x*3.2}deg)`;core.style.setProperty('--rx',`${-y*7}deg`);core.style.setProperty('--ry',`${x*9}deg`)})});visual.addEventListener('pointerleave',()=>{visual.style.transform='rotateX(0deg) rotateY(0deg)';core.style.setProperty('--rx','0deg');core.style.setProperty('--ry','0deg')})}
  if(window.PX_SUPABASE_URL&&!document.querySelector('script[data-px-auth]')){const s=document.createElement('script');s.src='auth.js?v=20260917-1';s.dataset.pxAuth='1';document.body.appendChild(s)}
});

/* PrinceXmahto visitor analytics — anonymous by default, admin can inspect server-side events. */
(function(){
  const ENDPOINT='https://dvoioacvqrujywwqqygo.supabase.co/functions/v1/track-visitor';
  const KEY='sb_publishable_XJ-KHZyM2H9-ADJudvRKlw_9Mr17W1J';
  const SID_KEY='pxm_visitor_session';
  let sid='';
  try{sid=localStorage.getItem(SID_KEY)||crypto.randomUUID();localStorage.setItem(SID_KEY,sid)}catch(e){sid=crypto.randomUUID?.()||String(Date.now())}
  function token(){
    try{
      for(let i=0;i<localStorage.length;i++){
        const k=localStorage.key(i)||'';
        if(k.startsWith('sb-')&&k.endsWith('-auth-token')){
          const o=JSON.parse(localStorage.getItem(k)||'{}');
          if(o.access_token)return o.access_token;
        }
      }
    }catch(e){}
    return '';
  }
  function track(type,meta){
    const h={apikey:KEY,'Content-Type':'application/json'};
    const t=token(); if(t)h.Authorization='Bearer '+t;
    const body=JSON.stringify({session_id:sid,event_type:type,page_path:location.pathname+location.search,target:meta?.target||null,metadata:{...(meta||{}),title:document.title}});
    try{fetch(ENDPOINT,{method:'POST',keepalive:true,headers:h,body}).catch(()=>{})}catch(e){}
  }
  track('page_view',{referrer:document.referrer||null});
  document.addEventListener('click',e=>{
    const el=e.target.closest('a,button,[role="button"]');
    if(!el)return;
    track('click',{target:(el.innerText||el.getAttribute('aria-label')||el.getAttribute('title')||'').trim().slice(0,200),href:el.href||null});
  },{passive:true});
  addEventListener('pagehide',()=>track('page_exit',{duration_seconds:Math.round(performance.now()/1000)}));
})();
