/* PrinceXmahto — final subject renderer */
(()=>{
'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=$('#content'),T=$('#sideTree'),B=$('#breadcrumbs');
if(!C||!T||!B)return;
function boot(){
 const D=window.PX_STUDY_DATA,Y=D?.years?.[0]; if(!Y){C.innerHTML='<div class="empty"><h3>Subject could not load.</h3><p>Study data is unavailable.</p></div>';return;}
 const P=new URLSearchParams(location.search),branches=Y.branches||[],b=branches.find(x=>x.id===P.get('branch'))||branches[0];
 const subjects=x=>(x.semesters||[]).flatMap(sm=>(sm.subjects||[]).map(s=>({...s,semester:sm})));
 const list=subjects(b),s=list.find(x=>x.id===P.get('subject'))||list[0];
 if(!s){C.innerHTML='<div class="empty"><h3>No subject found.</h3><p>Choose a subject from the catalogue.</p></div>';return;}
 const units=s.units||[];
 T.innerHTML='<div class="tree-group-label">BRANCHES · SBTE 2026</div>'+branches.map(x=>`<a class="tree-btn ${x.id===b.id?'active':''}" href="/study-materials.html?branch=${encodeURIComponent(x.id)}"><span>${esc(x.title)}</span><span>›</span></a>`).join('')+'<div class="tree-group-label">'+esc(b.title)+' · SEMESTER I</div>'+list.map(x=>`<a class="tree-btn ${x.id===s.id?'active':''}" href="/study-materials-subject.html?branch=${encodeURIComponent(b.id)}&semester=sem1&subject=${encodeURIComponent(x.id)}"><span>${esc(x.title)}</span><small>${esc(x.code||'')}</small></a>`).join('');
 B.innerHTML=`<a href="/study-materials.html">Admission Session 2026</a><span>/</span><a href="/study-materials.html?branch=${encodeURIComponent(b.id)}">${esc(b.title)}</a><span>/</span><b>${esc(s.title)}</b>`;
 const count=units.reduce((n,u)=>n+(u.topics?.length||0),0);
 C.innerHTML=`<div class="section-head"><div><div class="section-kicker">${esc(b.code)} · ${esc(s.code||'COURSE')} · SEMESTER I</div><h1>${esc(s.title)}</h1><p class="content-lead">SBTE Bihar Admission Session 2026 · complete unit-wise topic roadmap.</p></div><div class="subject-stat"><strong>${units.length}</strong><span>UNITS</span><strong>${count}</strong><span>TOPICS</span></div></div><div class="subject-actions"><button class="action-btn primary" id="printSubject">PRINT / SAVE PDF ↗</button><a class="action-btn" href="/study-materials.html?branch=${encodeURIComponent(b.id)}">BACK TO ${esc(b.code)} ↗</a></div><div class="unit-list">${units.map((u,i)=>`<section class="unit-card"><div class="unit-head"><div><span>UNIT ${String(i+1).padStart(2,'0')}</span><h2>${esc(u.title)}</h2></div><small>${u.topics?.length||0} topics</small></div><div class="topic-grid">${(u.topics||[]).map((t,j)=>`<a class="topic-card" href="/study-materials-topic.html?branch=${encodeURIComponent(b.id)}&semester=sem1&subject=${encodeURIComponent(s.id)}&unit=${encodeURIComponent(u.id)}&topic=${encodeURIComponent(t.id)}"><span>${String(i+1).padStart(2,'0')}.${String(j+1).padStart(2,'0')}</span><h3>${esc(t.title)}</h3><b>OPEN LESSON ↗</b></a>`).join('')}</div></section>`).join('')}</div>`;
 const p=$('#printSubject');if(p)p.onclick=()=>window.print();
}
if(window.PX_STUDY_DATA)boot();else window.addEventListener('load',boot,{once:true});
})();
