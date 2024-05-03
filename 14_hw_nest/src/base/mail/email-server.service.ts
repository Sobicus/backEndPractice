import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendUserConfirmationCode(
    email: string,
    userName: string,
    confirmationCode: string,
  ): Promise<void> {
    const url = `https://somesite.com/confirm-email?code=${confirmationCode}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Thanks for registration! Confirm your Email',
        template: './registration',
        context: {
          userName,
          url,
          confirmationCode,
        },
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.log('Error sending email', e);
      });
  }
  async sendPasswordRecoveryCode(
    email: string,
    userName: string,
    passwordRecoveryCode: string,
  ): Promise<void> {
    const url = `https://somesite.com/confirm-email?code=${passwordRecoveryCode}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Password recovery',
        template: './password-recovery',
        context: {
          userName,
          url,
          passwordRecoveryCode,
        },
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.log('Error sending email', e);
      });
  }
}
