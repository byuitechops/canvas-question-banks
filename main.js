var got = require('got');
var encode = require('form-urlencoded');
var getData = require('./puppeteerLogin.js');

async function logout() {
  await getData.logout();
}

async function send(url, method = "GET", data) {
  data && (data.authenticity_token = Cookies.token)
  return await got(url, {
    method: method,
    body: data && encode(data),
    headers: {
      cookie: `canvas_session=${Cookies.session}; _csrf_token=${Cookies.token}`,
    },
    throwHttpErrors: false,
    followRedirect: false,
  })
}

class QuestionBanks {
  constructor(course) {
    this.course = course
    this.questionBanks
    this.page = null
  }

  async killPage() {
    // await getData.killPage();
  }

  async assertPage() {
    if (this.page === null) {
      this.page = await getData.newPage();
    }
  }

  // to be run with Puppeteer
  async getAll() {
    await this.assertPage();
    var tmpBanks = await getData.getQuestionBanks(this.page, this.course);
    this.questionBanks = tmpBanks.map(bank => {
      var qb = new QuestionBank(this.page, this.course, bank.id);
      qb.setdata(bank);
      return qb;
    })
    return this.questionBanks;
  }
  async create(title) {
    var res = await send(`https://byui.instructure.com/courses/${this.course}/question_banks`, "POST", {
      assessment_question_bank: {
        title: title
      }
    })
    if (res.statusCode != 302) {
      var err = new Error("Couldn't Create Question Bank")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    await this.getAll() // Called in puppeteer
    return this.questionBanks.find(n => n.title == title)
  }
  async delete(id) {
    var index = this.questionBanks.findIndex(n => n.id == id)
    if (index == -1) {
      throw new Error("I don't have that item")
    }
    this.questionBanks.splice(index, 1)

    var res = await send(`https://byui.instructure.com/courses/${this.course}/question_banks/${id}`, "POST", {
      _method: "DELETE"
    })
    if (res.statusCode != 200) {
      var err = new Error("Couldn't delete Question Bank")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
  }
}

class QuestionBank {
  constructor(page, course, id) {
    this._course = course
    this._id = id
    this._questions = []
    this.page = page
  }
  setdata(data) {
    Object.assign(this, data)

  }
  async update(title) {
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}`, "POST", {
      _method: "PUT",
      assessment_question_bank: {
        title: title
      }
    })
    if (res.statusCode != 200) {
      var err = new Error("Couldn't Update Question Bank")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    this.setdata(JSON.parse(res.body).assessment_question_bank)
    return this
  }

  async getQuestions() {
    var questions = await getData.getQuestions(this.page, this._course, this._id);
    this._questions = questions.map(question => {
      var questionOut = new Question(this.page, this._course, this._id, question.id);
      questionOut.setdata(question);
      return questionOut;
    });

    return this._questions;
  }

  async createQuestion(data) {
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}/assessment_questions`, "POST", {
      question: data,
      assessment_question: {
        assessment_question_bank_id: this._id
      }
    })
    if (res.statusCode != 200) {
      var err = new Error("Couldn't create question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    var body = JSON.parse(res.body)
    var question = new Question(this._course, this._id, body.id)
    question.setdata(body)
    this._questions.push(question)
    return question
  }
  async deleteQuestion(id) {
    var index = this._questions.findIndex(n => n.id == id)
    if (index == -1) {
      throw new Error("I don't have that item")
    }
    this._questions.splice(index, 1)

    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}/assessment_questions/${id}`, "POST", {
      _method: "DELETE"
    })
    if (res.statusCode != 200) {
      var err = new Error("Couldn't create question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
  }
}

class Question {
  constructor(page, course, bank, id) {
    this._course = course
    this._bank = bank
    this._id = id
    this.page = page
  }
  setdata(data) {
    Object.assign(this, data)
  }
  async update(data) {
    var res = await send(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._bank}/assessment_questions/${this._id}`, "POST", {
      question: data,
      assessment_question: {
        assessment_question_bank_id: this._bank
      },
      _method: "PUT"
    })
    if (res.statusCode != 200) {
      var err = new Error("Couldn't update question")
      err.statusCode = res.statusCode
      err.url = res.url
      throw err
    }
    this.setdata(JSON.parse(res.body))
    return this
  }
}

module.exports = async function (inputs) {
  if (!inputs.userName || !inputs.passWord) {
    throw new Error("Missing login credentials")
  }

  // PUPPETEER LOGIN
  await getData.login(inputs);

  return {
    QuestionBanks: QuestionBanks,
    logout: logout
  }
}