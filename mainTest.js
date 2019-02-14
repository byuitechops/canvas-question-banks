var QuestionBankTools = require('./main.js');

async function main() {
    const course = '37054';
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD
    }

    var QuestionBanksKeys = await QuestionBankTools(inputs);
    const qbs = new QuestionBanksKeys.QuestionBanks(course);
    await qbs.getAll();
    for (let bank of qbs.questionBanks) {
        await bank.getQuestions();
    }
    console.dir(qbs, {
        depth: 3
    });
    await QuestionBanksKeys.logout();
}

main();