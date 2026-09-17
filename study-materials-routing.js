(()=>{
'use strict';
const p=new URLSearchParams(location.search),branchPage='/study-materials-branch.html',subjectPage='/study-materials-subject.html',topicPage='/study-materials-topic.html';
const go=(url,o)=>{const q=new URLSearchParams();Object.entries(o).forEach(([k,v])=>{if(v)q.set(k,v)});location.href=url+'?'+q.toString()};
document.addEventListener('click',e=>{const x=e.target?.closest?.('[data-open-branch],[data-subject],[data-topic]');if(!x)return;if(x.dataset.openBranch){e.preventDefault();e.stopImmediatePropagation();go(branchPage,{branch:x.dataset.openBranch});return}if(x.dataset.subject){e.preventDefault();e.stopImmediatePropagation();go(subjectPage,{branch:p.get('branch')||'',semester:p.get('semester')||'sem1',subject:x.dataset.subject});return}if(x.dataset.topic){e.preventDefault();e.stopImmediatePropagation();go(topicPage,{branch:p.get('branch')||'',semester:p.get('semester')||'sem1',subject:p.get('subject')||'',unit:p.get('unit')||'',topic:x.dataset.topic});return}},true);
})();
