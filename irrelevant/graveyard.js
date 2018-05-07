async function getQuestionBanks(course){
  var res = await send(`https://byui.instructure.com/courses/${course}/question_banks`,"GET")
  var $ = cheerio.load(res.body)
  return $(".question_bank a.title:not(:contains('No Name'))").map((i,a) => {
    var $a = $(a)
    return {
      title: $a.html().trim(),
      id: $a.attr('href').match(/\d+$/)[0]
    }
  }).get()
}

async function deleteQuestionBank(course,id){
  var res = await send(`https://byui.instructure.com/courses/${course}/question_banks/${id}`,"POST",{
    _method:"DELETE"
  })
  if(res.statusCode != 200){
    var err = new Error("Couldn't delte Question Bank")
    err.statusCode = res.statusCode
    err.url = res.url
    throw err
  }
}

async function updateQuestionBank(course,id,title){
  var res = await send(`https://byui.instructure.com/courses/${course}/question_banks/${id}`,"POST",{
    _method:"PUT",
    assessment_question_bank:{
      title:title
    }
  })
  if(res.statusCode != 200){
    var err = new Error("Couldn't Update Question Bank")
    err.statusCode = res.statusCode
    err.url = res.url
    throw err
  }
  return JSON.parse(res.body)
}

var title = letters(Date.now()).slice(-5)
console.log(title)
var bank = await qb.createQuestionBank(11310,title).catch(console.error)
// var bank = await qb.updateQuestionBank(11310,bank.id,bank.title).catch(console.error)
console.log(bank)
var question = await qb.createQuestion(11310,bank.id,{
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
console.log(question)
question = await qb.updateQuestion(11310,bank.id,question.id,{
  question_text:"Now I'm a real question :)"
})
console.log(question)
//   var title = Date.now().toString(36).slice(-5)
//   var res = await send('https://byui.instructure.com/courses/11310/question_banks/82519/assessment_questions',{
//     "question": {

//     },
//     "assessment_question": {
//       "assessment_question_bank_id": "82519"
//     }
//   })
//   console.log(res.body)


async function updateQuestion(course,bankId,questionId,data){
  var res = await send(`https://byui.instructure.com/courses/${course}/question_banks/${bankId}/assessment_questions/${questionId}`,"POST",{
    question: data,
    assessment_question: {
      assessment_question_bank_id: bankId
    },
    _method:"PUT"
  })
  if(res.statusCode != 200){
    var err = new Error("Couldn't update question")
    err.statusCode = res.statusCode
    err.url = res.url
    throw err
  }
  return JSON.parse(res.body)
}


async function createQuestion(course,bankId,data){
  var res = await send(`https://byui.instructure.com/courses/${course}/question_banks/${bankId}/assessment_questions`,"POST",{
    question: data,
    assessment_question: {
      assessment_question_bank_id: bankId
    }
  })
  if(res.statusCode != 200){
    var err = new Error("Couldn't create question")
    err.statusCode = res.statusCode
    err.url = res.url
    throw err
  }
  return JSON.parse(res.body)
}