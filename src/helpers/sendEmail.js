const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, html) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.USR_EMAIL,
            pass: process.env.USR_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.USR_EMAIL,
        to: email,
        subject: subject,
        html: html
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
            return false;
        } else {
            console.log('Email sent: ', info.response);
            return true;
        }
    });
}

module.exports = {sendEmail};