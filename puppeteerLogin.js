var browser = require('puppeteer-canvas-login');
var page;

async function login(input) {
    page = await browser.login(input);
}

async function getQuestionBanks() {
    await page.goto(`https://byui.instructure.com/courses/${this.course}/question_banks`, {
        waitUntil: ['load', 'domcontentloaded']
    });
    var questionBanks = await page.$$eval(".question_bank a.title", aTags => {
        return aTags.map(aTag => {
            return {
                title: aTag.innerText.trim(),
                id: aTag.getAttribute('href').match(/\d+$/)[0]
            }
        });
    });

    return questionBanks;
}

async function getQuestions() {

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