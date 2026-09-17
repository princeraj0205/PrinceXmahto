/* PrinceXmahto Study Materials — standalone subject catalogue renderer */
(()=>{
'use strict';
const $=s=>document.querySelector(s),esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=$('#content'),T=$('#sideTree'),B=$('#breadcrumbs');
if(!C||!T)return;
function boot(){
 const D=window.PX_STUDY_DATA,Y=D?.years?.[0];
 if(!Y){C.innerHTML='<div class="empty"><h3>Subject could not load.</h3><p>Catalogue data is unavailable. Please refresh once.</p></div>';return;}
 const P=new URLSearchParams(location.search),bid=P.get('branch')||'cse',sid=P.get('subject')||'';
 const branches=Y.branches||[],b=branches.find(x=>x.id===bid)||branches[0];
 const subjects=(b?.semesters||[]).flatMap(s=>(s.subjects||[]).map(x=>({...x,semester:s})));
 const s=subjects.find(x=>x.id===sid)||subjects[0];
 if(!b||!s){C.innerHTML='<div class="empty"><h3>Subject not found.</h3><p>Return to the catalogue and choose a subject.</p><a class="action" href="/study-materials.html">OPEN CATALOGUE →</a></div>';return;}
 const semester=s.semester?.id||'sem1';
 const units=s.units||[];
 const topicCount=units.reduce((n,u)=>n+(u.topics?.length||0),0);
 const topicTitle=t=>typeof t==='string'?t:t?.title||'Topic';
 const topicId=(u,t,i)=>typeof t==='string'?encodeURIComponent(t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')):encodeURIComponent(t.id||`${u.id}-t${i+1}`);
 const topicHref=(u,t,i)=>`/study-materials-topic.html?branch=${encodeURIComponent(b.id)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(s.id)}&unit=${encodeURIComponent(u.id)}&topic=${topicId(u,t,i)}`;
 T.innerHTML='<div class="tree-group-label">BRANCH · SBTE 2026</div>'+branches.map(x=>`<a class="tree-btn ${x.id===b.id?'active':''}" href="/study-materials.html?branch=${encodeURIComponent(x.id)}"><span>${esc(x.title)}</span><span>›</span></a>`).join('')+`<div class="tree-group-label">${esc(s.title)} · ${units.length} UNITS</div>`+units.map(u=>`<div class="tree-sub"><div class="tree-unit-label">${esc(u.title)}</div>${(u.topics||[]).map((t,i)=>`<a class="tree-topic" href="${topicHref(u,t,i)}">${esc(topicTitle(t))}</a>`).join('')}</div>`).join('');
 B.innerHTML=`<a href="/study-materials.html">Admission Session 2026</a><span>/</span><a href="/study-materials.html?branch=${encodeURIComponent(b.id)}">${esc(b.title)}</a><span>/</span><b>${esc(s.title)}</b>`;
 C.innerHTML=`<div class="section-head"><div><div class="section-kicker">${esc(b.code)} · ${esc(s.code||'COURSE')} · SEMESTER I</div><h1>${esc(s.title)}</h1><p class="content-lead">Complete subject index for the supplied SBTE Bihar 2026 Semester-I curriculum. Open any topic for its lesson page, notes, examples and exam practice.</p></div><div class="subject-stat"><strong>${units.length}</strong><span>UNITS</span><strong>${topicCount}</strong><span>TOPICS</span></div></div>${units.map((u,ui)=>`<section class="unit-card"><div class="unit-head"><span>UNIT ${ui+1}</span><h2>${esc(u.title)}</h2><small>${u.topics?.length||0} topics</small></div><div class="topic-grid">${(u.topics||[]).map((t,i)=>`<a class="topic-card" href="${topicHref(u,t,i)}"><span>${String(ui+1).padStart(2,'0')}.${String(i+1).padStart(2,'0')}</span><h3>${esc(topicTitle(t))}</h3><b>OPEN LESSON ↗</b></a>`).join('')}</div></section>`).join('')}`;
}
if(window.PX_STUDY_DATA)boot();else window.addEventListener('load',boot,{once:true});
})();
