const lessons=[
{week:1,icon:"💡",title:"Introduction to Digital Technology",desc:"Meaning, importance in modern life, and examples of digital devices."},
{week:2,icon:"🕰️",title:"Historical Development of Digital Devices",desc:"Abacus, Napier's Bones, generations of computers and modern digital trends."},
{week:3,icon:"💼",title:"Career Opportunities in Information Technology",desc:"ICT careers, emerging careers (AI, cybersecurity, robotics) and skills needed."},
{week:4,icon:"⌨️",title:"Basic Computer Hardware Components I",desc:"Input and output devices, their functions and simple maintenance."},
{week:6,icon:"💾",title:"Basic Computer Hardware Components II: Storage Units",desc:"Primary and secondary storage, RAM, ROM, flash drives and storage measurements."},
{week:8,icon:"🧠",title:"Basic Software Concepts",desc:"System and application software, and the functions of an operating system."},
{week:9,icon:"⏻",title:"Computer Booting and Shutdown Processes",desc:"Steps in booting and shutting down, and safe handling of devices."},
{week:10,icon:"📝",title:"MS Word (Introduction)",desc:"Opening, saving and editing documents, formatting text and pictures, printing."}
];
lessons.forEach(l=>l.tag='WEEK '+String(l.week).padStart(2,'0')+' · FIRST TERM');
const terms=[["Algorithm","A step-by-step set of instructions for solving a problem or completing a task."],["Application software","A program designed to help a user perform a particular task."],["CPU","Central Processing Unit. It carries out instructions and performs calculations."],["Data","Raw facts or figures that can be processed to produce information."],["Hardware","The physical parts of a computer that can be seen and touched."],["Input","Data or instructions entered into a computer for processing."],["Internet","A global network of connected computer networks."],["Motherboard","The main circuit board that connects many computer components."],["Output","The information or result produced by a computer after processing."],["RAM","Random Access Memory. Temporary working memory used by active programs."],["Software","Programs and instructions that tell a computer what to do."],["Storage","A place or device where data and programs are kept for later use."],["System unit","The computer case that contains important internal components."],["World Wide Web","A collection of linked web pages and resources accessed through the internet."]];

const KEY='lwt-progress-v1';
let explored=new Set(),bestPct=null,qIndex=0,score=0,answered=false,questions=[],missed=[];

function load(){try{const d=JSON.parse(localStorage.getItem(KEY)||'{}');explored=new Set(d.explored||[]);bestPct=typeof d.bestPct==='number'?d.bestPct:null;}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify({explored:[...explored],bestPct}));}catch(e){}}
function $(id){return document.getElementById(id)}

function go(page){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  $(page).classList.add('active');
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.page===page||(page==='lesson-detail'&&b.dataset.page==='lessons')));
  const labels={home:'Overview',lessons:'Lessons','lesson-detail':'Lesson room',quiz:'Knowledge check',glossary:'Glossary',progress:'My progress'};
  $('crumb').textContent=labels[page];
  $('sidebar').classList.remove('open');
  window.scrollTo({top:0,behavior:'smooth'});
  if(page==='progress')renderProgress();
}
function openLesson(i){
  const l=lessons[i];
  $('lesson-kicker').textContent=l.tag;
  const body=`<span class="tag">${l.tag}</span><h1>${l.icon} ${l.title}</h1>${(window.LESSON_HTML||[])[i]||''}<div class="lesson-actions"><button class="btn" onclick="markExplored(${i})">${explored.has(i)?'✓ Explored':'Mark lesson as explored'}</button> <button class="btn secondary" onclick="openLesson(${(i+1)%lessons.length})">Next lesson →</button></div>`;
  $('lesson-content').innerHTML=body;
  $('lesson-nav').innerHTML=lessons.map((x,j)=>`<button class="lesson-link ${i===j?'active':''}" onclick="openLesson(${j})">${String(x.week).padStart(2,'0')} · ${x.title}</button>`).join('');
  go('lesson-detail');
}
function renderLessonCards(){
  $('lessonCards').innerHTML=lessons.map((l,i)=>`<article class="card clickable" tabindex="0" onclick="openLesson(${i})"><div class="card-icon">${l.icon}</div><h3>${l.title}</h3><p>${l.desc}</p><div class="card-foot"><span>Week ${l.week}${explored.has(i)?' · ✓ Explored':''}</span><span class="arrow">↗</span></div></article>`).join('');
  document.querySelectorAll('#lessonCards .card.clickable').forEach(c=>c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}}));
  $('schemeBox').innerHTML=window.SCHEME_HTML||'';
}
function markExplored(i){explored.add(i);save();updateStats();renderLessonCards();openLesson(i);showToast('Lesson marked as explored!');}
function resetProgress(){if(!confirm('Reset all your progress?'))return;explored=new Set();bestPct=null;save();updateStats();renderLessonCards();renderProgress();}
function updateStats(){
  const n=explored.size,N=lessons.length,s=bestPct===null?'--':bestPct+'%';
  $('stat-lessons').textContent=n+'/'+N;$('side-complete').textContent=n;$('side-total').textContent=N;
  $('side-track').style.width=(n/N*100)+'%';
  $('progress-lessons').textContent=n+'/'+N;
  $('progress-percent').textContent=Math.round(n/N*100)+'%';
  $('stat-score').textContent=s;$('progress-score').textContent=s;
}
function renderProgress(){
  updateStats();
  $('progress-list').innerHTML=lessons.map((l,i)=>{const d=explored.has(i);return `<div class="glossary-item progress-row"><div><strong>${l.icon} ${l.title}</strong><p>${d?'You have explored this module.':'Not explored yet.'}</p></div><span class="status ${d?'done':''}">${d?'✓ COMPLETE':'○ PENDING'}</span></div>`}).join('');
}

function allQuestions(){return window.EXAM_QUESTIONS||[]}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a}
function showQuizStart(){
  const n=allQuestions().length;
  document.querySelectorAll('[data-qcount]').forEach(e=>e.textContent=n);
  $('quizBox').innerHTML=`<div class="quiz-start"><div class="eyebrow">JSS 1 · FIRST TERM</div><h2>Digital Technology exam practice</h2><p>${n} multiple-choice questions based on the First Term examination. You get instant feedback after each answer and a list of the questions you missed at the end.</p><div class="quiz-modes"><button class="btn" onclick="startQuiz(10)">Quick quiz<br><small>10 random questions</small></button><button class="btn" onclick="startQuiz(25)">Practice set<br><small>25 random questions</small></button><button class="btn secondary" onclick="startQuiz(0)">Full exam<br><small>All ${n} questions, in order</small></button></div></div>`;
}
function startQuiz(n){
  const all=allQuestions();
  questions=n?shuffle(all).slice(0,n):all.slice();
  qIndex=0;score=0;missed=[];quizShell();renderQuestion();
}
function quizShell(){
  $('quizBox').innerHTML=`<div class="quiz-meta"><span id="quiz-count"></span><span id="quiz-score">SCORE: 0</span></div><div class="track"><span id="quiz-track"></span></div><h2 id="question"></h2><div id="options"></div><div class="feedback" id="feedback" role="status" aria-live="polite"></div><div class="quiz-actions"><button class="btn secondary" onclick="showQuizStart()">Quit</button><button class="btn" id="nextBtn" onclick="nextQuestion()" disabled>Next question →</button></div>`;
}
function renderQuestion(){
  const q=questions[qIndex];answered=false;
  $('quiz-count').textContent=`QUESTION ${qIndex+1} OF ${questions.length}`;
  $('quiz-score').textContent='SCORE: '+score;
  $('quiz-track').style.width=(qIndex/questions.length*100)+'%';
  $('question').textContent=q.q;
  $('options').innerHTML=q.a.map((a,i)=>`<button class="option" onclick="choose(${i})"><span class="letter">${'ABCD'[i]}</span><span>${a}</span></button>`).join('');
  const f=$('feedback');f.className='feedback';f.textContent='';
  $('nextBtn').disabled=true;
  $('nextBtn').textContent=qIndex===questions.length-1?'See results →':'Next question →';
}
function choose(i){
  if(answered)return;answered=true;
  const q=questions[qIndex],ok=i===q.c;
  if(ok)score++;else missed.push({q:q.q,yours:q.a[i],right:q.a[q.c]});
  document.querySelectorAll('.option').forEach((b,j)=>{if(j===q.c)b.classList.add('correct');else if(j===i)b.classList.add('wrong');b.disabled=true;});
  const f=$('feedback');f.textContent=ok?'Correct!':'Not quite. The correct answer is '+'ABCD'[q.c]+'. '+q.a[q.c];f.className='feedback show '+(ok?'good':'bad');
  $('quiz-score').textContent='SCORE: '+score;
  $('nextBtn').disabled=false;
}
function nextQuestion(){
  if(!answered)return;
  if(qIndex<questions.length-1){qIndex++;renderQuestion();return;}
  const total=questions.length,pct=Math.round(score/total*100);
  bestPct=bestPct===null?pct:Math.max(bestPct,pct);save();updateStats();
  const msg=pct>=80?'Excellent work!':pct>=50?'Good effort. Review the topics you missed and try again.':'This is a starting point. Revisit the lessons and try again.';
  const review=missed.length?`<details class="scheme"><summary>Review ${missed.length} missed question${missed.length>1?'s':''}</summary><div class="scheme-box">${missed.map(m=>`<div class="glossary-item"><strong>${m.q}</strong><p>Your answer: ${m.yours}<br>Correct answer: <b>${m.right}</b></p></div>`).join('')}</div></details>`:'';
  $('quizBox').innerHTML=`<div class="quiz-result"><div class="eyebrow">QUIZ COMPLETE</div><h2>You made it to the finish! ✨</h2><p>You scored <b>${score} out of ${total}</b> (${pct}%). ${msg}</p><div class="stat"><div class="stat-top">YOUR RESULT</div><strong>${pct}%</strong><small>Best score: ${bestPct}%</small></div>${review}<button class="btn" onclick="showQuizStart()">Try again ↻</button> <button class="btn secondary" onclick="go('lessons')">Review lessons</button></div>`;
}
function resetQuiz(){showQuizStart();}

function renderGlossary(items=terms){
  $('glossaryList').innerHTML=items.length?items.map(t=>`<div class="glossary-item"><strong>${t[0]}</strong><p>${t[1]}</p></div>`).join(''):'<div class="empty">No matching terms. Try another search.</div>';
}
function filterGlossary(){const q=$('glossarySearch').value.toLowerCase();renderGlossary(terms.filter(t=>t[0].toLowerCase().includes(q)||t[1].toLowerCase().includes(q)));}
function showToast(msg){const t=$('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1900);}

document.querySelectorAll('.nav-btn').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$('menuBtn').addEventListener('click',()=>$('sidebar').classList.toggle('open'));
$('glossarySearch').addEventListener('input',filterGlossary);
document.querySelectorAll('.card.clickable').forEach(c=>c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();c.click();}}));

load();renderLessonCards();showQuizStart();renderGlossary();updateStats();
