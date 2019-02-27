# Canvas Question Banks
The Canvas API at time of writing does not have any endpoints pertaining to question banks. So we hacked together this module which uses Puppeteer to fetch questions from question banks without using any API calls.

## Getting Started

#### Install 
```
npm install --save git+https://git@github.com/byuitechops/canvas-question-banks.git
```
#### Set Up
```javascript
const QuestionBankTools = require('./main');
const course = '46246'; // desired course to get question banks from
const inputs = {
  // your cct or admin canvas login information
  userName: process.env.USERNAMENODE,
  passWord: process.env.PASSWORD,
  // URL may be byui.instructure.com, byui.beta.instructure.com, or byui.test.instructure.com (optional)
  subdomain: 'byui.instructure.com',
  // Puppeteer Launch Options, follows the Puppeteer documentation (optional)
  launchOptions: {
    defaultViewport: {
      width: 1900,
      height: 1080
    },
    args: ['--start-maximized'],
    headless: true,
    devtools: true
  }
};

/* login with puppeteer and return QuestionBanks class definition */
var QuestionBanksKeys = await QuestionBankTools(inputs);
/* create a QuestionBanks class object to allocate */
const qbs = new QuestionBanksKeys.QuestionBanks(course);
/* get all Question Banks from course through puppeteer */
await qbs.getAll();
/* get all Questions in all banks */
for (let bank of qbs.questionBanks) {
  await bank.getQuestions(); // get questions for every Question Bank
}
/* kill the current page for the current course */
await qbs.closePage();
/* logout of canvas and kill the current browser */
await QuestionBanksKeys.logout();
```

## API

- async **QuestionBanks()** <_class constructor_>
- async **logout()**

### QuestionBanks
- **course** <_Number_>
- **questionBanks** <[[QuestionBank]]>
- **page** <_Page_>
- async **closePage()**
- async **assertPage()**
- async **getAll()**
  -  _returns_ <[[QuestionBanks]]>
- async **create**(title)
  -  _returns_ <[QuestionBank]>
  - `title` <_String_> The title of the new Question Bank
- async **delete**(id)
  - `id` <_Number_> The id of the Question Bank to delete

### QuestionBank
- **_course** <_Number_>
- **_id** <_Number_>
- **_questions** <[[Question]]>
- **page** <_Page_>
- async **update**(title)
  - _returns_ <[QuestionBank]>
  - `title` <_String_> The updated title
- async **getQuestions**()
  - _returns_ <[[Question]]>
- async **createQuestion**(data)
  - _returns_ <[Question]>
  - `data` <[QuestionData](https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.create)> Follow normal canvas documentation for data
- async **deleteQuestion**(id)
  - `id` <_Number_> The id of the Question to delete

### Question
- **_course** <_Number_>
- **_bank** <_Number_>
- **_id** <_Number_>
- **page** <_Page_>
- async **update**(data)
  - _returns_ <[Question]>
  - `data` <[QuestionData](https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.update)> 


[QuestionBanks]: #questionbanks
[QuestionBank]: #questionbank
[Question]: #question
