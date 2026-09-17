(()=>{
'use strict';
const p=new URLSearchParams(location.search),branchPage='/study-materials-branch.html',subjectPage='/study-materials-subject.html',topicPage='/study-materials-topic.html';
const go=(url,o)=>{const q=new URLSearchParams();Object.entries(o).forEach(([k,v])=>{if(v)q.set(k,v)});location.href=url+'?'+q.toString()};
document.addEventListener('click',e=>{
 const x=e.target?.closest?.('[data-open-branch],[data-b],[data-subject],[data-s],[data-topic],[data-hit]');if(!x)return;
 if(x.dataset.openBranch||x.dataset.b){e.preventDefault();e.stopImmediatePropagation();go(branchPage,{branch:x.dataset.openBranch||x.dataset.b});return}
 if(x.dataset.subject||x.dataset.s){e.preventDefault();e.stopImmediatePropagation();go(subjectPage,{branch:p.get('branch')||x.closest('[data-b]')?.dataset.b||'',semester:p.get('semester')||'sem1',subject:x.dataset.subject||x.dataset.s});return}
 if(x.dataset.topic){e.preventDefault();e.stopImmediatePropagation();go(topicPage,{branch:p.get('branch')||'',semester:p.get('semester')||'sem1',subject:p.get('subject')||'',unit:p.get('unit')||'',topic:x.dataset.topic});return}
 if(x.dataset.hit){e.preventDefault();e.stopImmediatePropagation();const [b,s,u,t]=x.dataset.hit.split('|');go(topicPage,{branch:b,semester:'sem1',subject:s,unit:u,topic:t});return}
},true);
})();
