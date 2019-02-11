var browser = require('puppeteer-canvas-login');
var page;

async function login(input) {
    page = await browser.login(input);
}

async function getQuestionBanks(course) {
    // await page.goto(`https://byui.instructure.com/courses/${this.course}/question_banks`, {
    //     waitUntil: ['load', 'domcontentloaded']
    // });

    await page.goto(`https://byui.instructure.com/courses/${course}/question_banks`, {
        waitUntil: ['load', 'domcontentloaded']
    });

    var questionBanks = await page.$$eval(".question_bank a.title", aTags => {
        return aTags.map(aTag => {
            return {
                title: aTag.innerText.trim(),
                id: aTag.getAttribute('href').slice(-6) //.match(/\d+$/)[0]
            }
        }).filter(aTag => {
            return aTag.title !== 'No Name';
        });
    });

    return questionBanks;
}

async function getQuestions(_course, _id) {
    // await page.goto(`https://byui.instructure.com/courses/${this._course}/question_banks/${this._id}`, {
    //     waitUntil: ['load', 'domcontentloaded']
    // });

    await page.goto(`https://byui.instructure.com/courses/${_course}/question_banks/${_id}`, {
        waitUntil: ['load', 'domcontentloaded']
    });

    var questionIds = await page.$$eval('#questions .assessment_question_id', qIds => {
        return qIds.map(qId => {
            return qId.innerText.trim();
        });
    });

    return questionIds;
}

async function httpRequest() {
    //josh'sTempCode.js
}

module.exports = {
    login: login,
    getQuestionBanks: getQuestionBanks,
    getQuestions: getQuestions,
    httpRequest: httpRequest
}