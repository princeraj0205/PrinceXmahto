/* PrinceXmahto Study Materials — standalone catalogue renderer */
(()=>{
'use strict';
const $=s=>document.querySelector(s), esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=$('#content'),T=$('#sideTree'),B=$('#breadcrumbs'),Q=$('#globalSearch');
if(!C||!T)return;
function boot(){
 const D=window.PX_STUDY_DATA;
 if(!D?.years?.[0]){C.innerHTML='<div class="empty"><h3>Study Materials could not load.</h3><p>Catalogue data is unavailable. Please refresh once.</p></div>';return;}
 const Y=D.years[0], branches=Y.branches||[];
 const subjects=b=>(b.semesters||[]).flatMap(s=>(s.subjects||[]).map(x=>({...x,semester:s})));
 const total=s=>(s.units||[]).reduce((n,u)=>n+(u.topics?.length||0),0);
 const go=(o={})=>{const u=new URL(location.href);u.search='';Object.entries(o).forEach(([k,v])=>v&&u.searchParams.set(k,v));location.href=u.toString()};
 const branch=id=>branches.find(b=>b.id===id)||branches[0];
 function side(b){
   T.innerHTML='<div class="tree-group-label">BRANCHES · SBTE 2026</div>'+branches.map(x=>`<button class="tree-btn ${x.id===b.id?'active':''}" data-b="${esc(x.id)}"><span>${esc(x.title)}</span><span>›</span></button>`).join('');
   T.querySelectorAll('[data-b]').forEach(x=>x.onclick=()=>go({branch:x.dataset.b}));
 }
 function crumbs(a){B.innerHTML=a.map((x,i)=>i===a.length-1?`<b>${esc(x)}</b>`:`<span>${esc(x)}</span><i>/</i>`).join('')}
 function catalog(){
   side(branch());
   C.innerHTML=`<div class="section-head"><div><div class="section-kicker">SBTE BIHAR · ADMISSION SESSION 2026</div><h1>Choose your branch.</h1><p class="content-lead">Select a branch to see only the subjects listed in its 2026 Semester-I syllabus.</p></div></div><div class="branch-grid">${branches.map(b=>`<button class="branch-card" data-open="${esc(b.id)}"><span>${esc(b.code)}</span><strong>${esc(b.title)}</strong><p>${subjects(b).length} subjects · Semester I</p><b>VIEW SUBJECTS →</b></button>`).join('')}</div>`;
   C.querySelectorAll('[data-open]').forEach(x=>x.onclick=()=>go({branch:x.dataset.open}));
   crumbs(['Admission Session 2026','Branches']);
 }
 function branchPage(b){
   side(b);
   C.innerHTML=`<div class="section-head"><div><div class="section-kicker">BRANCH · ${esc(b.code)}</div><h1>${esc(b.title)}</h1><p class="content-lead">Semester-I subjects from the supplied SBTE 2026 curriculum.</p></div></div><div class="subject-grid">${subjects(b).map(s=>`<a class="subject-card" href="/study-materials-subject.html?branch=${encodeURIComponent(b.id)}&semester=${encodeURIComponent(s.semester?.id||'sem1')}&subject=${encodeURIComponent(s.id)}"><span>${esc(s.code||'COURSE')}</span><h2>${esc(s.title)}</h2><p>${s.units?.length||0} units · ${total(s)} topics</p><b>OPEN SUBJECT ↗</b></a>`).join('')}</div>`;
   crumbs(['Admission Session 2026',b.title]);
 }
 function render(){
   const p=new URLSearchParams(location.search), b=branch(p.get('branch'));
   if(p.get('branch')) branchPage(b); else catalog();
   if(Q){Q.onkeydown=e=>{if(e.key==='Enter'){const q=Q.value.trim().toLowerCase();if(!q)return;const hit=branches.flatMap(b=>subjects(b).map(s=>({b,s}))).find(x=>(x.s.title+' '+x.s.code+' '+x.b.title).toLowerCase().includes(q));if(hit)location.href=`/study-materials-subject.html?branch=${encodeURIComponent(hit.b.id)}&semester=sem1&subject=${encodeURIComponent(hit.s.id)}`;}};}
 }
 render();
}
/* Run after the data scripts; no dependency on the old pro renderer. */
if(window.PX_STUDY_DATA)boot();else window.addEventListener('load',boot,{once:true});
})();
