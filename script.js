let currentSubject = ""; 
let usedQuestions = []; 
let totalCorrect = 0;
let totalQuestions = 0;
let score = 0;
let currentQuestion = null;
let selected = null;

fetch("korean_questions.csv")
  .then(response => response.text())
  .then(data => {
    parseCSV(data);
    console.log("문제 로딩 완료:", questionsDB);
  })
  .catch(error => {
    console.error("CSV 파일 로딩 실패:", error);
  });

const questionsDB = { 
  "국어": [], 
  "수학": [], 
  "사회": [], 
  "한국사": [] 
}; 

const subjectScores = {
  국어: { correct: 0, total: 0 },
  한국사: { correct: 0, total: 0 },
  사회: { correct: 0, total: 0 },
  수학: { correct: 0, total: 0 }
};

function parseCSV(csvText) { 
  const lines = csvText.trim().split("\n"); 
  const headers = lines[0].split(","); 
  
  for (let i = 1; i < lines.length; i++) { 
    const values = lines[i].split(",").map(v => v.trim()); 
    const questionObj = { 
      question: values[1], 
      passage: values[2], 
      choices: [values[3], values[4], values[5], values[6]], 
      answer: parseInt(values[7]), 
      explanation: values[8] 
    }; 
    questionsDB[values[0]].push(questionObj); 
  } 
} 

function hideAll() { 
  document.getElementById("start-screen").style.display = "none"; 
  document.getElementById("main-screen").style.display = "none"; 
  document.getElementById("theme-screen").style.display = "none"; 
  document.getElementById("quiz-screen").style.display = "none"; 
  document.getElementById("finish-screen").style.display = "none"; 
  document.getElementById("exit-confirm").style.display = "none"; 
} 

function goToStart() { 
  hideAll(); 
  document.getElementById("start-screen").style.display = "block"; 
} 

function goToMain() { 
  hideAll(); 
  updateScores(); 
  document.getElementById("main-screen").style.display = "block"; 
} 

function confirmExit() { 
  document.getElementById("exit-confirm").style.display = "block"; 
} 

function cancelExit() { document.getElementById("exit-confirm").style.display = "none"; 
} 

function exitApp() { 
  alert("앱을 종료합니다."); 
  cancelExit(); 
} 

function goToTheme(subject) { 
  hideAll(); 
  currentSubject = subject; 
  document.getElementById("theme-subject-title").textContent = subject; 
  document.getElementById("theme-screen").style.display = "block"; 
} 

function startQuiz(subject) { 
  currentSubject = subject; 
  score = 0; 
  totalCorrect = 0; 
  totalQuestions = 0; 
  usedQuestions = []; 
  document.getElementById("quiz-subject-title").textContent = subject; 
  document.getElementById("score-display").textContent = "현재 점수: 0/20"; 
  hideAll(); 
  document.getElementById("quiz-screen").style.display = "block"; 
  nextQuestion(); 
} 

function nextQuestion() { 
  const questions = questionsDB[currentSubject]; 
  const available = questions.filter(q => !usedQuestions.includes(q)); 
  
  if (available.length === 0 || totalQuestions >= 20) { 
    hideAll();
    document.getElementById("finish-screen").style.display = "block";
    goToFinish(currentSubject); 
    return; 
  } 
  
  currentQuestion = available[Math.floor(Math.random() * available.length)]; 
  usedQuestions.push(currentQuestion); 
  selected = null; 
  
  // ✅ UI 업데이트 코드 시작 
  document.getElementById("question").textContent = "문제: " + currentQuestion.question; 
  document.getElementById("passage").textContent = "지문: " + currentQuestion.passage; 
  document.getElementById("choices").innerHTML = ""; document.getElementById("result").textContent = ""; 
  document.getElementById("explanation").textContent = ""; 
  document.getElementById("correct-answer").textContent = ""; 
  
  const shuffledChoices = currentQuestion.choices .map((choice, index) => ({ index, choice })) .sort(() => Math.random() - 0.5); 
  
  shuffledChoices.forEach(({ index, choice }) => { const btn = document.createElement("button"); 
    btn.textContent = choice; 
    btn.onclick = () => { selected = index; 
      
  Array.from(document.getElementById("choices").children).forEach(b => b.classList.remove("selected")); 
    btn.classList.add("selected"); }; 
    document.getElementById("choices").appendChild(btn); }); 
    
  // ✅ UI 업데이트 코드 끝 
} 

function checkAnswer() { 
  if (selected === null) { alert("지문을 선택하세요!"); 
    return; 
  } 
  
  totalQuestions++; 

  subjectScores[currentSubject].total++;  // 총 문제 수 증가
  if (selected === currentQuestion.answer) { 
    score++; //퀴즈 세션 점수
    // totalCorrect++; 왜 뺐지?
    subjectScores[currentSubject].correct++; // 누적 정답 수 증가
    document.getElementById("result").textContent = "정답입니다!"; 
  } else {
    document.getElementById("result").textContent = "오답입니다."; 

  } 

if (totalQuestions >= 20) { 
  goToFinish(currentSubject); 
  return; 
} 

document.getElementById("score-display").textContent = `현재 점수: ${score}/20`; 
document.getElementById("correct-answer").textContent = `정답: ${currentQuestion.choices[currentQuestion.answer]}`; 
document.getElementById("explanation").textContent = currentQuestion.explanation; 
} 

function showExplanation() { 
  document.getElementById("explanation").style.display = "block"; 
} 

function updateScores() { 
  document.getElementById("score-korean").textContent = `${subjectScores["국어"].correct}/${subjectScores["국어"].total}`; 
  document.getElementById("score-history").textContent = `${subjectScores["한국사"].correct}/${subjectScores["한국사"].total}`; 
  document.getElementById("score-social").textContent = `${subjectScores["사회"].correct}/${subjectScores["사회"].total}`; 
  document.getElementById("score-math").textContent = `${subjectScores["수학"].correct}/${subjectScores["수학"].total}`; 
} 

function goToFinish(subject) { 
  hideAll(); 
  currentSubject = subject; 
  document.getElementById("finish-subject-title").textContent = currentSubject; 
  document.getElementById("final-score").textContent = `${score}/20`; 
  const totalCorrect = subjectScores[currentSubject].correct;
  const totalQuestions = subjectScores[currentSubject].total;
  document.getElementById("total-score").textContent = `${totalCorrect}/${totalQuestions}`; 
  document.getElementById("finish-screen").style.display = "block"; 
} 

hideAll(); 
goToStart(); 

