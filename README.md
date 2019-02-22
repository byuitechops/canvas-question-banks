# Canvas Question Banks
The Canvas API at time of writing does not have any endpoints pertaining to question banks. So we hacked together this module which takes your canvas cookies (however you figure out to get those) and wraps the clunky private api for question banks.

## Finding your cookies
The easiest way to find your cookies is going to any page on canvas, opening the inspect tool then in 

> Application > Storage > Cookies > https://byui.instructure.com 

You can find the value for `canvas_session` and `_csrf_token`

`canvas_session` has the `HTTP only` flag so it won't appear in `document.cookie`. You could get them programmatically by [puppeteering](https://github.com/GoogleChrome/puppeteer) with code such as 
``` js
const puppeteer = require('puppeteer')
const auth = require('./auth.json')

async function getCookies(){
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto("https://byui.instructure.com/login/canvas")
  await page.type("#pseudonym_session_unique_id",auth.username)
  await page.type("#pseudonym_session_password",auth.password)
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]')
  ])
  var cookies = await page.cookies()
  await browser.close()
  return {
    canvas_session: cookies.find(n => n.name == 'canvas_session').value,
    _csrf_token: cookies.find(n => n.name == '_csrf_token').value,
  }
}

getCookies().then(console.log)
```
to go to the login page, login, then grab the cookies

## Getting Started

#### Install 
```
npm install --save git+https://git@github.com/byuitechops/canvas-question-banks.git
```
#### Set Up
``` js
const QB = require('canvas-question-banks')
const QuestionBanks = QB({
  canvas_session:"<INSERT canvas_session COOKIE HERE>",
  _csrf_token:"<INSERT _csrf_token COOKIE HERE>"
})

(async () => {
  /* Initialize with course id */
  const qbs = QuestionBanks(11310)
  /* Fetch all of the question banks */
  await qbs.getAll()
  console.log(qbs.questionBanks)
})
```

## API

- async **logout()**
- async **send**(url, method, data)
  - `url` <_String_> The URL to GET from
  - `method` <_String_> The send method, default = "GET"
  - `data` <[QuestionBank]>

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
