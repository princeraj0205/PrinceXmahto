/* PrinceXmahto Study Materials — standalone catalogue renderer */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const C=$('#content'),T=$('#sideTree'),B=$('#breadcrumbs'),Q=$('#globalSearch');
if(!C||!T)return;

function boot(){
  const D=window.PX_STUDY_DATA;
  if(!D || !D.years || !D.years[0]){
    C.innerHTML='<div class="empty"><h3>Study Materials could not load.</h3><p>Catalogue data is unavailable. Please refresh once.</p></div>';
    return;
  }
  const Y=D.years[0];
  const branches=Y.branches||[];
  const SY=window.PX_BRANCH_SYLLABUS||{};
  const subjects=b=>(b.semesters||[]).reduce((out,s)=>out.concat((s.subjects||[]).map(x=>Object.assign({},x,{semester:s}))),[]);
  const total=s=>(s.units||[]).reduce((n,u)=>n+((u.topics&&u.topics.length)||0),0);
  const go=o=>{
    const u=new URL(location.href);
    u.search='';
    Object.keys(o||{}).forEach(k=>{if(o[k])u.searchParams.set(k,o[k]);});
    location.href=u.toString();
  };
  const branch=id=>branches.find(b=>b.id===id)||branches[0];

  function side(b){
    T.innerHTML='<div class="tree-group-label">BRANCHES · SBTE 2026</div>'+branches.map(x=>
      '<button class="tree-btn '+(x.id===b.id?'active':'')+'" data-b="'+esc(x.id)+'"><span>'+esc(x.title)+'</span><span>›</span></button>'
    ).join('');
    T.querySelectorAll('[data-b]').forEach(x=>x.addEventListener('click',()=>go({branch:x.dataset.b})));
  }

  function crumbs(a){
    B.innerHTML=a.map((x,i)=>i===a.length-1?'<b>'+esc(x)+'</b>':'<span>'+esc(x)+'</span><i>/</i>').join('');
  }

  function catalog(){
    side(branch());
    C.innerHTML='<div class="section-head"><div><div class="section-kicker">SBTE BIHAR · ADMISSION SESSION 2026</div><h1>Choose your branch.</h1><p class="content-lead">Select a branch to see the subjects listed in its 2026 Semester-I syllabus.</p></div></div><div class="branch-grid">'+branches.map(b=>
      '<button class="branch-card" data-open="'+esc(b.id)+'"><span>'+esc(b.code)+'</span><strong>'+esc(b.title)+'</strong><p>'+subjects(b).length+' subjects · Semester I</p><b>VIEW SYLLABUS →</b></button>'
    ).join('')+'</div>';
    C.querySelectorAll('[data-open]').forEach(x=>x.addEventListener('click',()=>go({branch:x.dataset.open})));
    crumbs(['Admission Session 2026','Branches']);
  }

  function syllabus(b){
    const meta=SY[b.id]||{courses:[],source:'Uploaded SBTE Bihar 2026 curriculum PDF'};
    const rows=(meta.courses||[]).map((r,i)=>'<tr><td>'+String(i+1)+'</td><td class="syllabus-code">'+esc(r[0])+'</td><td>'+esc(r[1])+'</td><td>'+esc(r[2])+'</td></tr>').join('');
    return '<section class="syllabus-box" id="branch-syllabus"><div class="syllabus-top"><div><div class="syllabus-kicker">OFFICIAL SYLLABUS REFERENCE · SBTE BIHAR · ADMISSION SESSION 2026</div><h2>'+esc(b.title)+' · Semester I</h2><p class="syllabus-source">Transcribed from the uploaded SBTE curriculum PDF: '+esc(meta.source)+'</p></div><div class="syllabus-actions"><button type="button" id="printSyllabus">PRINT / SAVE PDF ↗</button></div></div><table class="syllabus-table"><thead><tr><th>#</th><th>COURSE CODE</th><th>CATEGORY</th><th>COURSE TITLE</th></tr></thead><tbody>'+rows+'</tbody></table><p class="syllabus-note">This branch syllabus block uses the uploaded 2026 SBTE curriculum as its source. The course code, category and title are kept as listed in the document; no outside syllabus has been substituted.</p></section>';
  }

  function branchPage(b){
    side(b);
    C.innerHTML=syllabus(b)+'<div class="section-head"><div><div class="section-kicker">SEMESTER I · SUBJECTS</div><h2>Open a subject</h2><p class="content-lead">Each subject opens its unit-wise topic roadmap. Only subjects belonging to this branch are shown.</p></div></div><div class="subject-grid">'+subjects(b).map(s=>
      '<a class="subject-card" href="/study-materials-subject.html?branch='+encodeURIComponent(b.id)+'&semester='+encodeURIComponent(s.semester&&s.semester.id||'sem1')+'&subject='+encodeURIComponent(s.id)+'"><span>'+esc(s.code||'COURSE')+'</span><h2>'+esc(s.title)+'</h2><p>'+(s.units?s.units.length:0)+' units · '+total(s)+' topics</p><b>OPEN SUBJECT ↗</b></a>'
    ).join('')+'</div>';
    const p=$('#printSyllabus');
    if(p)p.addEventListener('click',()=>window.print());
    crumbs(['Admission Session 2026',b.title]);
  }

  function render(){
    const p=new URLSearchParams(location.search);
    const b=branch(p.get('branch'));
    if(p.get('branch') && b)branchPage(b); else catalog();
    if(Q)Q.addEventListener('keydown',e=>{
      if(e.key!=='Enter')return;
      const q=Q.value.trim().toLowerCase();
      if(!q)return;
      const all=branches.reduce((out,b)=>out.concat(subjects(b).map(s=>({b:b,s:s}))),[]);
      const hit=all.find(x=>(x.s.title+' '+x.s.code+' '+x.b.title).toLowerCase().indexOf(q)!==-1);
      if(hit)location.href='/study-materials-subject.html?branch='+encodeURIComponent(hit.b.id)+'&semester=sem1&subject='+encodeURIComponent(hit.s.id);
    });
  }
  render();
}

if(window.PX_STUDY_DATA)boot();
else window.addEventListener('load',boot,{once:true});
})();
