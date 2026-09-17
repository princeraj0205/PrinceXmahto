/* Aliases for branch-specific course IDs that share the same uploaded syllabus. */
(()=>{
'use strict';
const D=window.PX_STUDY_DATA;if(!D?.years?.[0])return;
const all=D.years[0].branches.flatMap(b=>(b.semesters||[]).flatMap(s=>s.subjects||[]));
const copy=(from,to)=>{const a=all.find(x=>x.id===from), targets=all.filter(x=>x.id===to);if(a)targets.forEach(t=>{t.units=(a.units||[]).map((u,ui)=>({id:`${to}-u${ui+1}`,title:u.title,topics:(u.topics||[]).map((x,ti)=>({id:`${to}-u${ui+1}-t${ti+1}`,title:x.title,type:x.type||'concept'}))}));});};
copy('drawing','drawing-me');
})();
