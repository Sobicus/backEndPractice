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
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query.repository';
import {
  Comments,
  CommentsSchema,
} from './features/comments/domain/comments.entity';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments.query-repocitory';
import { CommentsController } from './features/comments/api/comments.controller';
import { Users, UsersSchema } from './features/users/domain/users.entity';
import { UsersController } from './features/users/api/users.controller';
import { UsersRepository } from './features/users/infrastructure/users.repository';
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
import { LocalStrategy } from './base/guards/strategy/local/local.strategy';
import { PassportModule } from '@nestjs/passport';
import {
  Sessions,
  SessionsSchema,
} from './features/users/infrastructure/sessionsData/sessions.entity';
import { SessionService } from './features/users/infrastructure/sessionsData/session.service';
import { SessionsRepository } from './features/users/infrastructure/sessionsData/sessions.repository';
import { LoginGuard } from './base/guards/login.guard';
import { JwtAuthGuard } from './base/guards/jwt-refreash.guard';
import { UsersQueryRepository } from './features/users/infrastructure/users-query.repository';
import { JwtStrategy } from './base/guards/strategy/jwt/jwt-cookie.strategy';
import { JwtAccessStrategy } from './base/guards/strategy/jwt/jwt-header.strategy';
import { JwtAccessAuthGuard } from './base/guards/jwt-access.guard';
import { IsUserAlreadyExistConstraint } from './base/guards/emailOrLoginAlreadyExist.guard';
import { IsNotEmailExistConstraint } from './base/guards/emailIsNotExist.guard';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsService } from './features/comments/application/comments.service';

const repositories = [
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
  UsersRepository,
  UsersQueryRepository,
  PasswordRecoveryRepository,
  SessionsRepository,
  CommentsRepository,
];
const service = [
  BlogsService,
  PostsService,
  UsersService,
  AuthService,
  JWTService,
  EmailService,
  SessionService,
  CommentsService,
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
      { name: Sessions.name, schema: SessionsSchema },
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
    ...service,
    ConfirmationCodeIsValidConstraint,
    LocalStrategy,
    JwtStrategy,
    LoginGuard,
    JwtAuthGuard,
    JwtAccessStrategy,
    JwtAccessAuthGuard,
    IsUserAlreadyExistConstraint,
    IsNotEmailExistConstraint,
  ],
})
export class AppModule {}
