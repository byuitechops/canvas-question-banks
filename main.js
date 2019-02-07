var got = require('got')
var encode = require('form-urlencoded')
var cheerio = require('cheerio')
var browser = require('puppeteer-canavas-login');
var Input = null
var page

async function send(url,method="GET",data) {
  data && (data.authenticity_token = Cookies.token)
  return await got(url, {
    method:method,
    body:data && encode(data),
    headers: {
      cookie: `canvas_session=${Cookies.session}; _csrf_token=${Cookies.token}`,
    },
    throwHttpErrors:false,
    followRedirect:false,
  })
}

class QuestionBanks{
  constructor(course){
    this.course = course
    this.questionBanks
  }
  async getAll(){
    page = await browser.login(Input);
    await page.goto(`https://byui.instructure.com/courses/${this.course}/question_banks`, {
      waitUntil: ['load', 'domcontentloaded']});

    var res = await send(`https://byui.instructure.com/courses/${this.course}/question_banks`,"GET")
    var $ = cheerio.load(res.body)
    if(res.statusCode != 200){
      var err = new Error("Couldn't get Question Banks")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    this.questionBanks = $(".question_bank a.title:not(:contains('No Name'))").map((i,a) => {
      var $a = $(a)
      var qb = new QuestionBank(this.course,$a.attr('href').match(/\d+$/)[0])
      qb.setdata({
        title: $a.html().trim(),
        id: $a.attr('href').match(/\d+$/)[0]
      })
      return qb
    }).get()
    return this.questionBanks
  }
  async create(title){
    var res = await send(`https://byui.instructure.com/courses/${this.course}/question_banks`,"POST",{
      assessment_question_bank:{
        title:title
      }
    })
    if(res.statusCode != 302){
      var err = new Error("Couldn't Create Question Bank")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    await this.getAll()
    return this.questionBanks.find(n => n.title == title)
  }
  async delete(id){
    var index = this.questionBanks.findIndex(n => n.id == id)
    if(index == -1){
      throw new Error("I don't have that item")
    }
    this.questionBanks.splice(index,1)

    var res = await send(`https://byui.instructure.com/courses/${this.course}/question_banks/${id}`,"POST",{
      _method:"DELETE"
    })
    if(res.statusCode != 200){
      var err = new Error("Couldn't delete Question Bank")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
  }
}

class QuestionBank{
  constructor(course,id){
    this._course = course
    this._id = id
    this._questions = []
  }
  setdata(data){
    Object.assign(this,data)
  }
  async update(title){
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}`,"POST",{
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
    this.setdata(JSON.parse(res.body).assessment_question_bank)
    return this
  }
  async getQuestions(){
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}`,"GET")
    var $ = cheerio.load(res.body)
    if(res.statusCode != 200){
      var err = new Error("Couldn't get Question Banks")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    var questionIds = $('#questions .assessment_question_id').get().map(n => $(n).text())
    this._questions = await Promise.all(questionIds.map(async id => {
      var question = new Question(this._course,this._id,id)
      await question.update({})
      return question
    }))
    return this._questions
  }
  async createQuestion(data){
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}/assessment_questions`,"POST",{
      question: data,
      assessment_question: {
        assessment_question_bank_id: this._id
      }
    })
    if(res.statusCode != 200){
      var err = new Error("Couldn't create question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    var body = JSON.parse(res.body)
    var question = new Question(this._course,this._id,body.id)
    question.setdata(body)
    this._questions.push(question)
    return question
  }
  async deleteQuestion(id){
    var index = this._questions.findIndex(n => n.id == id)
    if(index == -1){
      throw new Error("I don't have that item")
    }
    this._questions.splice(index,1)

    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}/assessment_questions/${id}`,"POST",{
      _method:"DELETE"
    })
    if(res.statusCode != 200){
      var err = new Error("Couldn't create question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
  }
}

class Question{
  constructor(course,bank,id){
    this._course = course
    this._bank = bank
    this._id = id
  }
  setdata(data){
    Object.assign(this,data)
  }
  async update(data){
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._bank}/assessment_questions/${this._id}`,"POST",{
      question: data,
      assessment_question: {
        assessment_question_bank_id: this._bank
      },
      _method:"PUT"
    })
    if(res.statusCode != 200){
      var err = new Error("Couldn't update question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    this.setdata(JSON.parse(res.body))
    return this
  }
}

module.exports = function(inputs){
  if(!inputs.userName || !inputs.passWord){
    throw new Error("Missing login credentials")
  }
  Inputs = {
    userName:inputs.userName,
    passWord:inputs.passWord
  }
  return QuestionBanks
}