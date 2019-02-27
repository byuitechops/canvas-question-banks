var getData = require('./puppeteerTools.js');
// const courseId = '46992';
const courseId = '80';

async function main() {
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD,
        url: 'byui.instructure.com'
    }

    try {
        await getData.login(inputs);
        var page = await getData.newPage();
        var questionBanks = await getData.getQuestionBanks(page, courseId);
        console.log(questionBanks);
        console.log(questionBanks.length);

        var qs = await getData.getQuestions(page, courseId, questionBanks[0].id);
        console.dir(qs, {
            depth: null
        });
    } catch (error) {
        console.log("error");
        console.log(error);
    }
    getData.logout();
}

main();