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
    hideAll(); 
    goToStart(); 
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
  document.getElementById("score-display").textContent = "현재 점수: 0/0"; 
  hideAll(); 
  document.getElementById("quiz-screen").style.display = "block"; 
  nextQuestion(currentSubject); 
} 

//다음문제 버튼
function nextQuestion(subject) { 
  currentSubject = subject; 
  //현재 과목(currentSubject)에 해당하는 문제 배열을 questions 변수에 저장
  const questions = questionsDB[currentSubject];
  // 사용된 문제(usedQuestions)를 제외한 남은 문제들을 available 변수에 저장
  const available = questions.filter(q => !usedQuestions.includes(q));
  
// 남은 문제가 없거나(퀴즈를 20문제 이상 풀었을 경우)
// 또는 totalQuestions가 20 이상일 경우 퀴즈를 종료합니다.
  if (available.length === 0) { //종료버튼 넣으면서 빠진부분|| totalQuestions >= 3) { 
    // hideAll();
    // "finish-screen" 요소를 화면에 보이게 합니다.
    // 종료버튼 넣으면서 빠진부분 document.getElementById("finish-screen").style.display = "block";
    // goToFinish 함수를 호출하여 퀴즈 종료 처리를 합니다.
    goToFinish(currentSubject); 
    // 함수를 종료합니다.
    return; 
  } 
  
// 남은 문제 중에서 무작위로 한 문제를 선택합니다.
// Math.random()을 사용하여 0과 1 사이의 난수를 생성하고,
// available.length를 곱하여 available 배열의 인덱스를 구합니다.
// Math.floor()로 소수점을 버려 정수로 만듭니다.
  currentQuestion = available[Math.floor(Math.random() * available.length)]; 
  // 선택된 문제를 usedQuestions 배열에 추가하여 다시 사용되지 않도록 합니다.
  usedQuestions.push(currentQuestion); 
  // 사용자가 선택한 답안을 나타내는 selected 변수를 null로 초기화합니다.
  selected = null; 
  
  // ✅ UI 업데이트 코드 시작 
  // HTML에서 "question" ID를 가진 요소의 내용을 현재 문제 텍스트로 변경합니다.
  document.getElementById("question").textContent = "문제: " + currentQuestion.question; 
  // HTML에서 "passage" ID를 가진 요소의 내용을 현재 문제의 지문 텍스트로 변경합니다.
  document.getElementById("passage").textContent = "지문: " + currentQuestion.passage; 
  // "choices" ID를 가진 요소의 내부 HTML을 비워 이전 선택지들을 모두 제거합니다.
  document.getElementById("choices").innerHTML = "";
  // "result" ID를 가진 요소의 내용을 비워 정답/오답 표시를 초기화합니다.
  document.getElementById("result").textContent = ""; 
  // "explanation" ID를 가진 요소의 내용을 비워 해설을 초기화합니다.
  document.getElementById("explanation").textContent = ""; 
  // "correct-answer" ID를 가진 요소의 내용을 비워 정답 표시를 초기화합니다.
  document.getElementById("correct-answer").textContent = ""; 
  
  // 현재 문제의 선택지(choices) 배열을 무작위로 섞습니다.
  // .map()을 사용하여 각 선택지와 인덱스를 객체로 만듭니다.
  // .sort()의 비교 함수(Math.random() - 0.5)로 배열을 무작위로 섞습니다.
  const shuffledChoices = currentQuestion.choices .map((choice, index) => ({ index, choice })) .sort(() => Math.random() - 0.5); 
  
  // 섞인 선택지 배열의 각 항목에 대해 반복문을 실행합니다.
  // 새로운 버튼 요소를 생성합니다.
  shuffledChoices.forEach(({ index, choice }) => { const btn = document.createElement("button"); 
    // 버튼의 텍스트를 선택지 내용으로 설정합니다.
    btn.textContent = choice; 
    // 버튼을 클릭했을 때 실행될 이벤트를 정의합니다.
    // 클릭된 버튼의 원래 인덱스를 selected 변수에 할당합니다.
    btn.onclick = () => { selected = index; 
    // 모든 선택지 버튼의 'selected' 클래스를 제거합니다.
    Array.from(document.getElementById("choices").children).forEach(b => b.classList.remove("selected")); 
    // 클릭된 버튼에 'selected' 클래스를 추가하여 시각적 효과를 줍니다.
    btn.classList.add("selected"); }; 
    // 생성된 버튼을 "choices" ID를 가진 요소에 추가합니다.
    document.getElementById("choices").appendChild(btn); }); 
    
  // ✅ UI 업데이트 코드 끝 

    hasAnswered = false; //완료 버튼 검증용 기능 원복
    //document.getElementById("next-button").style.display = 'block';
    //document.getElementById("finish-button").style.display = 'none';

  // 문제풀이 아래 칸 공간 확보
  document.getElementById("result").textContent = "결과: "; 
  document.getElementById("correct-answer").textContent = "정답: "; 
  document.getElementById("explanation").textContent = "해설: ";
  
    // ✅ 다음 문제가 마지막 문제인지 확인합니다. (총 3문제 기준)
    if (usedQuestions.length >= 3) {
        document.getElementById("next-button").style.display = 'none';
        document.getElementById("finish-button").style.display = 'block';
    } else {
        document.getElementById("next-button").style.display = 'block';
        document.getElementById("finish-button").style.display = 'none';
    }
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

  // ✅ 마지막 문제일 경우 버튼을 전환합니다.
    //if (totalQuestions >= 3) { // 테스트를 위해 3으로 설정
    //    document.getElementById("next-button").style.display = 'none'; // 다음문제 버튼 숨기기
    //    document.getElementById("finish-button").style.display = 'block'; // 퀴즈 종료 버튼 보이기
    //}

  subjectScores[currentSubject].total++;  // 총 문제 수 증가
  if (selected === currentQuestion.answer) { 
    score++; 
    subjectScores[currentSubject].correct++; // 누적 정답 수 증가
    document.getElementById("result").textContent = "결과: 정답입니다!"; 
  } else {
    document.getElementById("result").textContent = "결과: 오답입니다."; 
  } 
    document.getElementById("score-display").textContent = `정답/풀이: ${score}/${totalQuestions}`; 
    document.getElementById("correct-answer").textContent = `정답: ${currentQuestion.choices[currentQuestion.answer]}`; 
    document.getElementById("explanation").textContent = `해설: ${currentQuestion.explanation}`; 


  }

// 이 기능은 다음문제 버튼을 종료버튼 으로 바꾸면서 기능 변경
//if (totalQuestions >= 20) { 
//  goToFinish(currentSubject); 
//  return; 

//해설보기
function showExplanation() { 
  //document.getElementById("explanation").style.display = "block"; 
  //완료버튼의 코드와 동일
  document.getElementById("explanation").textContent = `해설: ${currentQuestion.explanation}`; 
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
  document.getElementById("final-score").textContent = `${score}/${totalQuestions}`; 
  const totalCorrect = subjectScores[currentSubject].correct;
  const totalSubjectQuestions = subjectScores[currentSubject].total;
  document.getElementById("total-score").textContent = `${totalCorrect}/${totalSubjectQuestions}`; 
  document.getElementById("finish-screen").style.display = "block"; 
} 



