// Small interaction layer: reveal sections as they enter the viewport.
const items = document.querySelectorAll(".featured-card,.project-card,.road-item,.contact");
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("visible"); observer.unobserve(e.target); }});
},{threshold:.08});
items.forEach((el,i)=>{el.classList.add("reveal"); el.style.transitionDelay=`${Math.min(i*45,180)}ms`; observer.observe(el);});
