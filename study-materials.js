(() => {
  const DATA = window.PX_STUDY_DATA;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const content = $('#content'), tree = $('#sideTree'), crumbs = $('#breadcrumbs'), search = $('#globalSearch');
  const STORE='px-study-state-v1';
  let state = JSON.parse(localStorage.getItem(STORE)||'{"done":{},"saved":{}}');
  const saveState=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const branch=DATA.years[0].branches[0];
  const year=DATA.years[0];
  const semById=id=>branch.semesters.find(s=>s.id===id);
  const subjectById=id=>branch.semesters.flatMap(s=>s.subjects).find(s=>s.id===id);
  const unitById=(subject,id)=>subject?.units.find(u=>u.id===id);
  const topicById=(unit,id)=>unit?.topics.find(t=>typeof t==='string'?false:t.id===id);
  const topicKey=(s,u,t)=>`${s.id}:${u.id}:${t.id||t}`;
  const esc=x=>String(x??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const slug=x=>String(x).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

  function allSubjects(){return branch.semesters.flatMap(s=>s.subjects.map(x=>({...x,semester:s})));}
  function normalizeTopic(x){
    if(typeof x==='string') return {id:slug(x),title:x,type:'concept',keywords:x,notes:null};
    return x;
  }
  function notesFor(subject,unit,raw){
    const t=normalizeTopic(raw), n=t.notes||{};
    return {t,n};
  }
  function diagram(type,title){
    const maps={
      determinant:['Matrix A','Minor / Cofactor','Determinant value'],
      cramer:['Equations','Determinant D','Dx / Dy / Dz → Solution'],
      matrix:['Rows + Columns','Matrix Operations','Transpose / Inverse'],
      computer:['Input','CPU + Memory','Output'],
      web:['Browser','HTTP Request','Web Server'],
      generic:['Concept','Process','Result']
    };
    const a=maps[type]||maps.generic;
    return `<div class="diagram-box"><div class="diagram-title">DIAGRAM EXPLANATION · ${esc(title)}</div><div class="diagram"><div class="diagram-row">${a.map((x,i)=>(i?'<span class="arrow">→</span>':'')+`<div class="diagram-node">${esc(x)}</div>`).join('')}</div></div><p style="font-size:11px;color:#777;margin:12px 0 0">The diagram is a learning aid: read it left-to-right as the basic flow of the concept. Each block represents the main stage or object students should remember.</p></div>`;
  }
  function genericNotes(subject,unit,topic){
    const title=typeof topic==='string'?topic:topic.title;
    return {definition:`${title} is a syllabus topic in ${subject.title}. This reader uses a step-by-step structure so a Diploma student can first understand the idea, then apply it, and finally revise it for an examination.`,explanation:[`Start by identifying the basic meaning of ${title}. Do not memorise the final line before understanding the terms used in it.`,`Break the topic into inputs, process/rules and output/result. This makes numerical, technical and theory questions easier to organise.`,`For an exam answer, write the definition, explain the principle, show the relevant formula or steps, and finish with an example or application when appropriate.`],important:['Learn the terminology before attempting application questions.','Write assumptions/conditions before applying a theorem, law or formula.','Use labelled diagrams wherever the question involves a system, process or structure.'],formula:'Write the standard formula or rule here after identifying the exact form of the problem.',example:`A good practice method for ${title}: write one definition from memory, solve one guided example, then solve one new problem without looking at the answer.`,mistakes:['Skipping conditions or units.','Using a formula without checking what each symbol means.','Writing an unexplained final answer in a long-answer question.'],short:[`Define ${title}.`,`State one application of ${title}.`],long:[`Explain ${title} in detail with a suitable example.`,`Write the important principles/steps involved in ${title}.`],mcq:[[`${title} should be learned by`, 'Understanding + application','Memorising only','Skipping examples','None'],['A strong exam answer usually includes','Definition + explanation + example','Only a heading','Only a formula','Only a diagram']]};
  }
  function noteHtml(subject,unit,raw){
    const {t}=notesFor(subject,unit,raw), n=t.notes||genericNotes(subject,unit,t);
    const arr=v=>Array.isArray(v)?v:[];
    return `<article class="notes" id="printArea">
      <div class="section-kicker">${esc(subject.code)} · ${esc(unit.title)}</div>
      <h2>${esc(t.title)}</h2>
      <p class="content-lead">${esc(subject.title)} · ${esc(branch.title)} · ${esc(unit.title)}</p>
      ${n.definition?`<div class="definition"><b>Simple Definition</b><p>${esc(n.definition)}</p></div>`:''}
      ${n.explanation?.length?`<h3>Concept Explanation</h3><ul>${arr(n.explanation).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
      ${t.diagram?diagram(t.diagram,t.title):diagram(subject.id==='it-system'?'computer':subject.id==='web'?'web':'generic',t.title)}
      ${n.formula?`<div class="formula">${esc(n.formula)}</div>`:''}
      ${n.example?`<div class="example"><b>Solved / Practical Example</b><p>${esc(n.example)}</p></div>`:''}
      ${n.important?.length?`<div class="important"><b>Important Points</b><ul>${arr(n.important).map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`:''}
      ${n.mistakes?.length?`<h3>Common Mistakes</h3><ul>${arr(n.mistakes).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
      <div class="exam-box"><h3>Exam Practice</h3><b>Short Questions</b><ul>${arr(n.short).map(x=>`<li>${esc(x)}</li>`).join('')}</ul><b>Long Questions</b><ul>${arr(n.long).map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${arr(n.mcq).map((q,i)=>`<div class="mcq"><b>MCQ ${i+1}. ${esc(q[0])}</b>${q.slice(1).map((o,j)=>`<label>${String.fromCharCode(65+j)}. ${esc(o)}</label>`).join('')}</div>`).join('')}</div>
      <h3>Quick Revision</h3><ul><li>Know the definition and key terms.</li><li>Remember the formula/rule and its conditions.</li><li>Practise one basic, one standard and one application question.</li></ul>
      <div class="card-foot"><span>PrinceXmahto Study Materials · SBTE Bihar demo</span><span>Read → Understand → Practise → Revise</span></div>
    </article>`;
  }
  function setUrl(params={}){const u=new URL(location.href);Object.entries(params).forEach(([k,v])=>v?u.searchParams.set(k,v):u.searchParams.delete(k));history.pushState({},'',u);}
  function current(){const u=new URL(location.href);return {sem:u.searchParams.get('semester'),subject:u.searchParams.get('subject'),unit:u.searchParams.get('unit'),topic:u.searchParams.get('topic'),q:u.searchParams.get('q')};}
  function breadcrumbs(items){crumbs.innerHTML=items.map((x,i)=>i<items.length-1?`<a href="${x.href||'#'}">${esc(x.label)}</a><span>/</span>`:`<b>${esc(x.label)}</b>`).join('');}
  function progress(subject){let total=0,done=0;subject.units.forEach(u=>u.topics.forEach(r=>{total++;if(state.done[topicKey(subject,u,normalizeTopic(r))])done++;}));return total?Math.round(done/total*100):0;}
  function renderTree(active){
    tree.innerHTML=branch.semesters.map(s=>`<button class="tree-btn ${active===s.id?'active':''}" data-sem="${s.id}">${esc(s.title)} <span style="float:right">${s.subjects.length}</span></button><div class="tree-sub">${s.subjects.map(x=>`<button class="tree-btn" data-sub="${x.id}">${esc(x.title)}</button>`).join('')}</div>`).join('');
    $$('.tree-btn',tree).forEach(b=>b.onclick=()=>b.dataset.sem?go({semester:b.dataset.sem}):go({semester:subjectById(b.dataset.sub).semester.id,subject:b.dataset.sub}));
  }
  function renderHome(){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title}]);renderTree('');
    content.innerHTML=`<div class="section-kicker">DIPLOMA · 1ST YEAR · ${esc(branch.title)}</div><h2>Choose your semester.</h2><p class="content-lead">A data-driven demo based on the SBTE Bihar 2024–25 CSE curriculum. Subjects, units and topics are stored separately so future years and branches can be added without rebuilding the interface.</p><div class="filter-row"><span class="filter">Branch Code ${branch.code}</span><span class="filter">${branch.semesters.reduce((a,s)=>a+s.subjects.length,0)} subjects</span><span class="filter">Unit-wise structure</span><span class="filter">PDF-ready</span></div><div class="cards">${branch.semesters.map(s=>`<article class="card" data-go-sem="${s.id}"><div class="card-top"><span class="code">${s.subjects.length} SUBJECTS</span><span class="pill">SEMESTER</span></div><h3>${esc(s.title)}</h3><p>${s.subjects.map(x=>esc(x.title)).join(' · ')}</p><div class="card-foot"><span>Open syllabus →</span><span class="open-btn">EXPLORE</span></div></article>`).join('')}</div><div class="search-results" id="homeResults"></div>`;
    $$('.card[data-go-sem]').forEach(c=>c.onclick=()=>go({semester:c.dataset.goSem}));
  }
  function renderSemester(sem){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:sem.title}]);renderTree(sem.id);
    content.innerHTML=`<div class="section-kicker">${esc(sem.title)}</div><h2>Subjects & syllabus.</h2><p class="content-lead">Select a subject to open its complete unit and topic map. Every card is generated from the content model, not hard-coded page markup.</p><div class="cards">${sem.subjects.map(s=>`<article class="card" data-sub="${s.id}"><div class="card-top"><span class="code">${esc(s.code)}</span><span class="pill">${esc(s.category)}</span></div><h3>${esc(s.title)}</h3><p>${s.units.length} units · ${s.units.reduce((a,u)=>a+u.topics.length,0)} topics</p><div class="card-foot"><span>${progress(s)}% complete</span><span class="open-btn">OPEN →</span></div></article>`).join('')}</div>`;
    $$('.card[data-sub]').forEach(c=>c.onclick=()=>go({semester:sem.id,subject:c.dataset.sub}));
  }
  function renderSubject(sem,subject){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:branch.title},{label:subject.title}]);renderTree(sem.id);
    const pct=progress(subject);
    content.innerHTML=`<div class="subject-head"><div><div class="section-kicker">${esc(subject.code)} · ${esc(sem.title)}</div><h2>${esc(subject.title)}</h2><p class="content-lead">${esc(branch.title)} · ${esc(subject.category)} · ${subject.units.length} units</p></div><div class="subject-actions"><button class="action-btn primary" id="pdfSubject">Download PDF</button><button class="action-btn" id="subjectSyllabus">Official syllabus ↗</button></div></div><div class="filter-row"><span class="filter">Course Code: ${esc(subject.code)}</span><span class="filter">Branch: CSE</span><span class="filter">Year: 1st Year</span><span class="filter">Progress: ${pct}%</span></div><div class="unit-list">${subject.units.map(u=>`<section class="unit-card"><div class="unit-head"><div><small>${esc(u.weightage||'UNIT')}</small><h3>${esc(u.title)}</h3></div><small>${u.topics.length} topics</small></div><div class="topic-grid">${u.topics.map(r=>{const t=normalizeTopic(r),k=topicKey(subject,u,t);return `<button class="topic" data-topic="${esc(t.id)}" data-unit="${esc(u.id)}"><strong>${esc(t.title)}</strong><span>${state.done[k]?'✓ Completed':'Open detailed notes →'}</span></button>`}).join('')}</div></section>`).join('')}</div>`;
    $('#pdfSubject').onclick=()=>printPdf();
    $('#subjectSyllabus').onclick=()=>window.open('https://sbte.bihar.gov.in/curriculum','_blank','noopener');
    $$('.topic',content).forEach(b=>b.onclick=()=>go({semester:sem.id,subject:subject.id,unit:b.dataset.unit,topic:b.dataset.topic}));
  }
  function renderTopic(sem,subject,unit,topic){
    breadcrumbs([{label:'Study Materials'},{label:'Diploma'},{label:year.title},{label:branch.title},{label:subject.title},{label:unit.title},{label:topic.title}]);renderTree(sem.id);
    const k=topicKey(subject,unit,topic), completed=!!state.done[k], saved=!!state.saved[k];
    content.innerHTML=`<div class="subject-head"><div><div class="section-kicker">TOPIC READER · ${esc(subject.code)}</div><h2>${esc(topic.title)}</h2><p class="content-lead">${esc(subject.title)} · ${esc(unit.title)}</p></div><div class="subject-actions"><button class="action-btn ${completed?'primary':''}" id="doneBtn">${completed?'✓ Completed':'Mark completed'}</button><button class="action-btn" id="saveBtn">${saved?'★ Bookmarked':'☆ Bookmark'}</button><button class="action-btn" id="pdfTopic">Download PDF</button></div></div>${noteHtml(subject,unit,topic)}`;
    $('#doneBtn').onclick=()=>{state.done[k]=!completed;saveState();renderTopic(sem,subject,unit,topic)};
    $('#saveBtn').onclick=()=>{state.saved[k]=!saved;saveState();renderTopic(sem,subject,unit,topic)};
    $('#pdfTopic').onclick=()=>printPdf();
  }
  function searchResults(q){
    q=q.trim().toLowerCase(); if(!q){renderHome();return;}
    const results=[];allSubjects().forEach(s=>{if([s.title,s.code,s.semester.title,branch.title].some(v=>String(v).toLowerCase().includes(q)))results.push({kind:'subject',s});s.units.forEach(u=>u.topics.forEach(r=>{const t=normalizeTopic(r);if([t.title,u.title,s.title,s.code,branch.title].some(v=>String(v).toLowerCase().includes(q)))results.push({kind:'topic',s,u,t});}));});
    breadcrumbs([{label:'Study Materials'},{label:'Search'}]);renderTree('');content.innerHTML=`<div class="section-kicker">GLOBAL SEARCH</div><h2>Results for “${esc(q)}”</h2><p class="content-lead">Searches subject name, course code, unit, topic, branch and year.</p><div class="search-results">${results.length?results.slice(0,80).map(r=>r.kind==='subject'?`<div class="result" data-sub="${r.s.id}" data-sem="${r.s.semester.id}"><strong>${esc(r.s.title)}</strong><small>${esc(r.s.code)} · ${esc(r.s.semester.title)} · ${esc(branch.title)}</small></div>`:`<div class="result" data-sub="${r.s.id}" data-sem="${r.s.semester.id}" data-unit="${r.u.id}" data-topic="${r.t.id}"><strong>${esc(r.t.title)}</strong><small>${esc(r.s.title)} · ${esc(r.u.title)} · ${esc(r.s.code)}</small></div>`).join(''):`<div class="empty">No matching study material found. Try a subject name, course code, unit or topic.</div>`}</div>`;
    $$('.result',content).forEach(r=>r.onclick=()=>go({semester:r.dataset.sem,subject:r.dataset.sub,unit:r.dataset.unit,topic:r.dataset.topic}));
  }
  function go(params={}){setUrl(params);render();window.scrollTo({top:0,behavior:'smooth'});}
  function render(){const c=current();if(c.q){search.value=c.q;searchResults(c.q);return}const sem=c.sem?semById(c.sem):null,sub=c.subject?subjectById(c.subject):null,unit=sub&&c.unit?unitById(sub,c.unit):null,topic=unit&&c.topic?normalizeTopic(unit.topics.find(t=>normalizeTopic(t).id===c.topic)):null;if(topic&&unit&&sub&&sem)renderTopic(sem,sub,unit,topic);else if(sub&&sem)renderSubject(sem,sub);else if(sem)renderSemester(sem);else renderHome();}
  function printPdf(){
    const badge=document.createElement('div');badge.className='print-brand';badge.innerHTML='<img src="/assets/princexmahto-logo.svg" alt=""><span>PRINCEXMAHTO · STUDY MATERIALS</span>';document.body.appendChild(badge);window.print();setTimeout(()=>badge.remove(),1000);
  }
  search.addEventListener('input',e=>{const q=e.target.value;const u=new URL(location.href);if(q){u.searchParams.set('q',q);['semester','subject','unit','topic'].forEach(k=>u.searchParams.delete(k));}else u.searchParams.delete('q');history.replaceState({},'',u);searchResults(q)});
  document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus();}});
  window.addEventListener('popstate',render);document.addEventListener('click',e=>{const a=e.target.closest('a[href="#"]');if(a)e.preventDefault()});
  const y=$('[data-year]');if(y)y.textContent=new Date().getFullYear();
  const printStyle=document.createElement('style');printStyle.textContent='@media print{.print-brand{display:flex!important;position:fixed;top:0;right:0;align-items:center;gap:7px;font:800 7px Manrope;color:#888;z-index:9999}.print-brand img{width:32px;height:32px;border-radius:50%;opacity:.16}.notes{padding-top:42px!important}}.print-brand{display:none}';document.head.appendChild(printStyle);
  render();
})();
