(() => {
  const QUESTIONS = [
    {
      id: 1,
      question: "Which event is considered the decisive factor for World War I??",
      answers: [
        { text: "Assassination of Sarajevo", correct: true },
        { text: "Unfair distribution of power in Europe", correct: false },
        { text: "Naval blockade", correct: false },
        { text: "Alliances", correct: false },
      ],
    },
    {
      d: 2,
      question: "Which independent country was overrun by the German Reich?",
      answers: [
        { text: "Switzeland", correct: false },
        { text: "norway", correct: false },
        { text: "USA", correct: false },
        { text: "belgium", correct: true },
      ],
    },
    {
      id: 3,
      question:
        "What event led to the declaration of WW2?",
      answers: [
        { text: "Treaty of Versailles", correct: false },
        { text: "Munich Agreement", correct: false },
        { text: "Invasion of Poland", correct: true },
        { text: "Pearl Harbor Attack", correct: false },
      ],
    },
    {
      id: 4,
      question: "What was Hitler's nationality at the beginning of World War II?",
      answers: [
        { text: "german", correct: true },
        { text: "austrian", correct: false },
        { text: "french", correct: false },
        { text: "italian", correct: false },
      ],
    },
    {
      id: 5,
      question: "Who is known as the 'Father of the Constitution'?",
      answers: [
        { text: "Benjamin Franklin", correct: false },
        { text: "James Madison", correct: true },
        { text: "George Washington", correct: false },
        { text: "Thomas Jefferson", correct: false },
      ],
    },
    {
      id: 6,
      question:
        "Which act sparked widespread opposition and led to the Boston Tea Party?",
      answers: [
        { text: "Intolerable Acts", correct: false },
        { text: "Townshend Acts", correct: false },
        { text: "Stamp Act", correct: false },
        { text: "Tea Act", correct: true },
      ],
    },
    {
      id: 7,
      question:
        "What was the main reason for the Civil War?",
      answers: [
        { text: "states' rights", correct: false },
        { text: "territorial disputes", correct: false },
        { text: "slavery", correct: true },
        { text: "economic differences", correct: false },
      ],
    },
    {
     id: 8,
      question: "What year did Titanic sink?",
      answers: [
        { text: "1898", correct: false },
        { text: "1905", correct: false },
        { text: "1920", correct: false },
        { text: "1912", correct: true },
      ],
    },
    {
      id: 9,
      question: "In which ocean did Titanic sink?",
      answers: [
        { text: "Atlantic Ocean", correct: true },
        { text: "Pacific Ocean", correct: false },
        { text: "Indian Ocean", correct: false },
        { text: "Arctic Ocean", correct: false },
      ],
    },
    {
      id: 10,
      question: "Titanic had how many funnels?",
      answers: [
        {
          text: "4",
          correct: false,
        },
        {
          text: "2",
          correct: false,
        },
        { text: "3", correct: true },
        {
          text: "1",
          correct: false,
        },
      ],
    },
   
  ];

  const el = {
    score: document.getElementById("score"),
    qIndex: document.getElementById("qIndex"),
    qTotal: document.getElementById("qTotal"),

    startScreen: document.getElementById("startScreen"),
    quizScreen: document.getElementById("quizScreen"),
    resultScreen: document.getElementById("resultScreen"),

    questionText: document.getElementById("questionText"),
    feedback: document.getElementById("feedback"),
    answers: document.getElementById("answers"),

    submitBtn: document.getElementById("submitBtn"),
    nextBtn: document.getElementById("nextBtn"),

    finalScore: document.getElementById("finalScore"),
    percent: document.getElementById("percent"),
    summary: document.getElementById("summary"),

    reviewBtn: document.getElementById("reviewBtn"),
    retakeBtn: document.getElementById("retakeBtn"),

    reviewScreen: document.getElementById("reviewScreen"),
    review: document.getElementById("review"),
  };

  let state;

  function buildState() {
    return {
      order: QUESTIONS.map((_, i) => i),
      current: 0,
      locked: false,
      selectedAnswerIndex: null,
      correctCount: 0,
      results: [],
    };
  }

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function showScreen(which) {
    el.startScreen.classList.toggle("hidden", which !== "start");
    el.quizScreen.classList.toggle("hidden", which !== "quiz");
    el.resultScreen.classList.toggle("hidden", which !== "result");
  }

  function setFeedback(message, kind) {
    el.feedback.textContent = message;
    el.feedback.classList.remove("hidden", "good", "bad");
    if (kind) el.feedback.classList.add(kind);
  }

  function clearFeedback() {
    el.feedback.textContent = "";
    el.feedback.classList.add("hidden");
    el.feedback.classList.remove("good", "bad");
  }

  function renderAnswers(question) {
    el.answers.innerHTML = "";

    question.answers.forEach((ans, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = ans.text;
      btn.dataset.index = String(idx);

      btn.addEventListener("click", () => {
        if (state.locked) return;

        state.selectedAnswerIndex = idx;
        for (const node of el.answers.querySelectorAll(".answer-btn")) {
          node.classList.remove("selected");
        }
        btn.classList.add("selected");
        el.submitBtn.disabled = false;
      });

      el.answers.appendChild(btn);
    });
  }

  function renderQuestion() {
    const q = QUESTIONS[state.order[state.current]];
    el.questionText.textContent = q.question;

    el.qIndex.textContent = String(state.current + 1);
    el.qTotal.textContent = String(QUESTIONS.length);

    clearFeedback();
    state.locked = false;
    state.selectedAnswerIndex = null;

    el.submitBtn.disabled = true;
    el.nextBtn.disabled = true;

    el.reviewScreen.classList.add("hidden");
    renderAnswers(q);
  }

  function getCurrentQuestion() {
    return QUESTIONS[state.order[state.current]];
  }

  function gradeAndLock() {
    const q = getCurrentQuestion();
    const selectedIdx = state.selectedAnswerIndex;
    if (selectedIdx == null) return;

    const selected = q.answers[selectedIdx];
    const correct = q.answers.find((a) => a.correct);

    const isCorrect = !!selected.correct;
    if (isCorrect) state.correctCount += 1;

    state.results.push({
      questionId: q.id,
      question: q.question,
      selectedText: selected.text,
      correctText: correct.text,
      isCorrect,
    });

    el.score.textContent = String(state.correctCount);

    if (isCorrect) setFeedback("Correct! ✅", "good");
    else setFeedback("Wrong. Correct answer: " + correct.text, "bad");

    const nodes = [...el.answers.querySelectorAll(".answer-btn")];
    nodes.forEach((node) => {
      const idx = Number(node.dataset.index);
      const ans = q.answers[idx];

      node.classList.remove("selected");
      if (ans.correct) node.classList.add("correct");
      if (idx === selectedIdx && !ans.correct) node.classList.add("wrong");
    });

    state.locked = true;
    el.submitBtn.disabled = true;
    el.nextBtn.disabled = false;
  }

  function escapeHtml(str) {
    const s = String(str);
    return s
      .replaceAll("&", "&amp;")
      .replaceAll("<", "<")
      .replaceAll(">", ">")
      .replaceAll('"', '"')
      .replaceAll("'", "&#039;");
  }

  function renderSummary() {
    const total = QUESTIONS.length;
    const percent = Math.round((state.correctCount / total) * 100);

    el.finalScore.textContent = String(state.correctCount);
    el.percent.textContent = String(percent);

    el.summary.innerHTML = state.results
      .map((r, i) => {
        const status = r.isCorrect ? "Correct" : "Incorrect";
        const statusColor = r.isCorrect ? "good" : "bad";
        const correctLine = r.isCorrect
          ? ""
          : '<div class="a">Correct answer: ' +
            escapeHtml(r.correctText) +
            "</div>";

        return `
          <div class="summary-item">
            <div class="q">${i + 1}. ${escapeHtml(r.question)}</div>
            <div class="a ${statusColor}"><strong>${status}</strong></div>
            <div class="a">Your answer: ${escapeHtml(r.selectedText)}</div>
            ${correctLine}
          </div>
        `;
      })
      .join("");
  }

  function renderReview() {
    el.review.innerHTML = el.summary.innerHTML;
  }

  document.getElementById("startBtn").addEventListener("click", () => {
    state = buildState();
    state.order = shuffle(state.order);

    el.score.textContent = "0";
    el.qIndex.textContent = "1";
    el.qTotal.textContent = String(QUESTIONS.length);

    state.results = [];
    showScreen("quiz");
    renderQuestion();
  });

  el.submitBtn.addEventListener("click", gradeAndLock);

  el.nextBtn.addEventListener("click", () => {
    if (state.current < QUESTIONS.length - 1) {
      state.current += 1;
      renderQuestion();
      return;
    }

    showScreen("result");
    el.reviewScreen.classList.add("hidden");
    renderSummary();
    el.review.innerHTML = "";
  });

  el.reviewBtn.addEventListener("click", () => {
    renderReview();
    el.reviewScreen.classList.remove("hidden");
  });

  el.retakeBtn.addEventListener("click", () => {
    showScreen("start");
    el.reviewScreen.classList.add("hidden");
    el.summary.innerHTML = "";
    el.review.innerHTML = "";
  });

  state = buildState();
  el.qTotal.textContent = String(QUESTIONS.length);
  showScreen("start");
})();
