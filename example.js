const QB = require('./main')
const QuestionBanks = QB({
  canvas_session:"<INSERT canvas_session COOKIE HERE>",
  _csrf_token:"<INSERT _csrf_token COOKIE HERE>"
})

;(async () => {
  /* Initiates the QuestionBanks Class with the course id */
  const qbs = new QuestionBanks(11310)
  /* Retrieves the list of QuestionBank objects that are in the course*/
  const questionbanks = await qbs.getAll()

  /* Creating a new bank */
  var bank = await qbs.create("I'm a new question bank!")
  console.log("Created a bank",bank)

  /*
   * Adding a question to the question bank,
   * which should just be the normal object used to create a question
   * https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.create
   */
  var newQuestion = await bank.createQuestion({
    "question_name": letters(Math.random()*100000),
    "assessment_question_id": "",
    "question_type": "file_upload_question",
    "points_possible": "1",
    "correct_comments_html": "",
    "incorrect_comments_html": "",
    "neutral_comments_html": "",
    "question_text": "",
    "regrade_option": "",
    "position": "0",
    "text_after_answers": "",
    "matching_answer_incorrect_matches": ""
  })
  console.log("Created a question",newQuestion)

  /* Getting the list of questions in the bank (should just be the one question that we created) */
  var questions = await bank.getQuestions()
  console.log("List of questions in the bank",questions)

  /* Remove the question that we just created */
  await bank.deleteQuestion(newQuestion.id)
  console.log("We just deleted the question, the bank should be empty",bank)
})().catch(console.error)