var pupLogin = require('./puppeteerLogin.js');
// const courseId = '46992';
const courseId = '80';

async function main() {
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD
    }

    try {
        await pupLogin.login(inputs);
        var questionBanks = await pupLogin.getQuestionBanks(courseId);
        console.log(questionBanks);
        console.log(questionBanks.length);




        var qs = await pupLogin.getQuestions(courseId, questionBanks[0].id);
        console.log(qs);

    // console.log(questionIds);
    // console.log(questionIds.length);
    // var courseId = "80";
    // var response = await pupLogin.httpGet(`https://byui.instructure.com/courses/${courseId}/question_banks/`);
    // // console.log(JSON.parse(response));

    // var courseId = "80";
    // var bankId = "80338";
    // var response2 = await pupLogin.httpGet(`https://byui.instructure.com/courses/${courseId}/question_banks/${bankId}/questions`);
    // console.dir(JSON.parse(response2), {depth:null});

} catch (error) {
    console.log("error");
    console.log(error);
}
pupLogin.logout();
}

main();