const nodemailer = require('nodemailer')

async function sendMail({from, to, subject, text, html}){
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_MAIL_USER,
            pass: process.env.SMTP_MAIL_PASS,
        }
    })

    let info = await transporter.sendMail({
                    from: `File Share <${from}>`,
                    to,
                    subject,
                    text,
                    html
                })

                console.log(info)

}



module.exports = sendMail