var QuestionBankTools = require('./main.js');

async function main() {
    const course = '80';
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD
    }

    var QuestionBanksKeys = await QuestionBankTools(inputs); // login with puppeteer
    const qbs = new QuestionBanksKeys.QuestionBanks(course); // create a new QuestionBanks for the course
    await qbs.getAll(); // get Question Banks from puppeteer
    for (let bank of qbs.questionBanks) {
        await bank.getQuestions(); // get questions for every Question Bank
    }
    console.dir(qbs, {
        depth: -1
    });
    await qbs.closePage(); // kill current page

    await QuestionBanksKeys.logout(); // kill current browser
}

main();