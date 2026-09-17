(() => {
  'use strict';

  const DATA = window.PX_STUDY_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const content = $('#content');
  const tree = $('#sideTree');
  const crumbs = $('#breadcrumbs');
  const search = $('#globalSearch');
  const year = DATA?.years?.[0];
  const STORE = 'px-study-state-v4';

  if (!DATA || !year || !content || !tree || !crumbs) {
    if (content) content.innerHTML = '<div class="empty"><h3>Study Materials could not load.</h3><p>Please refresh the page.</p></div>';
    return;
  }

  let state = { done: {}, saved: {} };
  try { state = JSON.parse(localStorage.getItem(STORE) || JSON.stringify(state)); } catch (_) {}
  const saveState = () => localStorage.setItem(STORE, JSON.stringify(state));

  const esc = (value) => String(value ?? '').replace(/[&<>\'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
  const slug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const normalizeTopic = (topic) => typeof topic === 'string'
    ? { id: slug(topic), title: topic, type: 'concept', keywords: topic, notes: null }
    : topic;

  const current = () => {
    const u = new URL(location.href);
    const out = {};
    ['branch', 'semester', 'subject', 'unit', 'topic', 'q'].forEach((k) => out[k] = u.searchParams.get(k) || '');
    return out;
  };

  const branchById = (id) => year.branches.find((b) => b.id === id) || year.branches[0];
  const getBranch = () => branchById(current().branch);
  const semById = (b, id) => b?.semesters?.find((s) => s.id === id) || b?.semesters?.[0];
  const subjectsOf = (b) => (b?.semesters || []).flatMap((s) => (s.subjects || []).map((subject) => ({ ...subject, semester: s })));
  const subjectById = (b, id) => subjectsOf(b).find((s) => s.id === id);
  const unitById = (s, id) => s?.units?.find((u) => u.id === id);
  const topicById = (u, id) => (u?.topics || []).map(normalizeTopic).find((t) => t.id === id);
  const topicKey = (b, s, u, t) => `${b.id}:${s.id}:${u.id}:${t.id || slug(t.title)}`;

  function go(params = {}, replace = false) {
    const u = new URL(location.href);
    Object.entries(params).forEach(([key, value]) => {
      if (value) u.searchParams.set(key, value);
      else u.searchParams.delete(key);
    });
    history[replace ? 'replaceState' : 'pushState']({}, '', u);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setBreadcrumbs(items) {
    crumbs.innerHTML = items.map((item, i) => {
      if (i === items.length - 1) return `<b>${esc(item.label)}</b>`;
      return `<a href="${item.href || '#'}" data-crumb="${i}">${esc(item.label)}</a><span>/</span>`;
    }).join('');
    $$('[data-crumb]', crumbs).forEach((a) => {
      a.addEventListener('click', (e) => {
        if (a.getAttribute('href') === '#') e.preventDefault();
      });
    });
  }

  function progress(b, subject) {
    let total = 0;
    let done = 0;
    (subject.units || []).forEach((unit) => (unit.topics || []).forEach((raw) => {
      const topic = normalizeTopic(raw);
      total++;
      if (state.done[topicKey(b, subject, unit, topic)]) done++;
    }));
    return total ? Math.round((done / total) * 100) : 0;
  }

  function renderTree(activeSubject = '') {
    const b = getBranch();
    tree.innerHTML = `
      <div class="tree-group-label">BRANCHES · 2026</div>
      ${year.branches.map((item) => `
        <button class="tree-btn ${item.id === b.id ? 'active' : ''}" data-branch="${esc(item.id)}">
          <span>${esc(item.title)}</span><span>›</span>
        </button>`).join('')}
      <div class="tree-group-label" style="margin-top:16px">SEMESTER I · SUBJECTS</div>
      ${(b.semesters || []).map((sem) => `
        <button class="tree-btn ${current().semester === sem.id ? 'active' : ''}" data-sem="${esc(sem.id)}">
          <span>${esc(sem.title)}</span><span>${sem.subjects?.length || 0}</span>
        </button>
        <div class="tree-sub">
          ${(sem.subjects || []).map((subject) => `
            <button class="tree-btn ${activeSubject === subject.id ? 'active' : ''}" data-sub="${esc(subject.id)}">
              <span>${esc(subject.title)}</span><small>${esc(subject.code || '')}</small>
            </button>`).join('')}
        </div>`).join('')}
    `;

    $$('[data-branch]', tree).forEach((button) => button.onclick = () => go({ branch: button.dataset.branch, semester: '', subject: '', unit: '', topic: '', q: '' }));
    $$('[data-sem]', tree).forEach((button) => button.onclick = () => go({ branch: b.id, semester: button.dataset.sem, subject: '', unit: '', topic: '', q: '' }));
    $$('[data-sub]', tree).forEach((button) => button.onclick = () => {
      const subject = subjectById(b, button.dataset.sub);
      if (subject) go({ branch: b.id, semester: subject.semester.id, subject: subject.id, unit: '', topic: '', q: '' });
    });
  }

  function notesFor(subject, unit, topic) {
    if (topic.notes) return topic.notes;
    const title = topic.title;
    const low = `${subject.title} ${unit.title} ${title}`.toLowerCase();

    let definition = `${title} is a topic included in the SBTE Bihar Admission Session 2026 first-semester curriculum.`;
    let formula = 'Write the standard formula, law, rule or procedure applicable to the exact problem.';
    let example = `Start with the given information, identify the relevant principle for ${title}, work through the steps in order, and state the final result clearly.`;

    if (/matrix/.test(low)) definition = 'A matrix is a rectangular arrangement of numbers or symbols in rows and columns. It provides a compact way to represent data and mathematical relationships.';
    else if (/determinant/.test(low)) definition = 'A determinant is a single numerical value calculated from a square matrix. It is used to study matrix properties and solve simultaneous linear equations.';
    else if (/cramer/.test(low)) definition = 'Cramer’s Rule solves a system of simultaneous linear equations using determinants, provided the coefficient determinant is non-zero.';
    else if (/limit/.test(low)) definition = 'A limit describes the value that a function approaches as its input approaches a specified value.';
    else if (/continuity/.test(low)) definition = 'A function is continuous at a point when the function value agrees with the limiting value at that point.';
    else if (/derivative|differentiation/.test(low)) { definition = 'Differentiation is the process of finding the derivative of a function. The derivative represents instantaneous rate of change and the slope of a tangent.'; formula = "f′(x) = lim(h→0) [f(x+h) − f(x)] / h"; }
    else if (/slope|straight line/.test(low)) { definition = 'The slope of a line measures its inclination and is the ratio of change in y to change in x.'; formula = 'm = (y₂ − y₁) / (x₂ − x₁)'; }
    else if (/probability/.test(low)) { definition = 'Probability measures the likelihood of an event occurring and ranges from 0 to 1.'; formula = 'P(A) = Number of favourable outcomes / Total number of equally likely outcomes'; }
    else if (/circle/.test(low)) definition = 'A circle is the locus of points in a plane that are at a fixed distance from a fixed point called the centre.';
    else if (/parabola/.test(low)) definition = 'A parabola is a conic whose points are equidistant from a fixed point called the focus and a fixed line called the directrix.';
    else if (/ellipse/.test(low)) definition = 'An ellipse is a conic for which the sum of distances from a point on the curve to two fixed foci is constant.';
    else if (/hyperbola/.test(low)) definition = 'A hyperbola is a conic for which the absolute difference of distances from a point on the curve to two fixed foci is constant.';
    else if (/artificial intelligence|\bai\b/.test(low)) definition = 'Artificial Intelligence is a field of computing concerned with systems that perform tasks involving capabilities such as learning, reasoning, perception and language.';
    else if (/internet|world wide web/.test(low)) definition = 'The Internet is a global network of interconnected networks. The World Wide Web is a service that provides linked resources over the Internet.';
    else if (/semiconductor/.test(low)) definition = 'A semiconductor is a material whose electrical conductivity lies between that of a conductor and an insulator and can be controlled for electronic applications.';

    return {
      definition,
      explanation: [
        `Meaning: understand what ${title} represents and learn the important technical terms.`,
        `Principle: identify the rule, process, law or relationship used in ${title}.`,
        `Method: write the given information first, then apply the principle step-by-step instead of jumping to the answer.`,
        `Application: connect ${title} with an engineering, laboratory, computing or everyday use whenever applicable.`
      ],
      formula,
      example,
      important: [
        'Learn the definition and key terms accurately.',
        'Write the conditions and units before applying a formula or procedure.',
        'Use a labelled diagram, flowchart or table when it improves understanding.',
        'For numerical problems, show the formula, substitution, calculation and final answer.'
      ],
      mistakes: [
        'Skipping conditions, assumptions or units.',
        'Using a formula without explaining its symbols.',
        'Writing only the final answer when working steps are expected.'
      ],
      short: [`Define ${title}.`, `State the main principle or rule of ${title}.`, `Write one application of ${title}.`],
      long: [`Explain ${title} in detail with a suitable example.`, `Describe the principle, important steps and applications of ${title}.`],
      mcq: [
        [`${title} should primarily be learned through`, 'Concept + example + practice', 'Memorisation only', 'Skipping applications', 'None'],
        ['A good numerical answer normally includes', 'Formula + working + result', 'Only the final number', 'Only the question', 'No units']
      ]
    };
  }

  function diagram(title, subject) {
    const name = `${subject.title} ${title}`.toLowerCase();
    let flow = ['Concept', 'Principle', 'Example', 'Application'];
    if (/math|calculus|algebra|geometry|probability|statistics/.test(name)) flow = ['Given', 'Formula / Rule', 'Calculation', 'Result'];
    if (/computer|internet|ict|artificial intelligence|python/.test(name)) flow = ['Input', 'Process', 'System / Tool', 'Output'];
    return `<div class="diagram-box"><div class="diagram-title">VISUAL SUMMARY · ${esc(title)}</div><div class="diagram"><div class="diagram-row">${flow.map((item, i) => `${i ? '<span class="arrow">→</span>' : ''}<div class="diagram-node">${esc(item)}</div>`).join('')}</div></div><p class="diagram-caption">Quick visual memory map. Use the full explanation below for the complete concept.</p></div>`;
  }

  function noteHtml(branch, subject, unit, topic) {
    const n = notesFor(subject, unit, topic);
    const list = (value) => Array.isArray(value) ? value : [];
    const saved = !!state.saved[topicKey(branch, subject, unit, topic)];
    const done = !!state.done[topicKey(branch, subject, unit, topic)];

    return `<article class="notes">
      <div class="section-kicker">${esc(subject.code)} · ${esc(unit.title)}</div>
      <h1>${esc(topic.title)}</h1>
      <p class="content-lead">${esc(subject.title)} · ${esc(branch.title)} · SBTE Bihar · Admission Session 2026</p>
      <div class="note-toolbar no-print">
        <button class="action-btn ${done ? 'primary' : ''}" data-done="${esc(topicKey(branch, subject, unit, topic))">${done ? '✓ Completed' : 'Mark completed'}</button>
        <button class="action-btn ${saved ? 'primary' : ''}" data-save="${esc(topicKey(branch, subject, unit, topic))">${saved ? '★ Bookmarked' : '☆ Bookmark'}</button>
        <button class="action-btn" data-print-topic="${esc(topic.id)}">Download PDF</button>
      </div>
      <div class="definition"><b>Simple Definition</b><p>${esc(n.definition)}</p></div>
      <h2>1. Concept Explanation</h2>
      <ol>${list(n.explanation).map((x) => `<li>${esc(x)}</li>`).join('')}</ol>
      ${diagram(topic.title, subject)}
      <h2>2. Formula / Rule / Key Principle</h2>
      <div class="formula">${esc(n.formula)}</div>
      <h2>3. Example / Application</h2>
      <div class="example"><b>Step-by-step understanding</b><p>${esc(n.example)}</p></div>
      <h2>4. Important Points</h2>
      <div class="important"><ul>${list(n.important).map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>
      <h2>5. Common Mistakes</h2>
      <ul>${list(n.mistakes).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      <div class="exam-box"><h2>6. Exam Practice</h2><b>Short Questions</b><ul>${list(n.short).map((x) => `<li>${esc(x)}</li>`).join('')}</ul><b>Long Questions</b><ul>${list(n.long).map((x) => `<li>${esc(x)}</li>`).join('')}</ul>${list(n.mcq).map((q, i) => `<div class="mcq"><b>MCQ ${i + 1}. ${esc(q[0])}</b>${q.slice(1).map((o, j) => `<label>${String.fromCharCode(65 + j)}. ${esc(o)}</label>`).join('')}</div>`).join('')}</div>
      <h2>7. Quick Revision</h2>
      <ul><li>Definition → principle → formula/rule → example → application.</li><li>Practise at least one basic and one exam-style question.</li><li>Revise the important points before the examination.</li></ul>
    </article>`;
  }

  function printStyles() {
    const style = document.createElement('style');
    style.id = 'pxPrintStyle';
    style.textContent = `
      @media print {
        @page { size: A4; margin: 18mm 15mm 19mm; }
        body.print-mode { background: #fff !important; }
        body.print-mode .sm-header, body.print-mode .sm-footer, body.print-mode .sidebar,
        body.print-mode .breadcrumbs, body.print-mode .subject-actions, body.print-mode .filter-row,
        body.print-mode .no-print { display:none !important; }
        body.print-mode .catalog, body.print-mode .layout, body.print-mode .content { display:block !important; width:100% !important; max-width:none !important; margin:0 !important; padding:0 !important; }
        .print-cover { min-height:245mm; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; page-break-after:always; }
        .print-cover img { width:90px; height:90px; border-radius:50%; margin-bottom:22px; }
        .print-cover h1 { font:800 30pt/1.1 Manrope,Arial,sans-serif; max-width:160mm; }
        .print-cover p { font:12pt/1.6 Arial,sans-serif; color:#555; }
        .print-page-break { page-break-before:always; }
        .notes { max-width:none !important; box-shadow:none !important; border:0 !important; border-radius:0 !important; padding:0 !important; margin:0 !important; }
        .notes h1 { font-size:25pt !important; }
        .notes h2 { font-size:15pt !important; margin-top:20px; }
        .notes p, .notes li { font-size:10.5pt !important; line-height:1.65 !important; }
        .definition, .formula, .example, .important, .exam-box, .diagram-box { break-inside:avoid; }
        .px-print-head { position:fixed; top:-13mm; left:0; right:0; display:flex; justify-content:space-between; align-items:center; gap:10px; border-bottom:1px solid #aaa; padding-bottom:4px; font:7.5pt Arial,sans-serif; color:#444; }
        .px-print-head img { width:18px; height:18px; border-radius:50%; }
        .px-print-foot { position:fixed; bottom:-14mm; left:0; right:0; display:flex; justify-content:space-between; border-top:1px solid #aaa; padding-top:4px; font:7.5pt Arial,sans-serif; color:#555; }
        .page-counter::after { content:'Page ' counter(page); }
      }
    `;
    document.head.appendChild(style);
  }

  function removePrintStuff() {
    $('#pxPrintFrame')?.remove();
    $('#pxPrintStyle')?.remove();
  }

  function doPrint(subject, unit, branch, topics, title) {
    const old = content.innerHTML;
    document.body.classList.add('print-mode');
    content.innerHTML = `<div class="print-document"><div class="print-cover"><img src="/assets/princexmahto-logo.svg" alt="PrinceXmahto"><div class="section-kicker">PRINCEXMAHTO · STUDY MATERIALS</div><h1>${esc(title)}</h1><p>${esc(subject.title)} · ${esc(branch.title)} · SBTE Bihar · Admission Session 2026</p><span>Detailed Notes · A4 PDF Edition</span></div>${topics.map((t) => noteHtml(branch, subject, unit, t)).join('<div class="print-page-break"></div>')}</div>`;

    const frame = document.createElement('div');
    frame.id = 'pxPrintFrame';
    frame.innerHTML = `<div class="px-print-head"><img src="/assets/princexmahto-logo.svg" alt=""><span>PrinceXmahto · Study Materials</span><span>SBTE Bihar · 2026</span></div><div class="px-print-foot"><span>${esc(subject.code)} · ${esc(unit.title)}</span><span>Learn · Practise · Revise · <i class="page-counter"></i></span></div>`;
    document.body.appendChild(frame);
    printStyles();

    let restored = false;
    const restore = () => {
      if (restored) return;
      restored = true;
      document.body.classList.remove('print-mode');
      removePrintStuff();
      content.innerHTML = old;
      render();
      window.removeEventListener('afterprint', restore);
    };
    window.addEventListener('afterprint', restore);
    setTimeout(() => window.print(), 250);
  }

  function printUnit(subject, unit) {
    doPrint(subject, unit, getBranch(), (unit.topics || []).map(normalizeTopic), unit.title);
  }

  function printSubject(subject) {
    const allTopics = (subject.units || []).flatMap((unit) => (unit.topics || []).map(normalizeTopic));
    const pseudoUnit = { id: 'complete', title: `Complete Notes · ${subject.title}`, topics: allTopics };
    doPrint(subject, pseudoUnit, getBranch(), allTopics, `${subject.title} · Complete Notes`);
  }

  function printTopic(subject, unit, topic) {
    doPrint(subject, unit, getBranch(), [topic], topic.title);
  }

  function branchCard(branch) {
    const subjects = subjectsOf(branch);
    return `<article class="card branch-card"><div class="card-top"><span class="code">${esc(branch.code || 'DIPLOMA')}</span><span class="pill">ADMISSION 2026</span></div><h3>${esc(branch.title)}</h3><p>${subjects.length} Semester I subjects · Units · Topics · Detailed Notes</p><div class="card-foot"><span>SBTE Bihar · Semester I</span><button class="open-btn" data-open-branch="${esc(branch.id)}">OPEN BRANCH →</button></div></article>`;
  }

  function renderHome() {
    const b = getBranch();
    setBreadcrumbs([{ label: 'Study Materials' }, { label: 'Diploma' }, { label: '1st Year' }]);
    renderTree('');
    content.innerHTML = `
      <div class="section-kicker">DIPLOMA · 1ST YEAR · SEMESTER I</div>
      <h2>Choose your branch.</h2>
      <p class="content-lead">Start with your branch, open a subject, then choose a unit and topic to read the notes. Every unit and subject also has an A4 PDF option.</p>
      <div class="filter-row"><span class="filter">${year.branches.length} branches</span><span class="filter">Semester I</span><span class="filter">Detailed Notes</span><span class="filter">Unit-wise PDF</span></div>
      <div class="cards">${year.branches.map(branchCard).join('')}</div>
      <div class="study-how"><div><b>01</b><strong>Choose branch</strong><span>Select your Diploma branch.</span></div><div><b>02</b><strong>Choose subject</strong><span>Open syllabus units and topics.</span></div><div><b>03</b><strong>Read notes</strong><span>Learn, revise and practise.</span></div><div><b>04</b><strong>Download PDF</strong><span>Save A4 notes with your logo.</span></div></div>`;
    $$('.branch-card [data-open-branch]').forEach((button) => button.onclick = () => go({ branch: button.dataset.openBranch, semester: '', subject: '', unit: '', topic: '', q: '' }));
  }

  function renderBranch() {
    const b = getBranch();
    setBreadcrumbs([{ label: 'Study Materials' }, { label: 'Diploma' }, { label: '1st Year' }, { label: b.title }]);
    renderTree('');
    const subjects = subjectsOf(b);
    content.innerHTML = `<div class="section-kicker">${esc(b.code)} · SEMESTER I</div><h2>${esc(b.title)}</h2><p class="content-lead">All Semester I subjects for SBTE Bihar Admission Session 2026. Open any subject to see its units, topics, notes and PDF downloads.</p><div class="filter-row"><span class="filter">${subjects.length} subjects</span><span class="filter">Admission 2026</span><span class="filter">Notes + Practice</span></div><div class="cards subject-cards">${subjects.map((s) => `<article class="card"><div class="card-top"><span class="code">${esc(s.code || '')}</span><span class="pill">${esc(s.category || 'SUBJECT')}</span></div><h3>${esc(s.title)}</h3><p>${(s.units || []).length} units · ${(s.units || []).reduce((n, u) => n + (u.topics || []).length, 0)} topics · ${progress(b, s)}% complete</p><div class="card-foot"><span>${esc(s.semester.title)}</span><button class="open-btn" data-open-sub="${esc(s.id)}">OPEN SUBJECT →</button></div></article>`).join('')}</div>`;
    $$('[data-open-sub]').forEach((button) => {
      const s = subjectById(b, button.dataset.openSub);
      if (s) button.onclick = () => go({ branch: b.id, semester: s.semester.id, subject: s.id, unit: '', topic: '', q: '' });
    });
  }

  function renderSubject() {
    const c = current();
    const b = getBranch();
    const s = subjectById(b, c.subject);
    if (!s) return renderBranch();
    const sem = s.semester;
    setBreadcrumbs([{ label: 'Study Materials' }, { label: b.title }, { label: sem.title }, { label: s.title }]);
    renderTree(s.id);

    content.innerHTML = `<div class="subject-head"><div><div class="section-kicker">${esc(s.code || '')} · ${esc(s.category || 'SUBJECT')}</div><h2>${esc(s.title)}</h2><p class="content-lead">${esc(b.title)} · ${esc(sem.title)} · SBTE Bihar Admission Session 2026</p></div><div class="subject-actions"><button class="action-btn primary" id="downloadSubject">DOWNLOAD COMPLETE PDF</button><button class="action-btn" data-back-branch>← Subjects</button></div></div><div class="filter-row"><span class="filter">${(s.units || []).length} units</span><span class="filter">${(s.units || []).reduce((n, u) => n + (u.topics || []).length, 0)} topics</span><span class="filter">${progress(b, s)}% complete</span><span class="filter">A4 PDF</span></div><div class="unit-list">${(s.units || []).map((unit, index) => `<article class="unit-card"><div class="unit-head"><div><small>UNIT ${index + 1}</small><h3>${esc(unit.title)}</h3></div><button class="action-btn" data-print-unit="${esc(unit.id)}">DOWNLOAD UNIT PDF</button></div><div class="topic-grid">${(unit.topics || []).map((raw) => { const t = normalizeTopic(raw); return `<button class="topic" data-topic="${esc(t.id)}"><strong>${esc(t.title)}</strong><span>${esc(t.type || 'concept')} · Read detailed notes →</span></button>`; }).join('')}</div></article>`).join('')}</div>`;

    $('#downloadSubject').onclick = () => printSubject(s);
    $('[data-back-branch]').onclick = () => go({ branch: b.id, semester: '', subject: '', unit: '', topic: '', q: '' });
    $$('[data-print-unit]').forEach((button) => { const u = unitById(s, button.dataset.printUnit); if (u) button.onclick = () => printUnit(s, u); });
    $$('[data-topic]').forEach((button) => { const u = (s.units || []).find((unit) => topicById(unit, button.dataset.topic)); if (u) button.onclick = () => go({ branch: b.id, semester: sem.id, subject: s.id, unit: u.id, topic: button.dataset.topic, q: '' }); });
  }

  function renderUnit() {
    const c = current();
    const b = getBranch();
    const s = subjectById(b, c.subject);
    const u = unitById(s, c.unit);
    if (!s || !u) return renderSubject();
    setBreadcrumbs([{ label: 'Study Materials' }, { label: b.title }, { label: s.title }, { label: u.title }]);
    renderTree(s.id);
    content.innerHTML = `<div class="subject-head"><div><div class="section-kicker">${esc(s.code || '')} · UNIT</div><h2>${esc(u.title)}</h2><p class="content-lead">Choose a topic to open full notes.</p></div><div class="subject-actions"><button class="action-btn primary" id="downloadUnit">DOWNLOAD UNIT PDF</button></div></div><div class="topic-grid unit-topic-grid">${(u.topics || []).map((raw) => { const t = normalizeTopic(raw); return `<button class="topic" data-topic="${esc(t.id)}"><strong>${esc(t.title)}</strong><span>Detailed notes · Example · Exam practice →</span></button>`; }).join('')}</div>`;
    $('#downloadUnit').onclick = () => printUnit(s, u);
    $$('[data-topic]').forEach((button) => button.onclick = () => go({ branch: b.id, semester: s.semester.id, subject: s.id, unit: u.id, topic: button.dataset.topic, q: '' }));
  }

  function renderTopic() {
    const c = current();
    const b = getBranch();
    const s = subjectById(b, c.subject);
    const u = unitById(s, c.unit);
    const t = topicById(u, c.topic);
    if (!s || !u || !t) return renderSubject();
    setBreadcrumbs([{ label: 'Study Materials' }, { label: b.title }, { label: s.title }, { label: u.title }, { label: t.title }]);
    renderTree(s.id);
    content.innerHTML = noteHtml(b, s, u, t);

    const key = topicKey(b, s, u, t);
    $('[data-done]')?.addEventListener('click', () => { state.done[key] = !state.done[key]; saveState(); renderTopic(); });
    $('[data-save]')?.addEventListener('click', () => { state.saved[key] = !state.saved[key]; saveState(); renderTopic(); });
    $('[data-print-topic]')?.addEventListener('click', () => printTopic(s, u, t));
  }

  function renderSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return renderHome();
    const results = [];
    year.branches.forEach((b) => (b.semesters || []).forEach((sem) => (sem.subjects || []).forEach((s) => {
      const subjectMatch = `${b.title} ${s.title} ${s.code || ''}`.toLowerCase().includes(q);
      (s.units || []).forEach((u) => (u.topics || []).forEach((raw) => {
        const t = normalizeTopic(raw);
        const hay = `${b.title} ${s.title} ${s.code || ''} ${u.title} ${t.title} ${t.keywords || ''}`.toLowerCase();
        if (subjectMatch || hay.includes(q)) results.push({ b, sem, s, u, t });
      }));
    })));

    setBreadcrumbs([{ label: 'Study Materials' }, { label: 'Search' }, { label: query }]);
    renderTree('');
    content.innerHTML = `<div class="section-kicker">SEARCH RESULTS</div><h2>Results for “${esc(query)}”</h2><p class="content-lead">${results.length} matching topics found across the 2026 first-semester catalogue.</p><div class="search-results">${results.length ? results.map((r) => `<button class="result" data-result="${esc(r.b.id)}|${esc(r.s.id)}|${esc(r.u.id)}|${esc(r.t.id)}"><strong>${esc(r.t.title)}</strong><small>${esc(r.b.title)} · ${esc(r.s.title)} · ${esc(r.u.title)} · ${esc(r.s.code || '')}</small></button>`).join('') : '<div class="empty"><h3>No matching notes found.</h3><p>Try a branch, subject name, course code, unit or topic.</p></div>'}</div>`;
    $$('[data-result]').forEach((button) => {
      button.onclick = () => { const [branchId, subjectId, unitId, topicId] = button.dataset.result.split('|'); const b = branchById(branchId); const s = subjectById(b, subjectId); go({ branch: b.id, semester: s.semester.id, subject: s.id, unit: unitId, topic: topicId, q: '' }); };
    });
  }

  function render() {
    const c = current();
    if (c.q) return renderSearch(c.q);
    if (!c.branch && !c.subject && !c.unit && !c.topic) return renderHome();
    if (c.topic) return renderTopic();
    if (c.unit) return renderUnit();
    if (c.subject) return renderSubject();
    return renderBranch();
  }

  search?.addEventListener('input', () => {
    const q = search.value.trim();
    const u = new URL(location.href);
    if (q) u.searchParams.set('q', q); else u.searchParams.delete('q');
    history.replaceState({}, '', u);
    clearTimeout(window.__pxSearchTimer);
    window.__pxSearchTimer = setTimeout(render, 120);
  });
  search?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); renderSearch(search.value); } });
  document.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); search?.focus(); } });
  window.addEventListener('popstate', render);

  render();
})();