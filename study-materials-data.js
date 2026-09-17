/* PX Study Materials - SBTE Bihar - Admission Session 2026 */
(function () {
  'use strict';

  function topic(id, title) {
    return { id: id, title: title, type: 'concept', notes: null };
  }

  function unit(id, title, topics) {
    return { id: id, title: title, topics: topics.map(function (x, i) { return topic(id + '-t' + (i + 1), x); }) };
  }

  function subject(id, code, title, units) {
    return { id: id, code: code, title: title, category: 'COURSE', units: units.map(function (x, i) { return unit(id + '-u' + (i + 1), 'Unit ' + (i + 1) + ' - ' + x, [x]); }) };
  }

  var math = {
    id: 'math', code: '2600101', title: 'Basic Engineering Mathematics', category: 'ASC',
    units: [
      { id: 'math-u1', title: 'Unit 1 - Algebra', topics: [
        topic('determinants', 'Determinants'), topic('cramers-rule', "Cramer's Rule"), topic('matrices', 'Matrices'), topic('vectors', 'Vectors'), topic('complex-numbers', 'Complex Numbers')
      ]},
      { id: 'math-u2', title: 'Unit 2 - Differential Calculus', topics: [topic('limits', 'Limits'), topic('continuity', 'Continuity'), topic('differentiation', 'Differentiation')] },
      { id: 'math-u3', title: 'Unit 3 - Application of Differential Calculus', topics: [topic('successive-differentiation', 'Successive Differentiation'), topic('rolle-mvt', "Rolle's Theorem and Mean Value Theorem"), topic('maxima-minima', 'Maxima and Minima')] },
      { id: 'math-u4', title: 'Unit 4 - Coordinate Geometry', topics: [topic('straight-line', 'Straight Line'), topic('circle', 'Circle'), topic('parabola', 'Parabola'), topic('ellipse', 'Ellipse'), topic('hyperbola', 'Hyperbola')] },
      { id: 'math-u5', title: 'Unit 5 - Probability and Statistics', topics: [topic('probability', 'Probability'), topic('mean', 'Mean'), topic('median-mode', 'Median and Mode'), topic('variance-sd', 'Variance and Standard Deviation')] }
    ]
  };

  var physics = subject('physics', '2600102B', 'Applied Physics - B', [
    'Units and Measurements', 'Simple Harmonic and Wave Motion', 'Electrostatics, Electromagnetism and Electric Current', 'Semiconductor Physics', 'Modern Physics'
  ]);
  var electrical = subject('fund-ee', '2620103', 'Fundamentals of Electrical and Electronic Engineering', [
    'Basic Electrical Parameters and Concepts', 'Fundamentals of D.C. and A.C. Circuits', 'Magnetic Circuits and Electromagnetic Induction', 'Basic Electronic Components', 'Overview of Digital Electronics'
  ]);
  var ai = subject('ai', '2600100', 'Introduction to Artificial Intelligence', [
    'Introduction to IT Systems and Digital Technologies', 'Fundamentals of Artificial Intelligence', 'Core AI Applications - Computer Vision and NLP', 'Conversational AI and Generative Systems', 'Programming Logic and Computational Thinking using Python'
  ]);
  var ict = subject('ict', '2618107', 'ICT Tools', ['Word Processing', 'Spreadsheets', 'Presentation Tool', 'Basics of Internet']);
  var constitution = subject('constitution', '2600007', 'Indian Constitution', ['Constitution and Preamble', 'Fundamental Rights and Directive Principles', 'Governance and Amendments']);
  var oer = subject('oer', '2600009', 'Open Educational Resources (OER)', ['Open Educational Resources', 'Copyright and Open Licensing', 'Creative Commons Licenses']);
  var communication = subject('communication', '2600104', 'Communication Skills (English)', ['Communication', 'Types of Communication', 'Reading Comprehension', 'Vocabulary and Grammar', 'Professional Writing']);
  var chemistry = subject('chemistry', '2600103A', 'Applied Chemistry - A', ['Atomic Structure and Chemical Bonding and Solutions', 'Water', 'Engineering Materials', 'Chemistry of Fuel and Lubricants', 'Electrochemistry']);
  var basicEE = subject('basic-ee', '2620104', 'Basic Electrical Engineering', ['Basic Concepts of Electrical', 'Energy Storing Elements', 'Basics of D.C. and A.C. Circuits', 'Magnetic Circuits', 'Electromagnetism']);
  var drawing = subject('drawing', '2615105', 'Engineering Drawing and Graphics', ['Basic Elements of Drawing', 'Orthographic Projections', 'Isometric Projection', 'Free Hand Sketches of Engineering Elements', 'Basic Computer Aided Drafting', 'Advanced Computer Aided Drafting']);
  var env = subject('environment', '2600006', 'Environmental Education and Sustainable Development', ['Ecosystem', 'Air and Water Pollution', 'Sustainability and Renewable Sources of Energy', 'Climate Change and Sustainable Development', 'Environmental Legislation and Sustainable Building Practices']);
  var mechanics = subject('mechanics', '2625104', 'Engineering Mechanics', ['Mechanics and Force System', 'Static Equilibrium', 'Friction', 'Centroid, Centre of Gravity and Moment of Inertia', 'Simple Lifting Machine']);
  var mechFund = subject('mech-fund', '2625103', 'Fundamentals of Mechanical Engineering', ['Introduction to Thermodynamics', 'Internal Combustion Engine and Refrigeration', 'Engineering Materials', 'Manufacturing Processes and Machine Tools', 'Power Transmission']);

  var branches = [
    { id: 'ce', title: 'Civil Engineering', code: 'CE', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, chemistry, mechFund, communication, drawing, env] }] },
    { id: 'cre', title: 'Civil Engineering (Rural Engineering)', code: 'CRE', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, chemistry, mechFund, communication, drawing, env] }] },
    { id: 'cse', title: 'Computer Science and Engineering', code: 'CSE', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, physics, electrical, ai, ict, constitution, oer] }] },
    { id: 'ee', title: 'Electrical Engineering', code: 'EE', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, physics, basicEE, drawing, ai, oer] }] },
    { id: 'elx', title: 'Electronics Engineering', code: 'ELX', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, physics, chemistry, mechanics, basicEE, env] }] },
    { id: 'me', title: 'Mechanical Engineering', code: 'ME', semesters: [{ id: 'sem1', title: 'Semester I', subjects: [math, chemistry, ai, communication, drawing, mechanics] }] }
  ];

  window.PX_STUDY_DATA = {
    meta: { name: 'Diploma Study Materials', board: 'SBTE Bihar', session: 'Admission Session 2026', scope: 'First Semester' },
    years: [{ id: 'diploma-1', title: '1st Year', subtitle: 'Semester I - Admission Session 2026', branches: branches }]
  };
})();
