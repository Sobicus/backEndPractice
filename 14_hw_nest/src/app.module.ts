import { Module } from '@nestjs/common';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './features/blogs/domain/blogs.entity';
import { BlogsService } from './features/blogs/application/blogs.service';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsController } from './features/posts/api/models/posts.controller';
import { Posts, PostsSchema } from './features/posts/domain/posts.entity';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import {
  Comments,
  CommentsSchema,
} from './features/comments/domain/comments.entity';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query-repocitory';
import { CommentsController } from './features/comments/api/comments.controller';
import { Users, UsersSchema } from './features/users/domain/users.entity';
import { UsersController } from './features/users/api/users.controller';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { UsersService } from './features/users/application/users.service';
import { ConfigModule } from '@nestjs/config';
import { TestingAllDataController } from './features/dropAll/api/testing-all-data.controller';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWTService } from './base/application/jwt.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './base/mail/email-server.service';
import { join } from 'path';
import { ConfirmationCodeIsValidConstraint } from './features/auth/infrastructure/validate';
import { PasswordRecoveryRepository } from './features/users/infrastructure/accountData/passwordRecoveryRepository';
import {
  PasswordRecovery,
  PasswordRecoverySchema,
} from './features/users/infrastructure/accountData/passwordRecovery.entity';
import { LocalAuthGuard } from './base/guards/local-auth.guard';
import { LocalStrategy } from './base/guards/strategy/local/local.strategy';
import { PassportModule } from '@nestjs/passport';

const repositories = [
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
  UsersRepository,
  UsersQueryRepository,
  PasswordRecoveryRepository,
];

@Module({
  imports: [
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
          user: 'maksymdeveloper88@gmail.com',
          pass: process.env.EMAIL_PASS,
        },
      },
      defaults: {
        from: 'Maksym <maksymdeveloper88@gmail.com>',
      },
      template: {
        dir: join(__dirname + '/base/mail/template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
      { dbName: 'NestJSBD' },
    ),
    MongooseModule.forFeature([
      { name: Blogs.name, schema: BlogsSchema },
      { name: Posts.name, schema: PostsSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: Users.name, schema: UsersSchema },
      { name: PasswordRecovery.name, schema: PasswordRecoverySchema },
    ]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    AuthController,
    TestingAllDataController,
  ],
  providers: [
    ...repositories,
    BlogsService,
    PostsService,
    UsersService,
    AuthService,
    JWTService,
    EmailService,
    ConfirmationCodeIsValidConstraint,
    LocalStrategy,
    LocalAuthGuard,
  ],
})
export class AppModule {}
