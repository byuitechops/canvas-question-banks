const QuestionBankTools = require('./main');
const course = '46246';
const inputs = {
  // your cct or admin canvas login information
  userName: process.env.USERNAMENODE,
  passWord: process.env.PASSWORD,
  // URL may be byui.instructure.com, byui.beta.instructure.com, or byui.test.instructure.com
  subdomain: 'byui.instructure.com',
  // Puppeteer Launch Options
  launchOptions: {
    defaultViewport: {
      width: 1900,
      height: 1080
    },
    args: ['--start-maximized'],
    headless: true,
    // devtools: true
  }

};

(async function main() {
  /* login with puppeteer and returns QuestionBanks class definition */
  var QuestionBanksKeys = await QuestionBankTools(inputs);
  /* Retrieves the list of QuestionBank objects that are in the course*/
  const qbs = new QuestionBanksKeys.QuestionBanks(course);
  /* Get Question Banks from puppeteer */
  await qbs.getAll();
  /* Get all questions from every Question Bank */
  for (let bank of qbs.questionBanks) {
    await bank.getQuestions(); // get questions for every Question Bank
  }

  /*
   * Adding a question to the question bank,
   * which should just be the normal object used to create a question
   * https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.create
   */
  var bank = qbs.questionBanks.find(bank => {
    return bank.id === 497767; // an example question bank in a SandBox course
  });
  var newQuestion = await bank.createQuestion({
    "question_name": letters(Math.random() * 100000),
    "assessment_question_id": "", // must be empty as Canvas will assign this
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
  });
  console.log("Created a question", newQuestion);

  /* Remove the question that we just created */
  await bank.deleteQuestion(newQuestion.id);
  console.log("We just deleted the question, the bank should be empty", bank);

  /* 
   * Kill the page for the current course
   * NOTE: This should be included if you intend to login once and run multiple courses,
   *       otherwise it is not necessary to kill a page for a single course being run
   */
  await qbs.closePage();

  /* Kill the current browser. You must ALWAYS kill the current browser after retrieving data */
  await QuestionBankTools.logout();
})();