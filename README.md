# Canvas Question Banks
The Canvas API at time of writing does not have any endpoints pertaining to question banks. So we hacked together this module which takes your canvas cookies (however you figure out to get those) and wraps the clunky private api for question banks.

## Finding your cookies
The easiest way to find your cookies is going to any page on canvas, opening the inspect tool then in 

> Application > Storage > Cookies > https://byui.instructure.com 

You can find the value for `canvas_session` and `_csrf_token`

`canvas_session` has the `HTTP only` flag so it won't appear in `document.cookie`. You could probably get it programmatically by [puppeteering](https://github.com/GoogleChrome/puppeteer) into canvas then [catching the pages xhr requests](https://github.com/GoogleChrome/puppeteer/blob/v1.3.0/docs/api.md#class-request) which you could snatch the cookies off of. But I haven't tried it.

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

### QuestionBanks
- **course** <[Number]()>
- **questionBanks** <[[QuestionBank]]>
- async **getAll()**
  -  _returns_ <[[QuestionBank]]>
- async **create**(title)
  -  _returns_ <[QuestionBank]>
  - `title` <[String]()> The title of the new Question Bank
- async **delete**(id)
  - `id` <[Number]()> The id of the Question Bank to delete

### QuestionBank
- **_course** <[Number]()>
- **_id** <[Number]()>
- **_questions** <[[Question]]>
- async **update**(title)
  - _returns_ <[QuestionBank]>
  - `title` <[String]()> The updated title
- async **getQuestions**()
  - _returns_ <[[Question]]>
- async **createQuestion**(data)
  - _returns_ <[Question]>
  - `data` <[QuestionData](https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.create)> Follow normal canvas documentation for data
- async **deleteQuestion**(id)
  - `id` <[Number]()> The id of the Question to delete

### Question
- **_course** <[Number]()>
- **_bank** <[Number]()>
- **_id** <[Number]()>
- async **update**(data)
  - _returns_ <[Question]>
  - `data` <[QuestionData](https://canvas.instructure.com/doc/api/quiz_questions.html#method.quizzes/quiz_questions.update)> 


[QuestionBanks]: "#QuestionBanks"
[QuestionBank]: "#QuestionBank"
[Question]: "#Question"