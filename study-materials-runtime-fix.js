/* PrinceXmahto Study Materials — runtime fallback / loader repair */
(()=>{
'use strict';
const D=window.PX_STUDY_DATA;
if(!D?.years?.[0]) return;
const year=D.years[0], content=document.querySelector('#content'), tree=document.querySelector('#sideTree'), crumbs=document.querySelector('#breadcrumbs');
if(!content||!tree) return;

/* Keep the hero visible even if an older stylesheet/renderer left reveal states behind. */
document.querySelectorAll('.sm-hero,.hero-copy,.hero-panel').forEach(el=>{el.style.visibility='visible';el.style.opacity='1';el.style.transform='none'});

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const params=()=>new URLSearchParams(location.search);
const branchBy=id=>year.branches.find(b=>b.id===id)||year.branches[0];
const subjects=b=>(b.semesters||[]).flatMap(s=>(s.subjects||[]).map(x=>({...x,semester:s})));
const subjectBy=(b,id)=>subjects(b).find(s=>s.id===id);
const unitBy=(s,id)=>s?.units?.find(u=>u.id===id);
const topics=u=>u?.topics||[];
const topicBy=(u,id)=>topics(u).find(t=>t.id===id);
const q=()=>params();
const go=o=>{const u=new URL(location.href);Object.entries(o).forEach(([k,v])=>v?u.searchParams.set(k,v):u.searchParams.delete(k));location.href=u.toString()};
const subjectHref=(b,s)=>`/study-materials-subject.html?branch=${encodeURIComponent(b.id)}&semester=${encodeURIComponent(s.semester?.id||'sem1')}&subject=${encodeURIComponent(s.id)}`;
const topicHref=(b,s,u,t)=>`/study-materials-topic.html?branch=${encodeURIComponent(b.id)}&semester=${encodeURIComponent(s.semester?.id||'sem1')}&subject=${encodeURIComponent(s.id)}&unit=${encodeURIComponent(u.id)}&topic=${encodeURIComponent(t.id)}`;

function tree(b,active){
 tree.innerHTML=`<div class="tree-group-label">BRANCHES · SBTE 2026</div>`+
 year.branches.map(x=>`<button class="tree-btn ${x.id===b.id?'active':''}" data-b="${esc(x.id)}"><span>${esc(x.title)}</span><span>›</span></button>`).join('')+
 `<div class="tree-group-label">${esc(b.title)} · SEMESTER I</div>`+
 subjects(b).map(s=>`<button class="tree-btn ${s.id===active?'active':''}" data-s="${esc(s.id)}"><span>${esc(s.title)}</span><small>${esc(s.code)}</small></button>`).join('');
 tree.querySelectorAll('[data-b]').forEach(el=>el.onclick=()=>go({branch:el.dataset.b,semester:'sem1',subject:'',unit:'',topic:''}));
 tree.querySelectorAll('[data-s]').forEach(el=>{const s=subjectBy(b,el.dataset.s);if(s)el.onclick=()=>location.href=subjectHref(b,s)});
}
function crumb(items){if(!crumbs)return;crumbs.innerHTML=items.map((x,i)=>i===items.length-1?`<b>${esc(x)}</b>`:`<a href="#">${esc(x)}</a><span>/</span>`).join('')}
function emptyOrOld(){return /Opening (2026 catalogue|subject|lesson)/i.test(content.textContent||'')||!tree.textContent.trim()}
function subjectCard(b,s){const count=subjects(b).find(x=>x.id===s.id)?.units?.reduce((n,u)=>n+(u.topics?.length||0),0)||0;return `<a class="subject-card" href="${subjectHref(b,s)}"><span>${esc(s.code||'COURSE')}</span><h2>${esc(s.title)}</h2><p>${s.units?.length||0} units · ${count} topics</p><b>OPEN SUBJECT ↗</b></a>`}
function renderCatalog(){
 const ps=q(), b=branchBy(ps.get('branch'));
 tree.innerHTML='';
 content.innerHTML=`<div class="section-head"><div><div class="section-kicker">SBTE BIHAR · ADMISSION SESSION 2026</div><h1>Choose your branch.</h1><p class="content-lead">Select a branch to see only the subjects listed in its 2026 Semester-I syllabus.</p></div></div><div class="branch-grid">${year.branches.map(x=>`<button class="branch-card" data-open="${esc(x.id)}"><span>${esc(x.code)}</span><strong>${esc(x.title)}</strong><p>${subjects(x).length} subjects · Semester I</p><b>VIEW SUBJECTS →</b></button>`).join('')}</div>`;
 content.querySelectorAll('[data-open]').forEach(el=>el.onclick=()=>go({branch:el.dataset.open,semester:'sem1',subject:'',unit:'',topic:''}));
 tree.innerHTML=`<div class="tree-group-label">BRANCHES · SBTE 2026</div>`+year.branches.map(x=>`<button class="tree-btn ${x.id===b.id?'active':''}" data-b="${esc(x.id)}"><span>${esc(x.title)}</span><span>›</span></button>`).join('');
 tree.querySelectorAll('[data-b]').forEach(el=>el.onclick=()=>go({branch:el.dataset.b,semester:'sem1',subject:'',unit:'',topic:''}));
 crumb(['Admission Session 2026','Branches']);
}
function renderBranch(){
 const b=branchBy(q().get('branch'));
 tree(b,'');
 content.innerHTML=`<div class="section-head"><div><div class="section-kicker">BRANCH · ${esc(b.code)}</div><h1>${esc(b.title)}</h1><p class="content-lead">Semester-I subjects from the supplied SBTE 2026 curriculum.</p></div></div><div class="subject-grid">${subjects(b).map(s=>subjectCard(b,s)).join('')}</div>`;
 crumb(['Admission Session 2026',b.title]);
}
function renderSubject(){
 const ps=q(),b=branchBy(ps.get('branch')),s=subjectBy(b,ps.get('subject'));
 if(!s){renderBranch();return}
 tree(b,s.id);
 const total=s.units.reduce((n,u)=>n+(u.topics?.length||0),0);
 content.innerHTML=`<div class="subject-hero"><div><div class="section-kicker">${esc(s.code)} · SEMESTER I</div><h1>${esc(s.title)}</h1><p>${s.units.length} units · ${total} topics</p></div><button class="action-btn primary" onclick="window.print()">PRINT / PDF</button></div><div class="unit-grid">${s.units.map(u=>`<section class="unit-card"><span>${esc(u.id.toUpperCase())}</span><h2>${esc(u.title)}</h2><div class="unit-topics">${topics(u).map(t=>`<a href="${topicHref(b,s,u,t)}"><span>${esc(t.id||'')}</span><b>${esc(t.title||t)}</b><span>↗</span></a>`).join('')}</div></section>`).join('')}</div>`;
 crumb(['Admission Session 2026',b.title,s.title]);
}
function renderTopic(){
 const ps=q(),b=branchBy(ps.get('branch')),s=subjectBy(b,ps.get('subject')),u=unitBy(s,ps.get('unit')),t=topicBy(u,ps.get('topic'));
 if(!s||!u||!t){renderSubject();return}
 tree(b,s.id);
 content.innerHTML=`<article class="notes"><div class="section-kicker">${esc(s.code)} · ${esc(u.title)}</div><h1>${esc(t.title)}</h1><div class="definition"><b>TOPIC</b><p>Detailed notes for this syllabus topic are being organized topic-by-topic. Use the subject page to move between units and topics.</p></div><h2>What you need to learn</h2><p>This lesson follows the exact topic title from the selected SBTE 2026 subject structure. Add the detailed explanation, formulas, diagrams and exam practice here without mixing another branch's syllabus.</p><div class="exam-box"><b>EXAM PRACTICE</b><ol><li>Define and explain ${esc(t.title)}.</li><li>Write the important points/principle involved.</li><li>Draw a suitable labelled diagram where applicable.</li></ol></div></article>`;
 crumb(['Admission Session 2026',b.title,s.title,u.title,t.title]);
}
function run(){
 const path=location.pathname, ps=q(), hasSubject=ps.get('subject'), hasTopic=ps.get('topic'), hasBranch=ps.get('branch');
 if(path.endsWith('study-materials-topic.html')) renderTopic();
 else if(path.endsWith('study-materials-subject.html')) renderSubject();
 else if(hasSubject) renderSubject();
 else if(hasBranch) renderBranch();
 else renderCatalog();
}
/* The existing renderer can work normally; only take over when it left the page in its initial loading state. */
if(emptyOrOld() || location.pathname.endsWith('study-materials.html')) run();
})();
