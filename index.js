const nodemailer = require("nodemailer");
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
const fs = require('node:fs');
const config = require('./config.json');

function input(prompt) {
    return new Promise((callbackFunction, errorFunction) => {
        readline.question(prompt, (userInput) => {
            callbackFunction(userInput);
        }, () => {
            errorFunction();
        });
    });
}

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: config.user,
        pass: config.password
    }
});

async function getInfo() {
    let subject = await input("Please specify a title/subject: ");
    let text = await input("Please specify a text: ");

    const emailsFile = fs.readFileSync('./files/emails.txt', 'utf-8');
    if(emailsFile === '') {
        readline.close();
        return console.log("Please don't forget to fill the emails file with emails.");
    }

    if (subject == 0 || text == 0) {
        readline.close();
        return console.log("You can't send an empty email..");
    }

    let args = {
        from: config.user,
        to: emailsFile.split("\n"),
        subject: subject,
        text: text,
        html: fs.readFileSync('./files/index.html', 'utf-8') ?? null
    }

    transporter.sendMail(args, (err, info) => {
        if (err) throw new Error(err);
        console.log("Messages sent!");
    });

    readline.close();
};

getInfo();