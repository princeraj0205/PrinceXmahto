/* PrinceXmahto Study Materials — resilient catalogue bootstrap */
(function(){
'use strict';
function start(){
 const D=window.PX_STUDY_DATA,Y=D&&D.years&&D.years[0],C=document.getElementById('content'),T=document.getElementById('sideTree'),B=document.getElementById('breadcrumbs');
 if(!Y||!C||!T)return;
 const esc=v=>String(v==null?'':v).replace(/[&<>\"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[c]));
 const qs=new URLSearchParams(location.search),active=qs.get('branch')||'';
 const branches=Y.branches||[];
 const branch=branches.find(b=>b.id===active)||branches[0];
 const subjects=(branch&&branch.semesters||[]).flatMap(s=>(s.subjects||[]).map(x=>({...x,semester:s})));
 const link=(branchId,subjectId)=>`/study-materials-subject.html?branch=${encodeURIComponent(branchId)}&semester=sem1&subject=${encodeURIComponent(subjectId)}`;
 T.innerHTML='<div class="tree-group-label">BRANCHES · SBTE 2026</div>'+branches.map(b=>`<a class="tree-btn ${b.id===branch.id?'active':''}" href="/study-materials.html?branch=${encodeURIComponent(b.id)}"><span>${esc(b.code)} · ${esc(b.title)}</span><span>›</span></a>`).join('')+'<div class="tree-group-label">'+esc(branch.title)+' · SEMESTER I</div>'+subjects.map(s=>`<a class="tree-btn" href="${link(branch.id,s.id)}"><span>${esc(s.title)}</span><small>${esc(s.code)}</small></a>`).join('');
 B.innerHTML=`<a href="/study-materials.html">Study Materials</a><span>/</span><b>${esc(branch.title)}</b>`;
 C.innerHTML=`<div class="section-head"><div><div class="section-kicker">ADMISSION SESSION 2026 · ${esc(branch.code)}</div><h1>${esc(branch.title)}</h1><p class="content-lead">Semester I subjects mapped from the supplied SBTE Bihar 2026 curriculum. Open a subject to see its units, topics and lessons.</p></div></div><div class="subject-grid">${subjects.map(s=>{const units=s.units||[];const count=units.reduce((n,u)=>n+((u.topics||[]).length),0);return `<a class="subject-card" href="${link(branch.id,s.id)}"><span>${esc(s.category||'COURSE')} · ${esc(s.code||'')}</span><h2>${esc(s.title)}</h2><p>${units.length?`${units.length} units · ${count} topics`:'Course outline available · detailed lessons being organized'}</p><b>OPEN SUBJECT →</b></a>`}).join('')}</div>`;
 const search=document.getElementById('globalSearch');
 if(search){search.value=qs.get('q')||'';search.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const q=search.value.trim().toLowerCase();if(!q)return;const hits=[];branches.forEach(b=>(b.semesters||[]).forEach(sm=>(sm.subjects||[]).forEach(s=>{const text=(b.title+' '+b.code+' '+s.title+' '+s.code+' '+(s.units||[]).map(u=>u.title+' '+(u.topics||[]).map(t=>typeof t==='string'?t:t.title).join(' ')).join(' ')).toLowerCase();if(text.includes(q))hits.push({b,s})})));if(hits[0])location.href=link(hits[0].b.id,hits[0].s.id);});}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
