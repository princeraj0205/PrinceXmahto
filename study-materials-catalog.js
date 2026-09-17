/* PrinceXmahto Study Materials — robust standalone catalogue renderer */
(()=>{
  'use strict';
  const $=s=>document.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const C=$('#content'),T=$('#sideTree'),B=$('#breadcrumbs'),Q=$('#globalSearch');
  if(!C||!T)return;
  const data=()=>window.PX_STUDY_DATA||null;
  const year=()=>data()?.years?.find(y=>y.id==='2026')||data()?.years?.[0]||null;
  const branches=()=>year()?.branches||[];
  const subjects=b=>(b?.semesters||[]).flatMap(sem=>(sem.subjects||[]).map(sub=>({...sub,semester:sem})));
  const topics=s=>(s?.units||[]).reduce((n,u)=>n+(u.topics||[]).length,0);
  const go=params=>{const u=new URL(location.href);u.search='';Object.entries(params||{}).forEach(([k,v])=>{if(v)u.searchParams.set(k,v)});location.href=u.toString()};
  function crumbs(items){if(B)B.innerHTML=items.map((x,i)=>i===items.length-1?`<b>${esc(x)}</b>`:`<span>${esc(x)}</span><i>/</i>`).join('')}
  function side(active){T.innerHTML='<div class="tree-group-label">BRANCHES · SBTE 2026</div>'+branches().map(b=>`<button type="button" class="tree-btn ${b.id===active?'active':''}" data-branch="${esc(b.id)}"><span>${esc(b.title)}</span><span>›</span></button>`).join('');T.querySelectorAll('[data-branch]').forEach(x=>x.addEventListener('click',()=>go({branch:x.dataset.branch})))}
  function home(){
    side('');
    C.innerHTML=`<div class="section-head"><div><div class="section-kicker">SBTE BIHAR · ADMISSION SESSION 2026</div><h1>Choose your branch.</h1><p class="content-lead">Select your diploma branch to open Semester-I subjects and syllabus.</p></div></div><div class="branch-grid">${branches().map(b=>`<button type="button" class="branch-card" data-open="${esc(b.id)}"><span>${esc(b.code||'')}</span><strong>${esc(b.title)}</strong><p>${subjects(b).length} subjects · Semester I</p><b>VIEW SYLLABUS →</b></button>`).join('')}</div>`;
    C.querySelectorAll('[data-open]').forEach(x=>x.addEventListener('click',()=>go({branch:x.dataset.open})));
    crumbs(['Admission Session 2026','Branches']);
  }
  function syllabus(b){
    const meta=window.PX_BRANCH_SYLLABUS?.[b.id];
    if(!meta?.courses?.length)return '';
    const rows=meta.courses.map((r,i)=>`<tr><td>${i+1}</td><td class="syllabus-code">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
    return `<section class="syllabus-box" id="branch-syllabus"><div class="syllabus-top"><div><div class="syllabus-kicker">OFFICIAL SYLLABUS REFERENCE · SBTE BIHAR · ADMISSION SESSION 2026</div><h2>${esc(b.title)} · Semester I</h2><p class="syllabus-source">${esc(meta.source||'Uploaded SBTE Bihar 2026 curriculum PDF')}</p></div><div class="syllabus-actions"><button type="button" id="printSyllabus">PRINT / SAVE PDF ↗</button></div></div><table class="syllabus-table"><thead><tr><th>#</th><th>COURSE CODE</th><th>CATEGORY</th><th>COURSE TITLE</th></tr></thead><tbody>${rows}</tbody></table></section>`;
  }
  function branchPage(b){
    side(b.id);
    C.innerHTML=syllabus(b)+`<div class="section-head"><div><div class="section-kicker">SEMESTER I · SUBJECTS</div><h2>Open a subject</h2><p class="content-lead">Every subject below belongs to ${esc(b.title)}. Open one to continue to units, topics and lessons.</p></div></div><div class="subject-grid">${subjects(b).map(s=>`<a class="subject-card" href="/study-materials-subject.html?branch=${encodeURIComponent(b.id)}&semester=${encodeURIComponent(s.semester?.id||'sem1')}&subject=${encodeURIComponent(s.id)}"><span>${esc(s.code||'COURSE')}</span><h2>${esc(s.title)}</h2><p>${(s.units||[]).length} units · ${topics(s)} topics</p><b>OPEN SUBJECT ↗</b></a>`).join('')}</div>`;
    const p=$('#printSyllabus');if(p)p.addEventListener('click',()=>window.print());
    crumbs(['Admission Session 2026',b.title]);
  }
  function search(){const q=(Q?.value||'').trim().toLowerCase();if(!q)return;for(const b of branches())for(const s of subjects(b)){if(`${b.title} ${b.code||''} ${s.title} ${s.code||''}`.toLowerCase().includes(q)){go({branch:b.id});return}}}
  function boot(){
    if(!year()){C.innerHTML='<div class="empty"><h3>Study Materials could not load.</h3><p>Catalogue data is unavailable. Please refresh once.</p></div>';return}
    const p=new URLSearchParams(location.search),requested=p.get('branch'),b=branches().find(x=>x.id===requested);
    if(requested&&b)branchPage(b);else home();
    if(Q)Q.addEventListener('keydown',e=>{if(e.key==='Enter')search()});
  }
  if(data())boot();else window.addEventListener('DOMContentLoaded',()=>{if(data())boot();else setTimeout(boot,0)},{once:true});
})();
