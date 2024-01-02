import nodemailer from "nodemailer";
import {config} from 'dotenv'

config()
export const emailPasswordRecoveryAdapter = {
    async sendEmail(email: string, /*subject: string, message: string*/recoveryCode: string) {

        const subject = '<h1>Password recovery</h1>'
        const message = ` <h1>Password recovery</h1>
       <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
      </p>`

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'maksymdeveloper88@gmail.com',
                pass: process.env.EMAIL_PASS
            }
        });

        async function main() {
            const info = await transporter.sendMail({
                from: 'Maksym <maksymdeveloper88@gmail.com>', // sender address
                to: email, // list of receivers
                subject: subject, // Subject line
                html: message, // html body
            });
            console.log(info)
            console.log("Message sent: %s", info.messageId);
            return info
        }

        main().catch(console.error);
    }
}