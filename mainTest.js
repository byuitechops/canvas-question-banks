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

    // var currentBank = qbs.questionBanks.find(bank => {
    //     return bank.id === 497767;
    // });
    console.dir(qbs.questionBanks, {
        depth: 4
    });
    await qbs.closePage(); // kill current page

    await QuestionBanksKeys.logout(); // kill current browser
}

main();