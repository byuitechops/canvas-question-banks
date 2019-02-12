var browser = require('puppeteer-canvas-login');
var page;

async function login(input) {
    page = await browser.login(input);
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
        if(data !== undefined){
            
            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

            data.authenticity_token = decodeURIComponent(data.authenticity_token);    
            data = objToFormString(data);
            
            debugger;
            httpRequest.send(data);
        } else{
            httpRequest.send();
        }
    });
}

async function httpGet(url) {
    //josh'sTempCode.js

    const result = await page.evaluate(makeRequest, url).then(JSON.parse);
    return result;
}

async function httpPost(url, data){
    var cookies = await page.cookies();
    
    data.authenticity_token = cookies.filter(cookie => cookie.name === "_csrf_token")[0].value;
    const result = await page.evaluate(makeRequest, url, "POST", data).then(JSON.parse);
    return result;
}

async function getQuestionBanks(courseId) {
    // make the call to get the banks
    try {

        var questionBanks = await httpGet(`https://byui.instructure.com/courses/${courseId}/question_banks/`);

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

async function getQuestions(courseId, bankId) {


    // make the call to get the banks
    try {
        var questions = [];
        var pageCount = 0;
        var questionsAPI;
        do {
            pageCount += 1;
            questionsAPI = await httpGet(`https://byui.instructure.com/courses/${courseId}/question_banks/${bankId}/questions/?page=${pageCount}`);
            questions = questions.concat(questionsAPI.questions);
        } while (pageCount !== questionsAPI.pages)
        
        // just want the ids
        questionIds= questions.map(question => question.assessment_question.id);

        for (const questionId of questionIds) {
            let postObj = {
                "assessment_question[assessment_question_bank_id]": bankId,
                _method: "PUT"
            }
            question = await httpPost(`https://byui.instructure.com/courses/${courseId}/question_banks/${bankId}/assessment_questions/${questionId}`,  postObj);
        }
        
        return questions;

    } catch (error) {
        error.message = `Get question bank list from course ${courseId} ERROR:\n${error.message}`
        throw error;
    }

    return questionBanks;
}



module.exports = {
    login: login,
    logout: browser.logout,
    getQuestionBanks: getQuestionBanks,
    getQuestions: getQuestions,
    httpGet: httpGet
}