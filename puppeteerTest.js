var pupLogin = require('./puppeteerLogin.js');
const course = '46992';

async function main() {
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD
    }

    try {
        await pupLogin.login(inputs);
        var questionBanks = await pupLogin.getQuestionBanks(course);
        // console.log(questionBanks);
        // console.log(questionBanks.length);

        // var questionIds = questionBanks.map(async qBank => {
        //     var qIds = await pupLogin.getQuestions(course, qBank.id);
        //     return qIds;
        // });

        var questionIds = [];
        for (const qBank of questionBanks) {
            questionIds.push(await pupLogin.getQuestions(course, qBank.id));
        }

        console.log(questionIds);
        console.log(questionIds.length);
    } catch (error) {
        console.log(error);
    }
}

main();