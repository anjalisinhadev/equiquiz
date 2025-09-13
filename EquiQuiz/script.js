const startButton = document.getElementById("start-button");
const quizScreen = document.getElementById("quiz-screen");
const startScreen = document.getElementById("start-screen");
const resultScreen = document.getElementById("result-screen");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const feedbackMessage = document.getElementById("feedback-message");
const progressBar = document.getElementById("progress-bar");
const explanationDiv = document.getElementById("explanation");
const nextButton = document.getElementById("next-button");
const restartButton = document.getElementById("restart-button");
const scoreChartCanvas = document.getElementById("score-chart");
const questionChartCanvas = document.getElementById("question-chart");


// Civic & Economic Literacy Questions
const quizQuestions = [
  {
    question: "What is participatory budgeting?",
    answers: [
      { text: "A tax policy", correct: false },
      { text: "A community decision-making process", correct: true },
      { text: "A stock market tool", correct: false },
      { text: "A government loan program", correct: false },
    ],
    explanation: "Participatory budgeting lets community members directly decide how to spend part of a public budget."
  },
  {
    question: "What does GDP stand for?",
    answers: [
      { text: "Gross Domestic Product", correct: true },
      { text: "General Development Plan", correct: false },
      { text: "Government Data Policy", correct: false },
      { text: "Global Debt Percentage", correct: false },
    ],
    explanation: "GDP means Gross Domestic Product, which is the total value of goods and services produced in a country."
  },
  {
    question: "Which of the following is an example of a public good?",
    answers: [
      { text: "A sandwich", correct: false },
      { text: "A public park", correct: true },
      { text: "A smartphone", correct: false },
      { text: "A pair of shoes", correct: false },
    ],
    explanation: "A public good, like a park, is accessible to everyone and not privately owned."
  },
  {
    question: "What is the role of taxes in society?",
    answers: [
      { text: "They fund public services", correct: true },
      { text: "They only pay politicians", correct: false },
      { text: "They increase inflation", correct: false },
      { text: "They make imports cheaper", correct: false },
    ],
    explanation: "Taxes are collected by governments to fund services like schools, hospitals, and infrastructure."
  },
  {
    question: "What does the term 'inflation' mean?",
    answers: [
      { text: "A rise in overall prices", correct: true },
      { text: "An increase in jobs", correct: false },
      { text: "A fall in GDP", correct: false },
      { text: "A rise in wages only", correct: false },
    ],
    explanation: "Inflation means the general increase in prices of goods and services over time."
  }
];

let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;
let userAnswers = [];


startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
  score = 0;
  scoreSpan.textContent = score;
  currentQuestionIndex = 0;
});

function restartQuiz() {
    userAnswers = []; // ADD THIS LINE
    resultScreen.classList.remove("active");
    startQuiz();
}


function startQuiz() {
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  totalQuestionsSpan.textContent = quizQuestions.length;
  showQuestion();
}

function showQuestion() {
  answersDisabled = false;
  explanationDiv.textContent = "";
  nextButton.classList.add("hidden");

  const currentQuestion = quizQuestions[currentQuestionIndex];
  currentQuestionSpan.textContent = currentQuestionIndex + 1;

  const progressPercent = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  progressBar.style.width = progressPercent + "%";

  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = "";

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-button");
    button.dataset.correct = answer.correct;
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

function selectAnswer(event) {
  if (answersDisabled) return;
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  userAnswers.push({
        questionIndex: currentQuestionIndex,
        isCorrect: isCorrect
    });


  Array.from(answersContainer.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  const currentQuestion = quizQuestions[currentQuestionIndex];
  explanationDiv.textContent = currentQuestion.explanation;
  nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < quizQuestions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  finalScoreSpan.textContent = score + " / " + quizQuestions.length;

  if (score === quizQuestions.length) {
    feedbackMessage.textContent = "Perfect! You’re a civic & economic pro! 🎉";
  } else if (score >= quizQuestions.length / 2) {
    feedbackMessage.textContent = "Good job! You understand the basics well.";
  } else {
    feedbackMessage.textContent = "Keep learning! Civic and economic literacy is power.";
  }

    // Create charts 
  createScoreChart();
  createQuestionChart();

}


function createScoreChart() {
    const ctx = scoreChartCanvas.getContext('2d');

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct Answers', 'Incorrect Answers'],
            datasets: [{
                data: [score, quizQuestions.length - score],
                backgroundColor: [
                    '#4CAF50', // Green for correct
                    '#F44336'  // Red for incorrect
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function createQuestionChart() {
    const ctx = questionChartCanvas.getContext('2d');
    
    // Prepare data for the question chart
    const labels = quizQuestions.map((q, index) => `Q${index + 1}`);
    const data = Array(quizQuestions.length).fill(0);
    
    // Mark correct answers with 1, incorrect with 0
    userAnswers.forEach(answer => {
        data[answer.questionIndex] = answer.isCorrect ? 1 : 0;
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Correct (1) / Incorrect (0)',
                data: data,
                backgroundColor: data.map(value => value ? '#4CAF50' : '#F44336'),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}