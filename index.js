process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 1;

const express = require("express");
const app = express();
const urlencoded = require("body-parser").urlencoded({ extended: false });
const nodemailer = require("nodemailer");
const config = require("./config.json");
const formidable = require('formidable');

const transporter = nodemailer.createTransport({
    service: "hotmail",
    auth: {
        user: config.user,
        pass: config.password,
    },
});

let PORT = 80;

app.set("view engine", "ejs");
app.set("etag", false);

app.use(urlencoded);
app.use(express.static(__dirname + "/views"));

app.listen(PORT, () => console.log(`listening to port ${PORT}`));

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/done", (req, res) => {
    res.render("done.ejs");
});

app.post("/", async (req, res) => {
    try {
        const args = {
            from: config.user,
            to: req.body.email,
            subject: req.body.title,
            text: req.body.text,
            html: null,
        };

        transporter.sendMail(args, (err) => {
            if (err) return res.send("<h1>Failed To Send The Email.</h1>\
            <br><br>" + err + "<p><br>Invalid Email Address.</p>\
            <br><a href='/'>Back to Home Page</a>");

            res.redirect("/done");
        });
    } catch (err) {
        console.error(err);
        return res.redirect("/");
    }
});

app.post("/multiple", (req, res) => {
    for(i = 0; i < emails.length; i++) {
        const args = {
            from: config.user,
            to: req3122
        }
    }
});

app.all("*", (req, res) => {
    res.status(404).send("<div style='display: flex; justify-content: center; align-items: center; flex-direction: column;'>\
    <h1 style='font-size: 5em;'>404</h1>\
    <p>Seems like we didn't find your page.</p>\
    <a href='/'>Back to main page</a>\
    </div>");
});