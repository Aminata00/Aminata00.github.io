const userQuizButton = document.querySelector("#user-quiz");
const defaultQuizButton = document.querySelector("#default-quiz");
const players = document.querySelectorAll(".player-name");
const addQuestionForm = document.querySelector("#add-question-form");
const addOptionForm = document.querySelector("#add-option-form");
const saveQuizButton = document.querySelector("#save-quiz-button");
const startQuizButton = document.querySelector("#start-quiz-button");
const nextButton = document.querySelector("#next-button");
const nextToPlayersButton = document.querySelector("#next-to-players-button");
const nextToScoresButton = document.querySelector("#next-to-scores-button");
const scoreSummary = document.querySelector(".score-summary");
const tryAgainButton = document.querySelector("#try-again-button");
const newQuizButton = document.querySelector("#new-quiz-button");
const player1 = document.querySelector("#player1");
const player2 = document.querySelector("#player2");
const timerElement = document.querySelector("#timer");
const pages = document.querySelectorAll(".page");
let currentPage = 0;
let countdown = 10;

const timerInterval = setInterval(() => {
  console.log(countdown);
  timerElement.textContent = countdown;  
  countdown--; 

  if (countdown <= 0) {  
    setTimeout(() => {
      alert("Time's up!");
    }, 3000);
    clearInterval(timerInterval);
    console.log("Time's up!");
  }
}, 1000);

const playersInfo = [
  { name: "", score: 0 },
  { name: "", score: 0 },
];
let quizQuestions = [];
const userQuiz = [];
const maxScore = 10;

userQuizButton.addEventListener("click", () => navigateToPage(2));
defaultQuizButton.addEventListener("click", () => navigateToPage(3));
nextToPlayersButton.addEventListener("click", () => navigateToPage(3));
startQuizButton.addEventListener("click", () => navigateToPage(4));
nextToScoresButton.addEventListener("click", () => navigateToPage(5));
tryAgainButton.addEventListener("click", resetQuiz);
newQuizButton.addEventListener("click", () => navigateToPage(1));

addQuestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const questionText = document.querySelector("#question-text").value;
  if (questionText) {
    userQuiz.push({ question: questionText, options: [] });
    document.querySelector("#question-text").value = "";
    alert("Question added!");
    
    const question = document.createElement("li");
    question.innerText = questionText;
    document.querySelector("#questions-list").appendChild(question);
  }
});

addOptionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (userQuiz.length === 0) {
    alert("Please add a question first!");
    return;
  }
  const optionText = document.querySelector("#option-text").value;
  const isCorrect = document.querySelector("#is-correct").checked;
  if (optionText) {
    userQuiz[userQuiz.length - 1].options.push({ text: optionText, isCorrect });
    document.querySelector("#option-text").value = "";
    document.querySelector("#is-correct").checked = false;
    alert("Option added!");
  }
});

saveQuizButton.addEventListener("click", () => {
  if (userQuiz.length < 15) {
    alert("You must add at least 15 questions to save the quiz.");
    return;
  }
  alert("Your custom quiz has been saved successfully!");
});

async function fetchQuizQuestions() {
  try {
    const response = await fetch("https://raw.githubusercontent.com/Aminata00/Aminata00.github.io-/refs/heads/main/APIS/data.json");
    const data = await response.json();
    quizQuestions = data.quizQuestions;
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
  }
}

fetchQuizQuestions();

function loadQuiz() {
  deselectAnswers();
  const currentQuizData = quizQuestions[currentPage];
  document.querySelector("#question").innerText = currentQuizData.question;
  document.querySelector("#a_text").innerText = currentQuizData.options[0].text;
  document.querySelector("#b_text").innerText = currentQuizData.options[1].text;
  document.querySelector("#c_text").innerText = currentQuizData.options[2].text;
  document.querySelector("#d_text").innerText = currentQuizData.options[3].text;
}

function deselectAnswers() {
  document.querySelectorAll(".answer").forEach(answerEl => answerEl.checked = false);
}

function sortQuestionsAlphabetically() {
  quizQuestions.sort((a, b) => a.question.localeCompare(b.question));
}

function shuffleQuestions() {
  for (let i = quizQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizQuestions[i], quizQuestions[j]] = [quizQuestions[j], quizQuestions[i]];
  }
}

function applyQuestionOrder() {
  const order = document.querySelector("#question-order-select").value;
  if (order === "alphabetical") {
    sortQuestionsAlphabetically();
  } else if (order === "random") {
    shuffleQuestions();
  }
}

startQuizButton.addEventListener("click", () => {
  playersInfo[0].name = players[0].value;
  playersInfo[1].name = players[1].value;
  player1.querySelector(".name").textContent = playersInfo[0].name;
  player2.querySelector(".name").textContent = playersInfo[1].name;
  updateScores();
  applyQuestionOrder();
  loadQuiz();
  navigateToPage(2);
});
