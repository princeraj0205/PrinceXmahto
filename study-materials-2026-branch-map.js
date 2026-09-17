/* PrinceXmahto Study Materials — exact branch/course separation from uploaded SBTE Bihar 2026 Semester-I PDFs */
(function(){
'use strict';
const data=window.PX_STUDY_DATA;
if(!data||!data.years||!data.years[0]) return;
const year=data.years[0];
const byCode=new Map();
(year.branches||[]).forEach(b=>(b.semesters||[]).forEach(s=>(s.subjects||[]).forEach(sub=>byCode.set(sub.code,sub))));

function subject(code,title,category,units){
  if(byCode.has(code)) return byCode.get(code);
  const sub={id:code.toLowerCase().replace(/[^a-z0-9]+/g,'-'),code,title,category:category||'COURSE',units:[]};
  (units||[]).forEach((u,i)=>sub.units.push({id:sub.id+'-u'+(i+1),title:u[0],topics:(u[1]||[]).map((t,j)=>({id:sub.id+'-u'+(i+1)+'-t'+(j+1),title:t,type:'concept'}))}));
  byCode.set(code,sub); return sub;
}

const M=byCode.get('2600101');
const PHY=byCode.get('2600102B');
const FEE=byCode.get('2620103');
const AI=byCode.get('2600100');
const ICT=byCode.get('2618107');
const CONST=byCode.get('2600007');
const OER=byCode.get('2600009');

const CHEMA=subject('2600103A','Applied Chemistry- A','ASC',[
['Unit-1.0 Atomic Structure and Chemical Bonding',['1.1 Atoms and its fundamental particles','1.2 Rutherford Model of Atom','1.3 Bohr’s Theory and hydrogen spectrum explanation','1.4 Wave Mechanical model of atom and de Broglie concept','1.5 Quantum Numbers and shapes of atomic orbitals','1.6 Pauli’s Exclusion Principle and Hund’s Rule','1.7 Concept of Chemical Bonding','1.8 Dipole Moment and Hydrogen Bonding','1.9 Solutions and their strength']],
['Unit-2.0 Water',['2.1 Introduction and sources of water','2.2 Degree of hardness in terms of CaCO3','2.3 Municipal supply of water and treatment','2.4 Water Quality Index and Biological Oxygen Demand','2.5 Indian standard specification of drinking water']],
['Unit-3.0 Engineering Materials',['3.1 Natural occurrence of metals: minerals and ores','3.2 Metallurgy: general principles and processes','3.3 Extraction of Aluminium, Iron and Copper','3.4 Alloys: purpose, ferrous and non-ferrous alloys','3.5 Ancient Indian Metallurgy (IKS)','3.6 Polymers: homopolymers and copolymers','3.7 Monomers, applications and synthesis of polymers','3.8 Natural rubber and vulcanization','3.9 Cement and manufacture of Portland cement']],
['Unit-4.0 Chemistry of Fuel and Lubricants',['4.1 Fuels and characteristics of an ideal fuel','4.2 Classification of solid, liquid and gaseous fuels','4.3 Petroleum and fractional distillation','4.4 Cracking, knocking, octane number and fuel rating','4.5 Composition, uses and advantages of fuels','4.6 Manures and NPK fertilizers','4.7 Fire extinguishers and their types','4.8 Lubricants and classification','4.9 Viscosity, viscosity index, flash point and fire point']],
['Unit-5.0 Electrochemistry',['5.1 Electrolytes and non-electrolytes','5.2 Electrolysis and Faraday’s laws','5.3 Electrochemical cells and electrode potential','5.4 Corrosion and its prevention']]
]);

const MECHF=subject('2625103','Fundamentals of Mechanical Engineering','PCC',[
['Unit-1.0 Introduction to Thermodynamics',['1.1 Role of thermodynamics in engineering','1.2 Types of thermodynamic systems','1.3 Specific volume, enthalpy and pressure','1.4 Zeroth, first and second laws of thermodynamics','1.5 Enthalpy of wet and superheated steam','1.6 Modes of heat transfer: conduction, convection and radiation']],
['Unit-2.0 Internal Combustion Engine and Refrigeration',['2.1 Types of internal combustion engines: SI and CI','2.2 Construction and working of two-stroke and four-stroke engines','2.3 Brake power, heat supplied and brake thermal efficiency','2.4 Common faults in IC engines and remedial measures','2.5 Air pollution due to IC engines','2.6 Heat engine and concept of refrigeration','2.7 Major components of vapour compression refrigeration','2.8 Types of refrigerants','2.9 Types of air-conditioning systems']],
['Unit-3.0 Engineering Materials',['3.1 Metallic materials','3.2 Non-metallic materials','3.3 Mechanical properties of materials','3.4 Magnetic properties of materials','3.5 Optical properties of materials','3.6 Physical properties of materials']],
['Unit-4.0 Manufacturing Processes and Machine',['4.1 Basic machine tools','4.2 Metal joining processes','4.3 Foundry and casting process','4.4 Basic metal forming processes','4.5 Additive manufacturing techniques']],
['Unit-5.0 Engineering Applications',['5.1 Engineering applications of mechanical systems','5.2 Industrial safety and maintenance basics']]
]);

const COMM=subject('2600104','Communication Skills (English)','ASC',[
['Unit-1.0 Communication',['1.1 Communication: role, relevance and elements','1.2 Process/stages: ideation, encoding and selecting channels','1.3 7 Cs / principles of effective communication','1.4 Barriers to communication','1.5 Case studies']],
['Unit-2.0 Types of Communication',['2.1 Formal and informal communication based on organizational structure','2.2 Verbal and non-verbal communication','2.3 Communication based on number of people involved','2.4 Case studies from Bhagavad Gita']],
['Unit-3.0 Reading Comprehension',['3.1 An Astrologer’s Day — R. K. Narayan','3.2 Indian Civilization and Culture — M. K. Gandhi','3.3 The Secret of Work — Swami Vivekanand','3.4 My Struggle for an Education — Booker T. Washington','3.5 Where the Mind is without Fear — R. N. Tagore','3.6 Ode on Solitude — Alexander Pope','3.7 Stopping by Woods on a Snowy Evening — Robert Frost','3.8 A Psalm of Life — H. W. Longfellow']],
['Unit-4.0 Vocabulary and Grammar',['4.1 Word formation: prefix, suffix and acronym','4.2 Synonyms, antonyms, homonyms and one-word substitution','4.3 Technical jargons','4.4 Parts of speech','4.5 Time and tense','4.6 Transformation: voice and narration']],
['Unit-5.0 Writing Skills',['5.1 Paragraph writing','5.2 Letter and email writing','5.3 Report writing','5.4 Resume/CV writing','5.5 Technical writing basics']]
]);

const DRAW=subject('2615105','Engineering Drawing & Graphics','BEC',[
['Unit-1.0 Basic Elements of Drawing',['1.1 Drawing instruments and their uses','1.2 Types of lines, lettering and dimensioning','1.3 Geometrical constructions and scales']],
['Unit-2.0 Orthographic Projections',['2.1 Principles of orthographic projection','2.2 Projection of points and lines','2.3 Orthographic views of objects']],
['Unit-3.0 Isometric Projection',['3.1 Introduction to isometric projection','3.2 Isometric scale and natural scale','3.3 Isometric view and isometric projection','3.4 Illustrative problems','3.5 Conversion of orthographic views into isometric views']],
['Unit-4.0 Free Hand Sketches of Engineering',['4.1 Materials for sketching','4.2 General guidelines for freehand sketching','4.3 Freehand sketches of straight lines, squares and rectangles','4.4 Freehand sketches of orthographic views','4.5 Freehand sketches of isometric views','4.6 Domain-specific engineering sketches']],
['Unit-5.0 Basic Computer aided Drafting',['5.1 Basics of AutoCAD or other drafting software','5.2 Coordinate system and angular measurements','5.3 Grid, Snap, Ortho, Osnap and Units','5.4 Opening and saving drawing files','5.5 User-defined templates','5.6 Selecting and deleting objects','5.7 Undo and Redo','5.8 Creating basic drawing objects']],
['Unit-6.0 Advanced Computer aided Drafting',['6.1 Modify commands: erase, copy, move and rotate','6.2 Array and its applications','6.3 Controlling drawing display','6.4 Text and dimensioning','6.5 Layers and applications','6.6 Orthographic drawing using drafting software','6.7 Isometric drawing using drafting software','6.8 Printing and plotting of drawings']]
]);

const WORK=subject('2620105','Electrical & Electronics Workshop','BEC',[]);
const ETH=subject('2600107','Professional Ethics','NRC',[
['Unit-1.0 Professional Ethics',['1.1 Meaning and importance of professional ethics','1.2 Moral values and ethical principles','1.3 Professional responsibility and integrity']],
['Unit-2.0 Ethics at Workplace',['2.1 Workplace conduct','2.2 Teamwork and professional relationships','2.3 Conflict of interest and ethical decision making']],
['Unit-3.0 Society, Technology and Sustainability',['3.1 Ethics in engineering practice','3.2 Technology, society and environment','3.3 Sustainable and socially responsible practice']]
]);
const SPORTS=subject('2600008','Sports, Yoga and Meditation','NRC',[]);
const BEE=subject('2620104','Basic Electrical Engineering','PCC',[
['Unit-1.0 Basic Concepts of Electrical',['1.1 Electrical charge and flow of charge','1.2 Current (DC/AC): concept and sources','1.3 Voltage (DC/AC) and sources','1.4 Resistor','1.5 Heating and magnetic effects','1.6 Electrical work, power and energy']],
['Unit-2.0 Energy Storing Elements',['2.1 Capacitance formation and expression','2.2 Capacitive reactance','2.3 Energy stored in a capacitor','2.4 Voltage and current equations for capacitor','2.5 Series and parallel combination','2.6 Effect of dielectric media','2.7 Charging and discharging','2.8 Initial and final conditions','2.9 Leading power-factor behaviour','2.10 AC/DC capacitors and applications','2.11 Self and mutual inductance','2.12 Behaviour of inductor to AC/DC','2.13 Energy stored in an inductor','2.14 Voltage and current equations of inductor','2.15 Initial and final conditions in an inductor','2.16 Inductor types and applications']],
['Unit-3.0 Basics of D.C & A.C Circuits',['3.1 Ohm’s law','3.2 Internal resistance of source','3.3 Internal voltage drops and terminal voltage','3.4 Active and passive elements','3.5 Linear and non-linear circuits','3.6 Unilateral and bilateral circuit elements','3.7 Node, branch, loop and mesh','3.8 Kirchhoff’s Current Law','3.9 Kirchhoff’s Voltage Law','3.10 Frequency, time period, amplitude','3.11 Representation of AC quantities','3.12 Phasor representation','3.13 Phasor representation of sinusoidal quantities','3.14 Voltage and current response in R-L and R-C circuits']],
['Unit-4.0 Magnetic Circuits',['4.1 Magnetic flux and flux density','4.2 Magnetomotive force and reluctance','4.3 Magnetic field strength and permeability','4.4 Series and parallel magnetic circuits','4.5 Hysteresis and magnetic materials']],
['Unit-5.0 Electromagnetic Induction',['5.1 Faraday’s laws','5.2 Lenz’s law','5.3 Dynamically induced EMF','5.4 Statically induced EMF','5.5 Self and mutual induction','5.6 Applications of electromagnetic induction']]
]);
const CHEMB=subject('2600103B','Applied Chemistry- B','ASC',[
['Unit-1.0 Atomic Structure and Chemical Bonding',['1.1 Atomic structure','1.2 Chemical bonding and molecular structure','1.3 Solutions and concentration']],
['Unit-2.0 Water',['2.1 Sources and impurities of water','2.2 Hardness and water quality','2.3 Water treatment']],
['Unit-3.0 Engineering Materials',['3.1 Metals and alloys','3.2 Polymers','3.3 Natural rubber and vulcanization']],
['Unit-4.0 Solid State',['4.1 General characteristics of solid state','4.2 Classification of crystalline solids','4.3 Crystal lattice and unit cells','4.4 Imperfections and point defects','4.5 Electrical properties','4.6 Magnetic properties','4.7 X-ray diffraction','4.8 Melting point determination']],
['Unit-5.0 Electrochemistry',['5.1 Electrolytes and non-electrolytes','5.2 Electrochemical cells','5.3 Electrolysis and Faraday’s laws','5.4 Corrosion and prevention']]
]);
const EM=subject('2625104','Engineering Mechanics','PCC',[
['Unit-1.0 Mechanics and Force System',['1.1 Significance and relevance of mechanics','1.2 Space, time, mass, particle, body and rigid body','1.3 Scalar and vector quantities and units','1.4 Force: unit and representation','1.5 Resolution of a force','1.6 Composition of forces and resultant','1.7 Graphic statics']],
['Unit-2.0 Static Equilibrium',['2.1 Equilibrium and equilibrant, free body diagram','2.2 Equilibrium of force systems analytically','2.3 Lami’s theorem','2.4 Types of beam','2.5 Beam reaction for cantilever','2.6 Beam reaction for simply supported beam']],
['Unit-3.0 Friction',['3.1 Friction and its relevance in engineering','3.2 Equilibrium of bodies on level surface','3.3 Inclined plane','3.4 Equilibrium of bodies on inclined plane']],
['Unit-4.0 Centroid, Centre of Gravity and Moment',['4.1 Introduction to centroid and centre of gravity','4.2 Centroid of geometrical plane figures','4.3 Centroid of composite figures','4.4 Centre of gravity of simple solids','4.5 Centre of gravity of composite solids','4.6 Moment of inertia']],
['Unit-5.0 Simple Lifting Machine',['5.1 Simple lifting machine, load and effort','5.2 Ideal machine, friction and maximum mechanical advantage','5.3 Velocity ratios of simple axle and wheel','5.4 Load-effort graphs']]
]);

const ENV=subject('2600006','Environmental Education and Sustainable Development','NRC',[
['Unit-1.0 Ecosystem',['1.1 Aquatic and terrestrial ecosystem','1.2 Structure of ecosystem','1.3 Food chain and food web','1.4 Carbon, nitrogen, sulphur and phosphorous cycles','1.5 Global warming: causes and effects']],
['Unit-2.0 Air & Water Pollution',['2.1 Traditional pollution issues: air and water','2.2 Water pollution: sources, effects, control and standards','2.3 Air pollution: sources, pollutants, effects, monitoring and control']],
['Unit-3.0 Sustainability & Renewable Sources of Energy',['3.1 Concept of sustainable development','3.2 Renewable sources of energy','3.3 Solar energy and PV/thermal systems','3.4 Wind energy','3.5 Biomass and biogas','3.6 Hydroponics','3.7 Water conservation and sustainable practices','3.8 Hydrogen and new energy sources']],
['Unit-4.0 Climate Change and Sustainable Development',['4.1 Impact of climate change','4.2 Factors contributing to climate change','4.3 Sustainable Development Goals (SDGs)','4.4 Action Plan on Climate Change — India']],
['Unit-5.0 Environmental Legislation and Sustainable Buildings',['5.1 Environmental management system and legislation','5.2 Green building concept','5.3 Green and sustainable building materials','5.4 Environmental protection acts and legislation','5.5 Zero-carbon-footprint building']]
]);

const branches={
ce:['2600101','2600103A','2625103','2600104','2615105','2625106','2600107','2600008'],
cre:['2600101','2600103A','2625103','2600104','2615105','2625106','2600107','2600008'],
cse:['2600101','2600102B','2620103','2600100','2620105','2618107','2600007','2600009'],
ee:['2600101','2600102B','2620104','2615105','2600100','2620105','2600008','2600009'],
elx:['2600101','2600102B','2600103B','2625104','2615105','2620105','2600006'],
me:['2600101','2600103A','2600100','2600104','2625105','2600006']
};

const extra={
'2600103A':CHEMA,'2625103':MECHF,'2600104':COMM,'2615105':DRAW,'2620105':WORK,'2600107':ETH,'2600008':SPORTS,'2620104':BEE,'2600103B':CHEMB,'2625104':EM,'2600006':ENV
};
Object.keys(extra).forEach(k=>byCode.set(k,extra[k]));

(year.branches||[]).forEach(branch=>{
  const codes=branches[branch.id];
  if(!codes) return;
  branch.semesters=[{id:'sem1',title:'Semester I',subjects:codes.map(code=>byCode.get(code)).filter(Boolean)}];
});

// Keep only the six uploaded 2026 branch PDFs in this catalogue until more branch PDFs are supplied.
year.branches=(year.branches||[]).filter(b=>branches[b.id]);
window.PX_STUDY_BRANCH_MAP_2026=true;
})();
