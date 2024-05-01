import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { MailService } from './mail.service';
import { AuthService } from "../features/auth/service/auth.service";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
          user: 'linesgreenTest@gmail.com',
          pass: 'knlc evir ufry fcbr',
        },
      },
      defaults: {
        from: 'Vlad_Nyah <linesgreenTest@gmail.com>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
