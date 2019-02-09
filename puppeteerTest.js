var pupLogin = require('./puppeteerLogin.js');

async function main() {
    inputs = {
        userName: process.env.USERNAMENODE,
        passWord: process.env.PASSWORD
    }
    console.log(inputs);

    try {
        await pupLogin.login(inputs);
        var qBanks = await pupLogin.getQuestionBanks();
        console.log(qBanks);
    } catch (error) {
        console.log(error);
    }
}

main();