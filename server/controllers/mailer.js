import nodemailer from 'nodemailer';
import ENV from '../config.js';
import mailgen from 'mailgen';

// export async function setupMailer (req, res) {
//     let testAccount = await nodemailer.createTestAccount();

//     const transporter = nodemailer.createTransport({
//         host: "smtp.forwardemail.net",
//         port: 587,
//         secure: false,
//         auth: {
//           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//           user: testAccount.user,
//           pass: testAccount.pass
//         },
//       });

//       let message = {
//         from: '"Fred Foo 👻" <foo@example.com>', // sender address
//         to: "bar@example.com, baz@example.com", // list of receivers
//         subject: "Hello ✔", // Subject line
//         text: "Hello world?", // plain text body
//         html: "<b>Hello world?</b>", // html body
//     }

//     transporter.sendMail(message)
//     .then((info) => {
//         return res.status(201)
//         .json({ 
//             msg : "Mail sent successfully",
//             info : info.messageId,
//             preview : nodemailer.getTestMessageUrl(info)
//         });
//     })
//     .catch((error) => {
//         return res.status(500).json({ error: error.message });
//     })
// }

export async function sendMail(req, res) {

    // find from database by using username
    const { userEmail } = req.body;

    let config = {
        service : 'gmail',
        auth : {
            user : ENV.EMAIL,
            pass : ENV.PASSWORD,
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new mailgen({
        theme : 'default',
        product : {
            name : 'Boost Food',
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body : {
            name : "User",
            intro : "Your OTP code to reset password",
            table : {
                data : {
                    OTP : req.app.locals.OTP
                }
            }
        }
    }

    let mail = MailGenerator.generate(response);
    let message = {
        form : ENV.EMAIL,
        to : userEmail,
        subject : "Your OTP code to reset password",
        html : mail
    }
    transporter.sendMail(message)
    .then(() => {
        return res.status(201).json({ msg : "Mail already send" });
    })
    .catch(err => {
        return res.status(500).json({err: err.message });
    });
}