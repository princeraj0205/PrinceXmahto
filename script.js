document.addEventListener('DOMContentLoaded',()=>{
  const header=document.querySelector('.site-header');
  const menu=document.querySelector('.menu');
  const nav=document.querySelector('.nav-links');

  if(menu&&nav){
    menu.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-controls','site-navigation');
    if(nav.id!=='site-navigation') nav.id='site-navigation';

    const closeMenu=()=>{
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded','false');
    };

    menu.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      menu.setAttribute('aria-expanded',String(open));
    });

    nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));

    document.addEventListener('click',event=>{
      if(nav.classList.contains('open')&&!nav.contains(event.target)&&!menu.contains(event.target)) closeMenu();
    });

    document.addEventListener('keydown',event=>{
      if(event.key==='Escape') closeMenu();
    });
  }

  const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>20);
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.08});
    reveals.forEach(el=>observer.observe(el));
  }else reveals.forEach(el=>el.classList.add('show'));
});
