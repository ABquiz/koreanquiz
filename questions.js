// 테스트용 문제 데이터 생성
const questionsDB = {
  국어: Array.from({ length: 100 }, (_, i) => ({
    question: `국어 테스트 문제 ${i + 1}`, // 문제 텍스트
    choices: ["보기 A", "보기 B", "보기 C", "보기 D"], // 보기 4개
    answer: i % 4, // 정답 인덱스 (0~3 반복)
    explanation: `이것은 국어 문제 ${i + 1}의 해설입니다.` // 해설 텍스트
  })),

  한국사: Array.from({ length: 100 }, (_, i) => ({
    question: `한국사 테스트 문제 ${i + 1}`,
    choices: ["선택 1", "선택 2", "선택 3", "선택 4"],
    answer: (i + 1) % 4,
    explanation: `이것은 한국사 문제 ${i + 1}의 해설입니다.`
  }))
};
