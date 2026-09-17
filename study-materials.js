(() => {
  const DATA = window.PX_STUDY_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const content = $('#content'), tree = $('#sideTree'), crumbs = $('#breadcrumbs'), search = $('#globalSearch');
  const year = DATA.years[0];
  const STORE = 'px-study-state-v2';
  let state;
  try { state = JSON.parse(localStorage.getItem(STORE) || '{"done":{},"saved":{}}'); }
  catch { state = {done:{},saved:{}}; }
  const saveState = () => localStorage.setItem(STORE, JSON.stringify(state));
  const esc = x => String(x ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const slug = x => String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const getBranch = id => year.branches.find(b => b.id === id) || year.branches[0];
  const current = () => { const u=new URL(location.href); return {branch:u.searchParams.get('branch'),semester:u.searchParams.get('semester'),subject:u.searchParams.get('subject'),unit:u.searchParams.get('unit'),topic:u.searchParams.get('topic'),q:u.searchParams.get('q')}; };
  const routeBranch = () => getBranch(current().branch);
  const semById = (b,id) => b.semesters.find(s => s.id===id);
  const allSubjects = b => b.semesters.flatMap(s=>s.subjects.map(x=>({...x,semester:s})));
  const subjectById = (b,id) => allSubjects(b).find(s=>s.id===id);
  const unitById = (s,id) => s?.units.find(u=>u.id===id);
  const normalizeTopic = raw => typeof raw==='string' ? {id:slug(raw),title:raw,type:'concept',keywords:raw,notes:null} : raw;
  const topicById = (u,id) => u?.topics.map(normalizeTopic).find(t=>t.id===id);
  const topicKey = (b,s,u,t) => `${b.id}:${s.id}:${u.id}:${t.id||slug(t.title)}`;

  function setUrl(params={}, replace=false){
    const u=new URL(location.href);
    Object.entries(params).forEach(([k,v])=>v?u.searchParams.set(k,v):u.searchParams.delete(k));
    history[replace?'replaceState':'pushState']({},'',u); render();
  }
  function breadcrumbs(items){
    crumbs.innerHTML=items.map((x,i)=>i<items.length-1?`<a href="${x.href||'#'}" data-crumb="${esc(x.href||'')}">${esc(x.label)}</a><span>/</span>`:`<b>${esc(x.label)}</b>`).join('');
    $$('[data-crumb]',crumbs).forEach(a=>a.onclick=e=>{e.preventDefault();a.dataset.crumb?location.href=a.dataset.crumb:setUrl({semester:'',subject:'',unit:'',topic:'',q:''});});
  }
  function progress(b,s){let total=0,done=0;s.units.forEach(u=>u.topics.forEach(raw=>{const t=normalizeTopic(raw);total++;if(state.done[topicKey(b,s,u,t)])done++;}));return total?Math.round(done/total*100):0;}

  function renderTree(activeSem=''){
    const b=routeBranch();
    const branchBtns=year.branches.map(x=>`<button class="tree-btn ${x.id===b.id?'active':''}" data-branch="${esc(x.id)}">${esc(x.title)}<span style="float:right">›</span></button>`).join('');
    const semBtns=b.semesters.map(s=>`<button class="tree-btn ${activeSem===s.id?'active':''}" data-sem="${esc(s.id)}">${esc(s.title)}<span style="float:right">${s.subjects.length}</span></button><div class="tree-sub">${s.subjects.map(x=>`<button class="tree-btn" data-sub="${esc(x.id)}">${esc(x.title)}</button>`).join('')}</div>`).join('');
    tree.innerHTML=`<div class="tree-group-label">BRANCHES · 2026</div>${branchBtns}<div class="tree-group-label" style="margin-top:14px">SEMESTER I</div>${semBtns}`;
    $$('[data-branch]',tree).forEach(x=>x.onclick=()=>setUrl({branch:x.dataset.branch,semester:'',subject:'',unit:'',topic:'',q:''}));
    $$('[data-sem]',tree).forEach(x=>x.onclick=()=>setUrl({branch:b.id,semester:x.dataset.sem,subject:'',unit:'',topic:'',q:''}));
    $$('[data-sub]',tree).forEach(x=>x.onclick=()=>{const s=subjectById(b,x.dataset.sub);setUrl({branch:b.id,semester:s.semester.id,subject:s.id,unit:'',topic:'',q:''});});
  }

  function genericNotes(subject,unit,topic){
    const title=topic.title;
    return {definition:`${title} is a syllabus topic in the SBTE Bihar Admission Session 2026 first-semester curriculum.`,explanation:[`Understand the meaning and scope of ${title} before memorising points.`,'Break the topic into definition, principle/process, important terms and application.','For examinations, present the answer in a logical order and add a labelled diagram or example where appropriate.'],important:['Learn definitions and technical terms accurately.','Write formulas with the meaning of symbols and required conditions.','Use labelled diagrams for systems, processes and engineering objects when applicable.'],formula:'Use the standard formula, law, rule or equation specified for the exact problem.',example:`Prepare one basic example for ${title}, then practise a second question without looking at the notes.`,mistakes:['Skipping conditions or units.','Using a formula without identifying its symbols.','Writing only the final answer without the required working.'],short:[`Define ${title}.`,`State one important point or application of ${title}.`],long:[`Explain ${title} in detail with a suitable example.`],mcq:[[`${title} should be learned through`,'Understanding + practice','Memorising only','Skipping examples','None']]};
  }
  function diagram(type,title){
    const maps={determinant:['Matrix','Minor / Cofactor','Determinant'],cramer:['Equations','Determinant D','Dx / Dy / Dz → Solution'],matrix:['Rows + Columns','Matrix Operations','Transpose / Inverse'],computer:['Input','CPU + Memory','Output'],web:['Browser','HTTP Request','Web Server'],generic:['Concept','Process','Result']};
    const a=maps[type]||maps.generic;
    return `<div class="diagram-box"><div class="diagram-title">DIAGRAM EXPLANATION · ${esc(title)}</div><div class="diagram"><div class="diagram-row">${a.map((x,i)=>(i?'<span class="arrow">→</span>':'')+`<div class="diagram-node">${esc(x)}</div>`).join('')}</div></div><p style="font-size:11px;color:#777;margin:12px 0 0">Learning aid: read the flow from left to right. Each block represents a major stage or object.</p></div>`;
  }
  function noteHtml(branch,subject,unit,topic){
    const n=topic.notes||genericNotes(subject,unit,topic), arr=v=>Array.isArray(v)?v:[], dtype=topic.diagram||(subject.id==='ai'||subject.id==='it-system'?'computer':subject.id==='web'?'web':'generic');
    return `<article class="notes" id="printArea"><div class="section-kicker">${esc(subject.code)} · ${esc(unit.title)}</div><h2>${esc(topic.title)}</h2><p class="content-lead">${esc(subject.title)} · ${esc(branch.title)} · ${esc(year.title)}</p>${n.definition?`<div class="definition"><b>Simple Definition</b><p>${esc(n.definition)}</p></div>`:''}${arr(n.explanation).length?`<h3>Concept Explanation</h3><ul>${arr(n.explanation).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${diagram(dtype,topic.title)}${n.formula?`<div class="formula">${esc(n.formula)}</div>`:''}${n.example?`<div class="example"><b>Solved / Practical Example</b><p>${esc(n.example)}</p></div>`:''}${arr(n.important).length?`<div class="important"><b>Important Points</b><ul>${arr(n.important).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}${arr(n.mistakes).length?`<h3>Common Mistakes</h3><ul>${arr(n.mistakes).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<div class="exam-box"><h3>Exam Practice</h3><b>Short Questions</b><ul>${arr(n.short).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><b>Long Questions</b><ul>${arr(n.long).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${arr(n.mcq).map((q,i)=>`<div class="mcq"><b>MCQ ${i+1}. ${esc(q[0])}</b>${q.slice(1).map((o,j)=>`<label>${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join('')}</div>`).join('')}</div><h3>Quick Revision</h3><ul><li>Know the definition and key terms.</li><li>Remember the formula/rule and its conditions.</li><li>Practise one basic, one standard and one application question.</li></ul><div class="card-foot"><span>PrinceXmahto Study Materials · SBTE Bihar · Admission Session 2026</span><span>Read → Understand → Practise → Revise</span></div></article>`;
  }

  function renderHome(){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title}]);renderTree('');
    content.innerHTML=`<div class="section-kicker">DIPLOMA · FIRST SEMESTER</div><h2>Choose your branch.</h2><p class="content-lead">SBTE Bihar curriculum structure for <b>${esc(DATA.meta.session)}</b>. Select a branch to view Semester I subjects, course codes, units and study topics.</p><div class="filter-row"><span class="filter">${year.branches.length} branches</span><span class="filter">Semester I</span><span class="filter">Course-code search</span><span class="filter">PDF-ready</span></div><div class="cards">${year.branches.map(b=>`<article class="card" data-branch-card="${esc(b.id)}"><div class="card-top"><span class="code">${esc(b.code)}</span><span class="pill">SBTE 2026</span></div><h3>${esc(b.title)}</h3><p>Semester I · ${b.semesters[0].subjects.length} subjects</p><div class="card-foot"><span>Open curriculum →</span><span class="open-btn">EXPLORE</span></div></article>`).join('')}</div><div class="search-results"><div class="result"><strong>Source basis</strong><small>Uploaded SBTE Bihar first-semester curriculum PDFs supplied for this update.</small></div></div>`;
    $$('[data-branch-card]',content).forEach(c=>c.onclick=()=>setUrl({branch:c.dataset.branchCard,semester:'sem1',subject:'',unit:'',topic:'',q:''}));
  }
  function renderSemester(branch,sem){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:branch.title,href:`?branch=${branch.id}`},{label:sem.title}]);renderTree(sem.id);
    content.innerHTML=`<div class="section-kicker">${esc(branch.title)} · ${esc(sem.title)}</div><h2>Subjects & syllabus.</h2><p class="content-lead">Subjects below are taken from the uploaded SBTE Bihar Admission Session 2026 curriculum for this branch.</p><div class="cards">${sem.subjects.map(s=>`<article class="card" data-sub-card="${esc(s.id)}"><div class="card-top"><span class="code">${esc(s.code)}</span><span class="pill">${esc(s.category)}</span></div><h3>${esc(s.title)}</h3><p>${s.units.length?`${s.units.length} units · ${s.units.reduce((a,u)=>a+u.topics.length,0)} study topics`:'Practical / workshop course'}</p><div class="card-foot"><span>${progress(branch,s)}% complete</span><span class="open-btn">OPEN →</span></div></article>`).join('')}</div>`;
    $$('[data-sub-card]',content).forEach(c=>c.onclick=()=>setUrl({branch:branch.id,semester:sem.id,subject:c.dataset.subCard,unit:'',topic:'',q:''}));
  }
  function renderSubject(branch,sem,subject){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:branch.title,href:`?branch=${branch.id}`},{label:subject.title}]);renderTree(sem.id);
    const pct=progress(branch,subject), practical=!subject.units.length;
    content.innerHTML=`<div class="subject-head"><div><div class="section-kicker">${esc(subject.code)} · ${esc(sem.title)}</div><h2>${esc(subject.title)}</h2><p class="content-lead">${esc(branch.title)} · ${esc(subject.category)} · ${practical?'Practical / workshop course':subject.units.length+' units'}</p></div><div class="subject-actions"><button class="action-btn primary" id="pdfSubject">Download PDF</button><button class="action-btn" id="subjectSyllabus">Official curriculum ↗</button></div></div><div class="filter-row"><span class="filter">Course Code: ${esc(subject.code)}</span><span class="filter">Branch: ${esc(branch.code)}</span><span class="filter">Session: 2026</span><span class="filter">Progress: ${pct}%</span></div>${practical?`<div class="search-results"><div class="result"><strong>Practical / Workshop course</strong><small>The uploaded 2026 curriculum identifies this as a practical/workshop course. Detailed practical activities can be added later through the same data model.</small></div></div>`:`<div class="unit-list">${subject.units.map(u=>`<section class="unit-card"><div class="unit-head"><div><small>${esc(u.weightage||'UNIT')}</small><h3>${esc(u.title)}</h3></div><small>${u.topics.length} topics</small></div><div class="topic-grid">${u.topics.map(raw=>{const t=normalizeTopic(raw),k=topicKey(branch,subject,u,t);return `<button class="topic" data-topic="${esc(t.id)}" data-unit="${esc(u.id)}"><strong>${esc(t.title)}</strong><span>${state.done[k]?'✓ Completed':'Open detailed notes →'}</span></button>`}).join('')}</div></section>`).join('')}</div>`}`;
    $('#pdfSubject').onclick=()=>printPdf();$('#subjectSyllabus').onclick=()=>window.open('https://sbte.bihar.gov.in/curriculum','_blank','noopener');
    $$('.topic',content).forEach(b=>b.onclick=()=>setUrl({branch:branch.id,semester:sem.id,subject:subject.id,unit:b.dataset.unit,topic:b.dataset.topic,q:''}));
  }
  function renderTopic(branch,sem,subject,unit,topic){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:branch.title,href:`?branch=${branch.id}`},{label:subject.title,href:`?branch=${branch.id}&semester=${sem.id}&subject=${subject.id}`},{label:unit.title},{label:topic.title}]);renderTree(sem.id);
    const k=topicKey(branch,subject,unit,topic), completed=!!state.done[k], saved=!!state.saved[k];
    content.innerHTML=`<div class="subject-head"><div><div class="section-kicker">TOPIC READER · ${esc(subject.code)}</div><h2>${esc(topic.title)}</h2><p class="content-lead">${esc(subject.title)} · ${esc(unit.title)}</p></div><div class="subject-actions"><button class="action-btn ${completed?'primary':''}" id="doneBtn">${completed?'✓ Completed':'Mark completed'}</button><button class="action-btn" id="saveBtn">${saved?'★ Bookmarked':'☆ Bookmark'}</button><button class="action-btn" id="pdfTopic">Download PDF</button></div></div>${noteHtml(branch,subject,unit,topic)}`;
    $('#doneBtn').onclick=()=>{state.done[k]=!completed;saveState();renderTopic(branch,sem,subject,unit,topic);};$('#saveBtn').onclick=()=>{state.saved[k]=!saved;saveState();renderTopic(branch,sem,subject,unit,topic);};$('#pdfTopic').onclick=()=>printPdf();
  }
  function searchResults(q){
    const needle=q.trim().toLowerCase();if(!needle){renderHome();return;}const results=[];
    year.branches.forEach(branch=>allSubjects(branch).forEach(s=>{if([s.title,s.code,s.semester.title,branch.title,branch.code].some(v=>String(v).toLowerCase().includes(needle)))results.push({kind:'subject',branch,s});s.units.forEach(u=>u.topics.forEach(raw=>{const t=normalizeTopic(raw);if([t.title,u.title,s.title,s.code,branch.title,branch.code].some(v=>String(v).toLowerCase().includes(needle)))results.push({kind:'topic',branch,s,u,t});}));}));
    breadcrumbs([{label:'Study Materials'},{label:'Search'}]);renderTree('');content.innerHTML=`<div class="section-kicker">GLOBAL SEARCH</div><h2>Results for “${esc(q)}”</h2><p class="content-lead">Searches across all 2026 branches, course codes, subjects, units and topics.</p><div class="search-results">${results.length?results.slice(0,100).map(r=>r.kind==='subject'?`<div class="result" data-r-branch="${esc(r.branch.id)}" data-r-sem="${esc(r.s.semester.id)}" data-r-sub="${esc(r.s.id)}"><strong>${esc(r.s.title)}</strong><small>${esc(r.s.code)} · ${esc(r.s.semester.title)} · ${esc(r.branch.title)}</small></div>`:`<div class="result" data-r-branch="${esc(r.branch.id)}" data-r-sem="${esc(r.s.semester.id)}" data-r-sub="${esc(r.s.id)}" data-r-unit="${esc(r.u.id)}" data-r-topic="${esc(r.t.id)}"><strong>${esc(r.t.title)}</strong><small>${esc(r.s.title)} · ${esc(r.s.code)} · ${esc(r.branch.title)}</small></div>`).join(''):`<div class="result"><strong>No results found</strong><small>Try a branch name, subject name or course code.</small></div>`}</div>`;
    $$('.result[data-r-branch]',content).forEach(r=>r.onclick=()=>setUrl({branch:r.dataset.rBranch,semester:r.dataset.rSem,subject:r.dataset.rSub,unit:r.dataset.rUnit||'',topic:r.dataset.rTopic||'',q:''}));
  }
  function printPdf(){
    const badge=document.createElement('div');badge.id='printBrand';badge.innerHTML=`<img src="/assets/princexmahto-logo.svg" alt="PrinceXmahto"><div><b>PRINCEXMAHTO STUDY MATERIALS</b><span>SBTE Bihar · Admission Session 2026</span></div>`;document.body.appendChild(badge);window.print();setTimeout(()=>badge.remove(),1000);
  }
  function render(){
    const r=current();if(search&&search.value!==r.q)search.value=r.q||'';if(r.q){searchResults(r.q);return;}
    const branch=routeBranch(),sem=semById(branch,r.semester);if(!r.semester||!sem){renderHome();return;}const subject=subjectById(branch,r.subject);if(!subject){renderSemester(branch,sem);return;}const unit=unitById(subject,r.unit);if(!r.unit||!unit){renderSubject(branch,sem,subject);return;}const topic=topicById(unit,r.topic);if(!topic){renderSubject(branch,sem,subject);return;}renderTopic(branch,sem,subject,unit,topic);
  }
  if(search)search.addEventListener('input',()=>{const q=search.value.trim();setUrl({q,branch:routeBranch().id,semester:'',subject:'',unit:'',topic:''});});
  window.addEventListener('popstate',render);
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search?.focus();}});
  const yearEl=$('[data-year]');if(yearEl)yearEl.textContent=new Date().getFullYear();
  render();
})();
