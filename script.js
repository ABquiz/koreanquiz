let currentSubject = ""; 
let usedQuestions = []; 
let totalCorrect = 0;
let totalQuestions = 0;
let score = 0;
let hasAnswered = false;
let currentQuestion = null;
let selected = null;

// csv 불러오기
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

// csv에서 문제 랜덤 뽑기
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

//화면 지우기
function hideAll() { 
  document.getElementById("start-screen").style.display = "none"; 
  document.getElementById("main-screen").style.display = "none"; 
  document.getElementById("theme-screen").style.display = "none"; 
  document.getElementById("quiz-screen").style.display = "none"; 
  document.getElementById("finish-screen").style.display = "none"; 
  document.getElementById("exit-confirm").style.display = "none"; 
} 

//시작화면
function goToStart() { 
  hideAll(); 
  document.getElementById("start-screen").style.display = "block"; 
} 

//과목선택화면
function goToMain() { 
  hideAll(); 
  updateScores(); 
  document.getElementById("main-screen").style.display = "block"; 
} 

//종료확인화면
function confirmExit() { 
  document.getElementById("exit-confirm").style.display = "block"; 
} 

//종료 취소
function cancelExit() { document.getElementById("exit-confirm").style.display = "none"; 
} 

//종료 확인
function exitApp() { 
  alert("앱을 종료합니다."); 
  cancelExit(); 
} 

//테마선택화면
function goToTheme(subject) { 
  hideAll(); 
  currentSubject = subject; 
  document.getElementById("theme-subject-title").textContent = subject; 
  document.getElementById("theme-screen").style.display = "block"; 
} 

//문제풀이화면
function startQuiz(subject) { 
  currentSubject = subject; 
  score = 0; 
  checkscore = 0;
  totalCorrect = 0; 
  totalQuestions = 0; 
  usedQuestions = []; 
  document.getElementById("quiz-subject-title").textContent = subject; 
  document.getElementById("score-display").textContent = "현재 점수: 0/20"; 
  hideAll(); 
  document.getElementById("quiz-screen").style.display = "block"; 
  nextQuestion(currentSubject); 
} 

//다음문제 버튼
function nextQuestion(subject) { 
  currentSubject = subject;
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

    hasAnswered = false; //완료 버튼 검증용 기능 원복
  // 이 기능은 다음문제 기능에서 구현 해 놔야 함
  //if (totalQuestions >= 20) { 
  //  goToFinish(currentSubject); 
  //  return; 

} 

// 문제풀이 완료버튼
function checkAnswer() { 
  if (selected === null) { alert("지문을 선택하세요!"); 
    return; 
  } 

  //아무리 많이 눌러도 1번 이상 올라가지 않는 기능 필요
  if (hasAnswered) {
    alert("이미 푼 문제 입니다.");
    return;
  }
  
  hasAnswered = true; 
  totalQuestions++;

  subjectScores[currentSubject].total++;  // 총 문제 수 증가
  if (selected === currentQuestion.answer) { 
    score++; 
    subjectScores[currentSubject].correct++; // 누적 정답 수 증가
    document.getElementById("result").textContent = "정답입니다!"; 
  } else {
    document.getElementById("result").textContent = "오답입니다."; 
  } 
    document.getElementById("score-display").textContent = `현재 점수: ${score}/${totalQuestions}`; 
    document.getElementById("correct-answer").textContent = `정답: ${currentQuestion.choices[currentQuestion.answer]}`; 
    document.getElementById("explanation").textContent = currentQuestion.explanation; 
}

    // 이 기능은 다음문제 기능에서만 되도록 해야 하는데
  //if (totalQuestions >= 20) { 
  //  goToFinish(currentSubject); 
  //  return; 
  }

//해설보기
function showExplanation() { 
  document.getElementById("explanation").style.display = "block"; 
} 

//점수합계
function updateScores() { 
  document.getElementById("score-korean").textContent = `${subjectScores["국어"].correct}/${subjectScores["국어"].total}`; 
  document.getElementById("score-history").textContent = `${subjectScores["한국사"].correct}/${subjectScores["한국사"].total}`; 
  document.getElementById("score-social").textContent = `${subjectScores["사회"].correct}/${subjectScores["사회"].total}`; 
  document.getElementById("score-math").textContent = `${subjectScores["수학"].correct}/${subjectScores["수학"].total}`; 
} 

//풀이종료화면
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

