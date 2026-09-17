/*
 * PX Study Materials — SBTE Bihar · Admission Session 2026
 * Source basis: uploaded SBTE Bihar first-semester curriculum PDFs.
 * Architecture: year -> branch -> semester -> subject -> unit -> topic -> notes
 */

const rich = {
  determinants:{
    id:'determinants', title:'Determinants — concept, properties and applications', type:'concept',
    keywords:'determinant matrix algebra',
    notes:{
      definition:'A determinant is a single numerical value associated with a square matrix. It is useful for checking whether a matrix is invertible and for solving systems of linear equations.',
      explanation:[
        'For a 2×2 matrix A = [[a,b],[c,d]], det(A) = ad − bc.',
        'For a 3×3 determinant, expansion can be carried out using minors and cofactors.',
        'If det(A)=0, the square matrix is singular; if det(A)≠0, it is non-singular.'
      ],
      important:['Only square matrices have determinants.','Interchanging two rows changes the sign of a determinant.','If two rows are identical, the determinant is zero.'],
      formula:'|a b; c d| = ad − bc',
      example:'For A=[[2,3],[1,4]], det(A)=2×4−3×1=5.',
      mistakes:['Confusing a determinant with the matrix itself.','Forgetting the sign pattern while expanding a 3×3 determinant.'],
      short:['What is a determinant?','When is a matrix singular?'],
      long:['Explain determinant properties with suitable examples.'],
      mcq:[['A determinant is defined for','Square matrices','Only row matrices','Only column matrices','None'],['If det(A)=0, A is','Singular','Identity','Orthogonal','Diagonal']]
    }, diagram:'determinant'
  },
  cramers:{
    id:'cramers-rule', title:'Cramer’s Rule', type:'problem', keywords:'Cramer rule simultaneous equations determinants',
    notes:{
      definition:'Cramer’s Rule is a determinant-based method for solving simultaneous linear equations when the coefficient determinant is non-zero.',
      explanation:[
        'Write the equations in standard form and form the coefficient determinant D.',
        'Replace the x, y and z columns by the constants to obtain Dx, Dy and Dz.',
        'For D≠0, x=Dx/D, y=Dy/D and z=Dz/D.'
      ],
      formula:'x = Dx/D,  y = Dy/D,  z = Dz/D',
      important:['Always check D≠0 before dividing.','Replace the correct variable column.'],
      example:'For a system of two simultaneous equations, form D and the corresponding replaced-column determinants, then divide each by D.',
      short:['State Cramer’s Rule.','What condition is required?'],
      long:['Solve simultaneous equations using Cramer’s Rule.'],
      mcq:[['Cramer’s Rule requires','D≠0','D=0','A non-square matrix','No determinant']]
    }, diagram:'cramer'
  },
  matrices:{
    id:'matrices', title:'Matrices — operations, transpose, adjoint and inverse', type:'concept',
    keywords:'matrix operations inverse adjoint transpose',
    notes:{
      definition:'A matrix is a rectangular arrangement of numbers or symbols in rows and columns.',
      explanation:[
        'Matrices can be added or subtracted only when their orders are the same.',
        'Matrix multiplication is possible when the number of columns of the first matrix equals the number of rows of the second.',
        'Transpose interchanges rows and columns. For a non-singular square matrix, A⁻¹ = adj(A)/|A|.'
      ],
      formula:'A⁻¹ = adj(A) / |A|, when |A| ≠ 0',
      important:['AB is not generally equal to BA.','An inverse exists only for a non-singular square matrix.'],
      example:'For A=[[1,2],[3,4]], |A|=−2, so A is invertible.',
      mistakes:['Multiplying corresponding elements instead of row-by-column multiplication.','Using the inverse formula when determinant is zero.'],
      short:['Define transpose.','When does an inverse exist?'],
      long:['Explain matrix multiplication and inverse with examples.'],
      mcq:[['AB generally equals BA','False','True','Only for all matrices','Always']]
    }, diagram:'matrix'
  }
};

function genericTopic(id, title, keywords='') {
  return {
    id, title, type:'concept', keywords,
    notes:{
      definition:`${title} is a syllabus topic in the SBTE Bihar Admission Session 2026 first-semester syllabus.`,
      explanation:[
        `Understand the meaning and scope of ${title} before memorising points.`,
        'Break the topic into definition, principle/process, important terms and application.',
        'For examinations, present the answer in a logical order and add a labelled diagram or example where the topic requires one.'
      ],
      important:['Learn definitions and technical terms accurately.','Write formulas with the meaning of symbols and required conditions.','Use labelled diagrams for systems, processes and engineering objects when applicable.'],
      formula:'Use the standard formula, law, rule or equation specified for the exact problem.',
      example:`Prepare one basic example for ${title}, then practise a second question without looking at the notes.`,
      mistakes:['Skipping conditions or units.','Using a formula without identifying its symbols.','Writing only the final answer without the required working.'],
      short:[`Define ${title}.`,`State one important point/application of ${title}.`],
      long:[`Explain ${title} in detail with a suitable example.`],
      mcq:[[`${title} should be learned through`,'Understanding + practice','Memorising only','Skipping examples','None']]
    }
  };
}

function units(prefix, names) {
  return names.map((title,i)=>({
    id:`${prefix}-u${i+1}`,
    title:`Unit ${i+1} — ${title}`,
    topics:[genericTopic(`${prefix}-t${i+1}`, title, title.toLowerCase())]
  }));
}

const commonMath = {
  id:'math', code:'2600101', title:'Basic Engg. Mathematics', category:'ASC',
  units:[
    {id:'math-u1',title:'Unit 1 — Algebra',weightage:'12 marks',topics:[rich.determinants,rich.cramers,rich.matrices]},
    {id:'math-u2',title:'Unit 2 — Differential Calculus',weightage:'14 marks',topics:[genericTopic('math-u2-t1','Differential Calculus','limits continuity differentiation')]},
    {id:'math-u3',title:'Unit 3 — Application of Differential Calculus',weightage:'12 marks',topics:[genericTopic('math-u3-t1','Application of Differential Calculus','successive differentiation Rolle mean value theorem maxima minima')]},
    {id:'math-u4',title:'Unit 4 — Co-ordinate Geometry',weightage:'14 marks',topics:[genericTopic('math-u4-t1','Co-ordinate Geometry','straight line circle parabola ellipse hyperbola')]},
    {id:'math-u5',title:'Unit 5 — Probability and Statistics',weightage:'18 marks',topics:[genericTopic('math-u5-t1','Probability and Statistics','probability mean median mode variance standard deviation')]}
  ]
};

const physics = {id:'physics',code:'2600102B',title:'Applied Physics – B',category:'ASC',units:units('physics',['Unit and Measurements','Simple Harmonic and Wave Motion','Electrostatics, Electromagnetism and Electric Current','Semiconductor Physics','Modern Physics']).map((u,i)=>({...u,title:`Unit ${i+1} — ${u.title.replace(/^Unit \d+ — /,'')}`}));

function subject(id,code,title,category,unitNames){ return {id,code,title,category,units:units(id,unitNames)}; }

const common = {
  communication: subject('communication','2600104','Communication Skills (English)','HSC',['Communication','Types of Communication','Reading Comprehension','Vocabulary and Grammar','Professional Writing']),
  drawingCE: subject('drawing-ce','2615105','Engineering Drawing & Graphics','BEC',['Basic Elements of Drawing','Orthographic Projections','Isometric Projection','Free Hand Sketches of Engineering Elements','Basic Computer aided Drafting','Advanced Computer aided Drafting']),
  drawingME: subject('drawing-me','2625105','Engineering Drawing','BEC',['Basic Elements of Drawing','Elements of Orthographic Projections','Orthographic Projection of Un-Sectioned and Sectioned Solids','Isometric Projection','Development of Surfaces','Free Hand Sketches of Engineering']),
  ai: subject('ai','2600100','Introduction to Artificial Intelligence','BCC',['Introduction to IT Systems and Digital Technologies','Fundamentals of Artificial Intelligence','Core AI Applications - Computer Vision & NLP','Conversational AI and Generative Systems','Programming Logic & Computational Thinking using Python']),
  oER: subject('oer','2600009','Open Educational Resources (OER)','NRC',['Open Educational Resources','Copyright and Open Licensing','Creative Common Licenses']),
  constitution: subject('constitution','2600007','Indian Constitution','NRC',['Constitution and Preamble','Fundamental Rights and Directive Principles','Governance and Amendments']),
  sports: subject('sports','2600008','Sports, Yoga and Meditation','NRC',['Sports and Exercises','Yoga and Meditation','Fitness and Wellness']),
  ethics: subject('ethics','2600107','Professional Ethics','NRC',['Values and Ethics in Day to Day Life','Values and Ethics in Profession']),
  env: subject('environment','2600006','Environmental Education and Sustainable Development','NRC',['Ecosystem','Air & Water Pollution','Sustainability & Renewable Sources of Energy','Climate Change and Sustainable Development','Environmental legislation and Sustainable Building Practices']),
  chemA: subject('chem-a','2600103A','Applied Chemistry -A','ASC',['Atomic Structure and Chemical Bonding and Solutions','Water','Engineering materials','Chemistry of Fuel and Lubricants','Electrochemistry']),
  chemB: subject('chem-b','2600103B','Applied Chemistry- B','ASC',['Atomic Structure and Chemical Bonding','Water','Engineering Materials','Solid State','Electrochemistry']),
  mechFund: subject('mech-fund','2625103','Fundamentals of Mechanical Engineering','BEC',['Introduction to Thermodynamics','Internal Combustion Engine and Refrigeration','Engineering Materials','Manufacturing Processes and Machine Tools','Power Transmission']),
  mechanics: subject('mechanics','2625104','Engineering Mechanics','BEC',['Mechanics and Force System','Static Equilibrium','Friction','Centroid, Centre of Gravity and Moment of Inertia','Simple Lifting Machine']),
  basicEE: subject('basic-ee','2620104','Basic Electrical Engineering','PCC',['Basic Concepts of Electrical','Energy Storing Elements','Basics of D.C & A.C Circuits','Magnetic Circuits','Electromagnetism']),
  elecWorkshop: subject('elec-workshop','2620105','Electrical and Electronics Workshop','BEC',[]),
  mechWorkshop: subject('mech-workshop','2625106','Mechanical Workshop','BEC',[])
};

const branches = [
  {id:'ce',title:'Civil Engineering',code:'CE',semesters:[{id:'sem1',title:'Semester I',subjects:[commonMath,common.chemA,common.mechFund,common.communication,common.drawingCE,common.mechWorkshop,common.ethics,common.sports]}]},
  {id:'cre',title:'Civil Engineering (Rural Engineering)',code:'CRE',semesters:[{id:'sem1',title:'Semester I',subjects:[commonMath,common.chemA,common.mechFund,common.communication,common.drawingCE,common.mechWorkshop,common.ethics,common.sports]}]},
  {id:'cse',title:'Computer Science & Engineering',code:'CSE',semesters:[{id:'sem1',title:'Semester I',subjects:[
    commonMath,physics,
    subject('fund-ee','2620103','Fundamentals of Electrical and Electronic Engg.','BEC',['Basic Electrical Parameters and Concepts','Fundamentals of D.C. and A.C. Circuits','Magnetic Circuits and Electromagnetic Induction','Basic Electronic Components','Overview of Digital Electronics']),
    common.ai,common.elecWorkshop,subject('ict','2618107','ICT Tools','BCC',['Word Processing','Spreadsheets','Presentation Tool','Basics of Internet']),common.constitution,common.oER
  ]}]},
  {id:'ee',title:'Electrical Engineering',code:'EE',semesters:[{id:'sem1',title:'Semester I',subjects:[commonMath,physics,common.basicEE,common.drawingCE,common.ai,common.elecWorkshop,common.sports,common.oER]}]},
  {id:'elx',title:'Electronics Engineering',code:'ELX',semesters:[{id:'sem1',title:'Semester I',subjects:[commonMath,physics,common.chemB,common.mechanics,common.drawingCE,{...common.elecWorkshop,category:'PCC'},common.env]}]},
  {id:'me',title:'Mechanical Engineering',code:'ME',semesters:[{id:'sem1',title:'Semester I',subjects:[commonMath,common.chemA,common.ai,common.communication,common.drawingME,common.env]}]}
];

window.PX_STUDY_DATA = {
  meta:{name:'Diploma Study Materials',board:'SBTE Bihar',session:'Admission Session 2026',scope:'First Semester',source:'Uploaded SBTE Bihar curriculum PDFs'},
  years:[{id:'diploma-1',title:'1st Year',subtitle:'Semester I · Admission Session 2026',branches}]
};
