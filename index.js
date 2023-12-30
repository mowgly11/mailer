const nodemailer = require("nodemailer");
const wait = require("node:timers/promises").setTimeout;
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
const fs = require("node:fs");
const config = require("./config.json");

function input(prompt) {
  return new Promise((callbackFunction, errorFunction) => {
    readline.question(
      prompt,
      (userInput) => {
        callbackFunction(userInput);
      },
      () => {
        errorFunction();
      }
    );
  });
}

const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: config.user,
    pass: config.password,
  },
});

async function getInfo() {
  let subject = await input("Please specify a title/subject: ");
  let attachment = await input("Please specify a file path you want to send: ");

  const emailsFile = fs.readFileSync("./files/emails.txt", "utf-8");
  if (emailsFile === "") {
    readline.close();
    return console.log(
      "Please don't forget to fill the emails file with emails."
    );
  }

  if (subject == 0) {
    readline.close();
    return console.log("You can't send an empty email..");
  }

  const html = fs.readFileSync("./files/index.html", "utf-8");
  const text = fs.readFileSync("./files/text.txt", "utf-8");

  const emails = emailsFile.split("\n");

  let args = {
    from: config.user,
    subject,
    text,
    html: html.trim() === "" ? null : html,
  };

  for(let i = 0; i < emails.length; i++) {
    await wait(5000);

    args.to = emails[i];

    if (attachment)
      args.attachments = [
        {
          path: attachment,
        },
      ];

    transporter.sendMail(args, (err, info) => {
      if (err) throw new Error(err);
      console.log("Messag sent to " + emails[i]);
    });
  }

  readline.close();
}

getInfo();
