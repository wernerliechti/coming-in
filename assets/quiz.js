const QUESTIONS = [
  {
    question: "Worüber kann Wernu nicht aufhören zu reden?",
    options: ["Bitcoin", "Fotografie", "Quantenmechanik", "Alle 3"],
    correct: "Alle 3",
  },
  {
    question: "Wonach ist Wernu süchtig?",
    options: ["Cola Zero", "Kokain", "Fischbrötchen", "Instagram"],
    correct: "Cola Zero",
  },
  {
    question: "Was bekommt Wernu am liebsten geschenkt?",
    options: [
      "Fleisch, Whisky, Zigarren",
      "Wein, Bier, Gin",
      "Socken, Unterhosen, Handschuhe",
      "Gummibärli, Energy Drinks, Schoggi",
    ],
    correct: "Fleisch, Whisky, Zigarren",
  },
  {
    question: "Was ist die grösste Menge Bier, die Wernu an einem Abend getrunken hat?",
    options: ["6L, in Berlin", "2L, in Bern", "3.5L, in Zürich", "10L, in St Moriz"],
    correct: "6L, in Berlin",
  },
  {
    question: "Wieviele Geschwister hat Wernu?",
    options: ["1", "2", "3", "4"],
    correct: "3",
  },
];

let currentIndex = 0;
let score = 0;
let answered = false;

const progressEl = document.getElementById("quiz-progress");
const questionEl = document.getElementById("quiz-question");
const optionsEl = document.getElementById("quiz-options");
const nextBtn = document.getElementById("quiz-next");
const resultEl = document.getElementById("quiz-result");
const quizBodyEl = document.getElementById("quiz-body");

function renderQuestion() {
  answered = false;
  const q = QUESTIONS[currentIndex];
  progressEl.textContent = `Frage ${currentIndex + 1} von ${QUESTIONS.length}`;
  questionEl.textContent = q.question;
  optionsEl.innerHTML = "";
  nextBtn.style.display = "none";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "quiz-option";
    btn.textContent = option;
    btn.addEventListener("click", () => selectAnswer(btn, option));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(btn, option) {
  if (answered) return;
  answered = true;

  const q = QUESTIONS[currentIndex];
  const isCorrect = option === q.correct;
  if (isCorrect) score += 1;

  [...optionsEl.children].forEach((child) => {
    child.disabled = true;
    if (child.textContent === q.correct) {
      child.classList.add("correct");
    } else if (child === btn) {
      child.classList.add("wrong");
    }
  });

  nextBtn.style.display = "inline-block";
  nextBtn.textContent = currentIndex === QUESTIONS.length - 1 ? "Ergebnis anzeigen" : "Nächste Frage";
}

function renderResult() {
  quizBodyEl.style.display = "none";
  resultEl.style.display = "block";
  resultEl.innerHTML = `
    <p class="quiz-progress">Fertig!</p>
    <div class="quiz-score">${score} von ${QUESTIONS.length}</div>
    <p>${resultMessage(score)}</p>
    <button type="button" class="btn btn-secondary" id="quiz-restart">Nochmal spielen</button>
  `;
  document.getElementById("quiz-restart").addEventListener("click", restart);
}

function resultMessage(s) {
  if (s === QUESTIONS.length) return "Perfekt! Du kennst Wernu in- und auswendig.";
  if (s >= QUESTIONS.length - 1) return "Sehr stark! Fast alles richtig.";
  if (s >= 2) return "Nicht schlecht, aber da geht noch mehr!";
  return "Zeit, mal wieder mit Wernu einen trinken zu gehen.";
}

function restart() {
  currentIndex = 0;
  score = 0;
  resultEl.style.display = "none";
  quizBodyEl.style.display = "block";
  renderQuestion();
}

nextBtn.addEventListener("click", () => {
  currentIndex += 1;
  if (currentIndex >= QUESTIONS.length) {
    renderResult();
  } else {
    renderQuestion();
  }
});

renderQuestion();
