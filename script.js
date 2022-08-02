// #notes
// game
// states,
//     not started,
//     started, jump to next,
//     ended : time is 0 or attempted all questions

//     question: {
//         question,
//         choices: [],
//         evaluator: (submission) => submission == answer
//     }

// countries, finance, sports

let endTimer;

let makeEvaluator = (answer) => (submission) => {
  return new RegExp(answer).test(submission);
};

const SECONDS_PER_QUESTIONS = 25;

let questions = [
  {
    question: "Who is the fastest man?",
    options: ["Bolt", "Elon Musk", "Simba", "Queen Elizabeth"],
    evaluate: makeEvaluator("Bolt"),
  },
  {
    question: "What country has the biggest population?",
    options: ["Australia", "United States", "China", "Fance"],
    evaluate: makeEvaluator("China"),
  },

  {
    question: "What is the largest country in the world?",
    options: ["Italy", "Romania", "Portugal", "Russia"],
    evaluate: makeEvaluator("Russia"),
  },
  {
    question: "What country has the tallest building in the world?",
    options: ["Dubai", "Ghana", "South Africa", "United States"],
    evaluate: makeEvaluator("Dubai"),
  },
];

const showElement = (/** @type HTMLElement */ element, visibile = false) => {
  if (!element) {
    return alert("Error: no element provided");
  }

  if (visibile == false && !element.classList.contains("hide")) {
    element.classList.add("hide");
  }

  if (visibile == true && element.classList.contains("hide")) {
    //make the element visible
    element.classList.remove("hide");
  }
};

let game_states = {
  qustions_total: 100,
  current_question_index: null,
  correct: 0,
  wrong: 0,
  game_state: "", //started, not_started, ended
  time: 30,
  time_remaining: 0,
  selectedOptionValue: null,
  lastAnswer: false
};

const showQuestionText = (num, question = "No question provided") => {
  document.querySelector(
    ".question_text"
  ).innerHTML = `<strong>${num+1}</strong>.  <span>${question}</span>`;
};

const showQuestionOptions = (/** @type {string[]} */ options) => {
  const optionsHtml = options
    .map((optionText, index) => {
      //return a radio button
      return `<div class="s12 m12">

    
        <label for="option__${index}">
            <input  class="with-gap" id="option__${index}" name="answer_candidate" type="radio" value="${optionText}" onclick="selectOption(this.value)">
            <span>${optionText}</span>
        </label>
        </div>`;
    })
    .join("");

  document.querySelector(".question_options").innerHTML = optionsHtml;
};

const showNextQuestion = (currentQuestionIndex) => {
  if (Number.isFinite(currentQuestionIndex)) {
    game_states.current_question_index += 1;
  } else {
    game_states.current_question_index = 0;
  }

  const nextQuestion = questions[game_states.current_question_index];
  showQuestionText(game_states.current_question_index, nextQuestion.question);
  showQuestionOptions(nextQuestion.options);

  activateQuestionControls(true);
  startTimer()
};

const setGameTime = (totalQuestion, timePerQuestion = SECONDS_PER_QUESTIONS) => {
  totalTimeRemaining = totalQuestion * timePerQuestion
  game_states.time = totalTimeRemaining;
  game_states.time_remaining = totalTimeRemaining;
  document.querySelector('.questionTimeRemainingText').textContent = SECONDS_PER_QUESTIONS
  document.querySelector('.totalTimeRemaining').textContent = game_states.time
};

const startQuestions = () => {
  //show questions
  showElement(document.querySelector(".question_runner"), true);
  showElement(document.querySelector(".start_btn"), false);
  showNextQuestion(game_states.current_question_index);
  setGameTime(questions.length );
};

const setGameState = (state, value) => {
  game_states[state] = value;

  if (game_states["game_state"] == "started") {
    startQuestions();
  }
};

const submitAnswer = () => {
  try {
    let question = questions[game_states.current_question_index];

    // evaluate and mark the answer
    if (question.evaluate(game_states.selectedOptionValue) == true) {
      //the answer is correct,
      endTimer()
      game_states.correct += 1;
      game_states.time_remaining = SECONDS_PER_QUESTIONS
      nextQuestion(true)
    } else {
      game_states.wrong += 1;

      /**
       * reset time_remaining : affects only the present question
       * 
       * take out all the time for a question out of alltime remaining: game_state.time
       */
      endTimer()
      game_states.time_remaining = SECONDS_PER_QUESTIONS// + game_states.time_remaining
      game_states.time -= SECONDS_PER_QUESTIONS //+ game_states.time_remaining
      nextQuestion()
    }

    document.querySelector(".show_next_btn").classList.remove("disabled");
  } catch (error) {
    console.error(error);
    alert("Error: retrieving selected answer");
  }
};

const showGameStats = () => {
  document.querySelector(".game_stats.total_questions").textContent =
    questions.length;

  document.querySelector(".game_stats.correct_questions").textContent =
    game_states.correct;

  document.querySelector(".game_stats.wrong_questions").textContent =
    game_states.wrong;
};

const nextQuestion = (previousAnswer=game_states.lastAnswer) => {
  if (game_states.current_question_index + 1 == questions.length) {
    showElement(document.querySelector(".game_ended"), true);
    showElement(document.querySelector(".question_runner"), false);
    showGameStats();
    return;
  }
  document.querySelector('.totalTimeRemaining').textContent = game_states.time
  showNextQuestion(game_states.current_question_index);
};

const activateQuestionControls = (hide = true) => {
  const controls = document.querySelectorAll(".question_control_btns");

  if (hide == true) {
    controls.forEach((btn) => btn.classList.add("disabled"));
  }

  if (hide == false) {
    document
      .querySelector(".question_control_btns.submit_answer_btn")
      .classList.remove("disabled");
  }
};

const selectOption = (value) => {
  activateQuestionControls(false);
  game_states.selectedOptionValue = value;
};

/**
 *
 * @returns {()=>} call the return value to stop the active timer
 */
const startTimer = () => {
  let elapsedTime = 0;
  let timer = setInterval(() => {
    if (elapsedTime == SECONDS_PER_QUESTIONS) {
      clearInterval(timer);
      timer = null;
      nextQuestion()
      // showNextQuestion(game_states.current_question_index);
      game_states.time_remaining -= SECONDS_PER_QUESTIONS;
      game_states.time -= SECONDS_PER_QUESTIONS
      document.querySelector('.totalTimeRemaining').textContent = game_states.time
    } else {
      elapsedTime += 1;
      document.querySelector('.questionTimeRemainingText').textContent = SECONDS_PER_QUESTIONS - elapsedTime
    }
  }, 1_000);

  endTimer = () => {
    if (!timer) {
      return 0;
    }

    clearInterval(timer);
    return SECONDS_PER_QUESTIONS - elapsedTime
  };

  return endTimer
};
