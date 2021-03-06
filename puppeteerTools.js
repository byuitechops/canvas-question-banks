var browser = require('puppeteer-canvas-login');
var mapToCanvasQuestion = require('./mapToCanvasQuestionObj.js');
var isLoggedIn = false;
var subdomain = 'byui.instructure.com';

// login with puppeteer
async function login(input) {
    await browser.login(input);
    isLoggedIn = true;
    subdomain = input.subdomain;
    var page = await browser.newPage;
}

// create a new page instance, generally one page per course
async function newPage() {
    var page = await browser.newPage();
    await page.goto(`https://${subdomain}/`);
    return page;
}

// kill the given page
async function closePage(page) {
    await browser.closePage(page);
}

function makeRequest(url, method = "GET", data) {
    function objToFormString(obj) {
        if (obj === undefined) {
            return undefined;
        }

        var search = new URLSearchParams(data);

        return search.toString();
    }

    return new Promise(function (resolve, reject) {
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange = function () {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    resolve(httpRequest.responseText);
                } else {
                    reject(httpRequest.statusText);
                }
            }
        };

        httpRequest.open(method, url);

        httpRequest.setRequestHeader("Accept", "application/json; charset=UTF-8");
        if (data !== undefined) {

            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

            data.authenticity_token = decodeURIComponent(data.authenticity_token);
            data = objToFormString(data);

            httpRequest.send(data);
        } else {
            httpRequest.send();
        }
    });
}

async function httpGet(page, url) {
    const result = await page.evaluate(makeRequest, url).then(JSON.parse);
    return result;
}

async function httpPost(page, url, data) {
    var cookies = await page.cookies();

    data.authenticity_token = cookies.filter(cookie => cookie.name === "_csrf_token")[0].value;
    const result = await page.evaluate(makeRequest, url, "POST", data).then(JSON.parse);
    return result;
}

// get all banks from the given course
async function getQuestionBanks(page, courseId) {
    // make the call to get the banks
    try {
        var questionBanks = await httpGet(page, `https://${subdomain}/courses/${courseId}/question_banks/`);

        questionBanks = questionBanks.map(bank => {
            return {
                title: bank.assessment_question_bank.title,
                id: bank.assessment_question_bank.id
            };
        });

    } catch (error) {
        throw new Error(`Get question bank list from course ${courseId} ERROR:\n${error.message}`)
    }

    return questionBanks;
}

// get all questions from the given bank
async function getQuestions(page, courseId, bankId) {
    // make the call to get the banks
    try {
        var questions = [];
        var questionsOut = [];
        var pageCount = 0;
        var questionsAPI;
        do {
            pageCount += 1;
            questionsAPI = await httpGet(page, `https://${subdomain}/courses/${courseId}/question_banks/${bankId}/questions/?page=${pageCount}`);
            questions = questions.concat(questionsAPI.questions);
        } while (pageCount !== questionsAPI.pages)

        // map questions[] to canvasQuestionObj[]
        questionsOut = mapToCanvasQuestion(questions);
    } catch (error) {
        error.message = `Get question bank list from course ${courseId} ERROR:\n${error.message}`
        throw error;
    }

    return questionsOut;
}



module.exports = {
    login: login,
    newPage: newPage,
    closePage: closePage,
    logout: browser.logout,
    getQuestionBanks: getQuestionBanks,
    getQuestions: getQuestions,
    httpGet: httpGet
}