/* PrinceXmahto Study Materials — SBTE Bihar Admission Session 2026 */
(function(){
'use strict';
const T=(id,title)=>({id,title,type:'concept'});
const U=(id,title,items)=>({id,title,topics:items.map((x,i)=>T(id+'-t'+(i+1),x))});
const S=(id,code,title,units,category)=>({id,code,title,category:category||'COURSE',units:units.map((x,i)=>U(id+'-u'+(i+1),x[0],x[1]))});
const math=S('math','2600101','Basic Engg. Mathematics',[
['Unit 1.0 — Algebra',['1.1 Concept and properties of determinant','1.2 Solutions of simultaneous equations in three unknowns by Cramer’s rule','1.3 Algebra of matrices — addition, subtraction, scalar multiplication and multiplication of two matrices','1.4 Transpose, adjoint and inverse of matrix','1.5 Solutions of simultaneous equations of order 3×3 by inversion method','1.6 Position vector','1.7 Algebra of vectors — addition, subtraction and scalar multiplication','1.8 Scalar product','1.9 Vector product','1.10 Solution of simultaneous equations using Indian Mathematics (IKS)']],
['Unit 2.0 — Differential Calculus',['2.1 Concept of function','2.2 Different types of functions','2.3 Domain and range of function','2.4 Concept of limits and evaluation','2.5 Concept of continuity with simple problems','2.6 Differentiation by first principle','2.7 Differentiation of algebraic, trigonometric, exponential and logarithmic functions','2.8 Differentiation of sum, product and quotient of two functions','2.9 Differentiation of composite functions by chain rule','2.10 Logarithmic differentiation','2.11 Implicit differentiation','2.12 Differentiation of parametric functions','2.13 Discovery of calculus by Indian astronomers (IKS)']],
['Unit 3.0 — Application of Differential Calculus',['3.1 Successive differentiation up to second order','3.2 Rolle’s Theorem and Mean Value Theorem with examples','3.3 Rate of change of quantities','3.4 Equation of tangent and normal','3.5 Maxima and minima','3.6 Radius of curvature']],
['Unit 4.0 — Co-ordinate Geometry',['4.1 Introduction of coordinate systems','4.2 Slope of a line and angle between two lines','4.3 Forms of straight line','4.4 Perpendicular distance of a line from a point and between parallel lines','4.5 Geometry in Sulabasutras — construction of square and circling the square (IKS)','4.6 Introduction of conic sections','4.7 Equation of circle in standard form','4.8 Standard equations of parabola, ellipse and hyperbola']],
['Unit 5.0 — Probability and Statistics',['5.1 Concept of probability','5.2 Addition and multiplication theorems of probability','5.3 Mean, median and mode','5.4 Range, variance and standard deviation','5.5 Coefficient of variation']]
],'ASC');
const physics=S('physics','2600102B','Applied Physics — B',[
['Unit 1.0 — Units and Measurements',['Physical quantities and SI units','Dimensions and dimensional analysis','Errors and measurements']],
['Unit 2.0 — Simple Harmonic and Wave Motion',['Simple harmonic motion','Wave motion','Wave parameters and applications']],
['Unit 3.0 — Electrostatics, Electromagnetism and Electric Current',['Electric charge and field','Electromagnetic effects','Electric current and basic relations']],
['Unit 4.0 — Semiconductor Physics',['Semiconductor materials','p-n junction','Basic semiconductor applications']],
['Unit 5.0 — Modern Physics',['Quantum concepts','Atomic and nuclear physics','Modern physics applications']]
],'ASC');
const electrical=S('fund-ee','2620103','Fundamentals of Electrical and Electronic Engg.',[
['Unit 1.0 — Basic Electrical Parameters and Concepts',['1.1 Electric charge, electric current, DC and AC, current sources','1.2 Voltage, potential difference, emf and voltage sources','1.3 Resistor — properties, classification, applications and combinations','1.4 Heating, magnetic and chemical effects of current','1.5 Capacitors — capacitance, reactance, stored energy and combinations','1.6 Inductors — inductance, reactance, stored energy and AC/DC behaviour']],
['Unit 2.0 — Fundamentals of D.C. and A.C. Circuits',['2.1 AC and DC current, voltage and power','2.2 Ohm’s law, KCL and KVL','2.3 Active/passive and linear/non-linear elements','2.4 Node, branch, loop and mesh','2.5 Frequency, RMS, average, form factor, peak factor and power factor','2.6 Phasor representation and transformations']],
['Unit 3.0 — Magnetic Circuits and Electromagnetic Induction',['3.1 Magnetic flux, MMF, field strength, permeability and reluctance','3.2 Magnetic leakage','3.3 Magnetic hysteresis and hysteresis loop','3.4 Magnetization B-H curve','3.5 Analogy between electric and magnetic circuits','3.6 Electromagnetism']],
['Unit 4.0 — Basic Electronic Components',['4.1 Semiconductor basics and p-n junction','4.2 Diode characteristics and applications','4.3 Transistor fundamentals and terminals','4.4 Active and passive components','4.5 Basic electronic circuits']],
['Unit 5.0 — Overview of Digital Electronics',['5.1 Digital and analogue signals','5.2 Number systems and conversions','5.3 Logic gates and truth tables','5.4 Boolean logic','5.5 Basic digital applications']]
],'BEC');
const ai=S('ai','2600100','Introduction to Artificial Intelligence',[
['Unit 1.0 — Introduction to IT Systems and Digital Technologies',['1.1 Digital systems, data and information','1.2 Computer hardware — CPU, memory, storage and I/O','1.3 Operating systems and file management','1.4 Cloud ecosystems and collaboration permissions','1.5 Computer networks and digital safety']],
['Unit 2.0 — Fundamentals of Artificial Intelligence',['2.1 Human vs artificial intelligence','2.2 Machine Learning — supervised, unsupervised and reinforcement learning','2.3 AI models, training/testing and lifecycle','2.4 Structured and unstructured data','2.5 Visual pattern recognition and Euclidean distance','2.6 AI capabilities and industrial applications']],
['Unit 3.0 — Core AI Applications — Computer Vision & NLP',['3.1 Computer Vision and image processing','3.2 Image segmentation and pixel analysis','3.3 Object detection and identification','3.4 Optical Character Recognition (OCR)','3.5 Natural Language Processing (NLP) and tokenization']],
['Unit 4.0 — Conversational AI and Generative Systems',['4.1 Chatbot architecture and Large Language Models','4.2 Next-word prediction, probability and context','4.3 Prompt engineering and zero-shot prompting','4.4 Industrial applications of generative AI','4.5 Zero-code generative design','4.6 Hallucinations, bias, verification, privacy, copyright and responsible use']],
['Unit 5.0 — Programming Logic & Computational Thinking using Python',['5.1 Algorithms, flowcharts and step-wise problem solving','5.2 Variables and data types','5.3 Arithmetic, relational, logical and assignment operators','5.4 input(), output and f-strings','5.5 if, if-else and nested if','5.6 for, while and range()','5.7 Python lists, indexing and append']]
],'BCC');
const ict=S('ict','2618107','ICT Tools',[
['Unit 1.0 — Word Processing',['Document creation and formatting','Tables, styles and page layout','Practical document tasks']],
['Unit 2.0 — Spreadsheets',['Cells, formulas and functions','Charts and data handling','Practical spreadsheet tasks']],
['Unit 3.0 — Presentation Tool',['Slides, layouts and themes','Images, tables and presentation design','Practical presentation tasks']],
['Unit 4.0 — Basics of Internet',['Internet and web basics','Search and information retrieval','Safe and responsible internet use']]
],'BCC');
const simple=(id,code,title,names,cat)=>S(id,code,title,names.map(x=>[x,['Key concepts','Examples and applications','Exam practice']]),cat);
const constitution=simple('constitution','2600007','Indian Constitution',['Unit 1.0 — Constitution and Preamble','Unit 2.0 — Fundamental Rights and Directive Principles','Unit 3.0 — Governance and Amendments'],'NRC');
const oer=simple('oer','2600009','Open Educational Resources',['Unit 1.0 — Open Educational Resources','Unit 2.0 — Copyright and Open Licensing','Unit 3.0 — Creative Commons Licenses'],'NRC');
const workshop=simple('workshop','2620105','Electrical & Electronics Workshop',['Unit 1.0 — Electrical and electronic workshop safety','Unit 2.0 — Components, meters and basic tools','Unit 3.0 — Wiring, soldering and PCB work'],'BEC');
const drawing=simple('drawing','2615105','Engineering Drawing & Graphics',['Unit 1.0 — Basic elements of drawing','Unit 2.0 — Orthographic projections','Unit 3.0 — Isometric projection','Unit 4.0 — CAD fundamentals'],'BEC');
const basicEE=simple('basic-ee','2620104','Basic Electrical Engg.',['Unit 1.0 — Basic concepts','Unit 2.0 — Energy storing elements','Unit 3.0 — D.C. and A.C. circuits','Unit 4.0 — Magnetic circuits','Unit 5.0 — Electromagnetism'],'PCC');
const branches=[
{id:'ce',title:'Civil Engineering',code:'CE',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,electrical,ai,ict,constitution,oer]}]},
{id:'cre',title:'Civil Engineering (Rural Engineering)',code:'CRE',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,electrical,ai,ict,constitution,oer]}]},
{id:'cse',title:'Computer Science and Engineering',code:'CSE',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,electrical,ai,workshop,ict,constitution,oer]}]},
{id:'ee',title:'Electrical Engineering',code:'EE',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,basicEE,drawing,ai,workshop,oer]}]},
{id:'elx',title:'Electronics Engineering',code:'ELX',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,electrical,ai,workshop,constitution,oer]}]},
{id:'me',title:'Mechanical Engineering',code:'ME',semesters:[{id:'sem1',title:'Semester I',subjects:[math,physics,ai,constitution,oer]}]}
];
window.PX_STUDY_DATA={years:[{id:'2026',title:'Admission Session 2026',branches}]};
})();