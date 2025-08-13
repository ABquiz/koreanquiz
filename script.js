let currentSubject = ""; // 현재 선택한 과목
let currentQuestion = null; // 현재 문제 객체
let score = 0; // 사용자 점수
let selected = null; // 선택한 보기 인덱스

// 화면 전환 함수들
function goToStart() {
  hideAll();
  document.getElementById("start-screen").style.display = "block";
}

function goToMain() {
  hideAll();
  document.getElementById("main-screen").style.display = "block";
}

function confirmExit() {
  document.getElementById("exit-confirm").style.display = "block";
}

function cancelExit() {
  document.getElementById("exit-confirm").style.display = "none";
}

function exitApp() {
  alert("앱을 종료합니다."); // 실제 앱 종료는 브라우저에서는 불가능
  cancelExit();
}

// 문제풀이 시작
function startQuiz(subject) {
  currentSubject = subject;
  score = 0;
  document.getElementById("subject-title").textContent = subject;
  document.getElementById("score").textContent = "점수: 0점";
  hideAll();
  document.getElementById("quiz-screen").style.display = "block";
  nextQuestion();
}

// 다음 문제 표시
function nextQuestion() {
  const questions = questionsDB[currentSubject];
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  selected = null;

  document.getElementById("question").textContent = currentQuestion.question;
  document.getElementById("choices").innerHTML = "";
  document.getElementById("answer").style.display = "none";
  document.getElementById("explanation").style.display = "none";

  // 확인버튼 다시 보이게
  document.getElementById("check").style.display = "inline-block";

  currentQuestion.choices.forEach((choice, index) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.onclick = () => {
      selected = index;
      Array.from(document.getElementById("choices").children).forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    };
    document.getElementById("choices").appendChild(btn);
  });
}

// 정답 확인
document.getElementById("check").onclick = () => {
  if (selected === null) {
    alert("지문을 선택하세요!");
    return;
  }

  if (selected === currentQuestion.answer) {
    score += 1;
    document.getElementById("score").textContent = `점수: ${score}점`;
  }

  document.getElementById("answer").textContent = `정답: ${currentQuestion.choices[currentQuestion.answer]}`;
  document.getElementById("explanation").textContent = currentQuestion.explanation;
  document.getElementById("answer").style.display = "block";
  document.getElementById("explanation").style.display = "block";

  //1회 클릭 후 확인버튼 숨기기
  document.getElementById("check").style.display = "none";
};

// 모든 화면 숨기기
function hideAll() {
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("main-screen").style.display = "none";
  document.getElementById("quiz-screen").style.display = "none";
  document.getElementById("exit-confirm").style.display = "none";
}

// 앱 시작 시 시작화면 표시
goToStart();
