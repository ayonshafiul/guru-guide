const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "facultyreview21@gmail.com",
        pass: "aszxaszx1"
    }
});

const email = {
    from: "facultyreviewteam@gmail.com",
    to: "ayonshafiul@gmail.com, mansura3330@gmail.com",
    subject: "Taka dao",
    text: "Dude, taka dao!"
}

transporter.sendMail(email, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log(info);
    }
})

transporter.sendMail(email, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log(info);
    }
})
transporter.sendMail(email, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log(info);
    }
})
