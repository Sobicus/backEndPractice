import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Blogs, BlogsSchema } from './features/blogs/domain/blogs.entity';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs-query.repository';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsService } from './features/posts/application/posts.service';
import { PostsController } from './features/posts/api/models/posts.controller';
import { Posts, PostsSchema } from './features/posts/domain/posts.entity';
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query.repository';
import {
  Comments,
  CommentsSchema,
} from './features/comments/domain/comments.entity';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments-query.repository';
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
import {
  CommentsLikesInfo,
  CommentsLikesInfoSchema,
} from './features/likesInfo/comments-likesInfo/domain/comments-likesInfo.entity';
import { CommentsLikesInfoRepository } from './features/likesInfo/comments-likesInfo/infrastructure/comments-likesInfo.repository';
import { CommentsLikesInfoService } from './features/likesInfo/comments-likesInfo/application/comments-likesInfo.service';
import { JwtSoftAccessMiddleware } from './base/middleware/jwt-soft-access.middleware';
import {
  PostsLikesInfo,
  PostsLikesInfoSchema,
} from './features/likesInfo/posts-likeInfo/domain/posts-likesInfo.entity';
import { PostsLikesInfoService } from './features/likesInfo/posts-likeInfo/application/posts-likesInfo.service';
import { PostsLikesInfoRepository } from './features/likesInfo/posts-likeInfo/infrastructure/posts-likesInfo.repository';
import { IsNotBlogExistConstraint } from './base/guards/blogIsNotExist.guard';
import { IsNotBlogExistInBodyConstraint } from './base/guards/blogIsNotExistInBody.guard';
import { CreateBlogHandler } from './features/blogs/application/command/createBlog.command';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateBlogHandler } from './features/blogs/application/command/updateBlog.command';
import { DeleteBlogHandler } from './features/blogs/application/command/deleteBlog.command';
import { RegistrationUserHandler } from './features/auth/application/command/registrationUser.command';
import { RegistrationConfirmationHandler } from './features/auth/application/command/registrationConfirmation.command';
import { RegistrationEmailResendingHandler } from './features/auth/application/command/registrationEmailResending.command';
import { PasswordRecoveryHandler } from './features/auth/application/command/passwordRecovery.command';
import { NewPasswordHandler } from './features/auth/application/command/newPassword.command';
import { FindSessionByUserAndDeviceIdsHandler } from './features/users/infrastructure/sessionsData/command/findSessionByUserAndDeviceIds.command';
import { DeleteSessionHandler } from './features/users/infrastructure/sessionsData/command/deleteSession.command';
import { UpdateSessionHandler } from './features/users/infrastructure/sessionsData/command/updateSession.command';
import { CreateDeviceSessionHandler } from './features/users/infrastructure/sessionsData/command/createDeviceSession.command';
import { DeleteCommentHandler } from './features/comments/application/command/deleteComment.command';
import { CommentsLikesHandler } from './features/likesInfo/comments-likesInfo/application/command/likeCommentUpdate.command';
import { CreatePostHandler } from './features/posts/application/command/createPost.command';
import { updatePostHandler } from './features/posts/application/command/updatePost.command';

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
  CommentsLikesInfoRepository,
  PostsLikesInfoRepository,
];
const service = [
  PostsService,
  UsersService,
  AuthService,
  JWTService,
  EmailService,
  SessionService,
  CommentsService,
  CommentsLikesInfoService,
  PostsLikesInfoService,
];
const commands = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  RegistrationUserHandler,
  RegistrationConfirmationHandler,
  RegistrationEmailResendingHandler,
  PasswordRecoveryHandler,
  NewPasswordHandler,
  FindSessionByUserAndDeviceIdsHandler,
  DeleteSessionHandler,
  UpdateSessionHandler,
  CreateDeviceSessionHandler,
  DeleteCommentHandler,
  CommentsLikesHandler,
  CreatePostHandler,
  updatePostHandler,
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
      { name: CommentsLikesInfo.name, schema: CommentsLikesInfoSchema },
      { name: PostsLikesInfo.name, schema: PostsLikesInfoSchema },
    ]),
    CqrsModule,
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
    ...commands,
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
    IsNotBlogExistConstraint,
    IsNotBlogExistInBodyConstraint,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtSoftAccessMiddleware)
      .forRoutes(
        { path: 'comments/:id', method: RequestMethod.GET },
        { path: 'posts/:id/comments', method: RequestMethod.GET },
        { path: 'posts', method: RequestMethod.GET },
        { path: 'posts/:id', method: RequestMethod.GET },
        { path: 'blogs/:id/posts', method: RequestMethod.GET },
      );
  }
}
