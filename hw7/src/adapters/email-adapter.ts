import nodemailer from "nodemailer";

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'maksymdeveloper88@gmail.com',
                pass: 'vwed nxvk qfag gerv'
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