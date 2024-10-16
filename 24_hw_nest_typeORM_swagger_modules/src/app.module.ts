import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

import { JWTService } from './base/application/jwt.service';
import { IsNotBlogExistConstraint } from './base/guards/blogIsNotExist.guard';
import { IsNotBlogExistInBodyConstraint } from './base/guards/blogIsNotExistInBody.guard';
import { IsNotEmailExistConstraint } from './base/guards/emailIsNotExist.guard';
import { IsUserAlreadyExistConstraint } from './base/guards/emailOrLoginAlreadyExist.guard';
import { JwtAccessAuthGuard } from './base/guards/jwt-access.guard';
import { LoginGuard } from './base/guards/login.guard';
import { JwtStrategy } from './base/guards/strategy/jwt/jwt-cookie.strategy';
import { JwtAccessStrategy } from './base/guards/strategy/jwt/jwt-header.strategy';
import { LocalStrategy } from './base/guards/strategy/local/local.strategy';
import { EmailService } from './base/mail/email-server.service';
import { JwtSoftAccessMiddleware } from './base/middleware/jwt-soft-access.middleware';
import configuration from './config/configuration';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { NewPasswordHandler } from './features/auth/application/command/newPassword.command';
import { PasswordRecoveryHandler } from './features/auth/application/command/passwordRecovery.command';
import { RegistrationConfirmationHandler } from './features/auth/application/command/registrationConfirmation.command';
import { RegistrationEmailResendingHandler } from './features/auth/application/command/registrationEmailResending.command';
import { RegistrationUserHandler } from './features/auth/application/command/registrationUser.command';
import { ConfirmationCodeIsValidConstraint } from './features/auth/decorators/validators/isValidConfirmationCode.decorator';
import { PasswordRecovery } from './features/auth/domain/passwordRecovery.entity';
import { PasswordRecoveryRepository } from './features/auth/infrastructure/passwordRecovery.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsControllerSA } from './features/blogs/api/blogs_sa.controller';
import { CreateBlogHandler } from './features/blogs/application/command/createBlog.command';
import { DeleteBlogHandler } from './features/blogs/application/command/deleteBlog.command';
import { UpdateBlogHandler } from './features/blogs/application/command/updateBlog.command';
import { Blogs } from './features/blogs/domain/blogs.entity';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs-query.repository';
import { CommentsController } from './features/comments/api/comments.controller';
import { CreateCommentHandler } from './features/comments/application/command/createComment.command';
import { DeleteCommentHandler } from './features/comments/application/command/deleteComment.command';
import { LikeCommentUpdateHandler } from './features/comments/application/command/likeCommentUpdate.command';
import { UpdateCommentHandler } from './features/comments/application/command/updateComment.command';
import { Comments } from './features/comments/domain/comments.entity';
import { CommentsLikesInfo } from './features/comments/domain/comments-likesInfo.entity';
import { CommentsRepository } from './features/comments/infrastructure/comments.repository';
import { CommentsLikesInfoRepository } from './features/comments/infrastructure/comments-likesInfo.repository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments-query.repository';
import { TestingAllDataController } from './features/dropAll/api/testing-all-data.controller';
import { PostsController } from './features/posts/api/models/posts.controller';
import { CreatePostHandler } from './features/posts/application/command/createPost.command';
import { DeletePostHandler } from './features/posts/application/command/deletePost.command';
import { UpdatePostHandler } from './features/posts/application/command/updatePost.command';
import { UpdatePostLikeHandler } from './features/posts/application/command/updatePostLike.command';
import { Posts } from './features/posts/domain/posts.entity';
import { PostsLikesInfo } from './features/posts/domain/posts-likesInfo.entity';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsLikesInfoRepository } from './features/posts/infrastructure/posts-likesInfo.repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query.repository';
import { SecurityDevicesController } from './features/SecurityDevices/api/securityDevices.controller';
import { CreateDeviceSessionHandler } from './features/SecurityDevices/application/command/createDeviceSession.command';
import { DeleteSessionHandler } from './features/SecurityDevices/application/command/deleteSession.command';
import { DeleteDeviceSessionHandler } from './features/SecurityDevices/application/command/deleteSessionDevice.command';
import { DeleteSessionExceptThisHandler } from './features/SecurityDevices/application/command/deleteSessionsDevicesExceptThis.command';
import { FindSessionByUserIdAndDeviceIdHandler } from './features/SecurityDevices/application/command/findSessionByUserIdAndDeviceId.command';
import { FindActiveSessionHandler } from './features/SecurityDevices/application/command/getAllActiveSessions.command';
import { UpdateSessionHandler } from './features/SecurityDevices/application/command/updateSession.command';
import { Sessions } from './features/SecurityDevices/domain/sessions.entity';
import { SessionsRepository } from './features/SecurityDevices/infrastructure/sessions.repository';
import { UsersController } from './features/users/api/users.controller';
import { CreateUserHandler } from './features/users/application/command/createUser.command';
import { DeleteUserHandler } from './features/users/application/command/deleteUser.command';
import { UsersService } from './features/users/application/users.service';
import { EmailConfirmation } from './features/users/domain/emailConfirmation.entity';
import { Users } from './features/users/domain/users.entity';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersQueryRepository } from './features/users/infrastructure/users-query.repository';

const repositoriesSQL = [
  UsersRepository,
  UsersQueryRepository,
  SessionsRepository,
  PasswordRecoveryRepository,
  BlogsRepository,
  BlogsQueryRepository,
  PostsRepository,
  PostsQueryRepository,
  CommentsRepository,
  CommentsQueryRepository,
  CommentsLikesInfoRepository,
  PostsLikesInfoRepository,
];
const repositories = [...repositoriesSQL];
const service = [UsersService, AuthService, JWTService, EmailService];
const commands = [
  CreateBlogHandler,
  UpdateBlogHandler,
  DeleteBlogHandler,
  DeleteCommentHandler,
  UpdateCommentHandler,
  CreateCommentHandler,
  LikeCommentUpdateHandler,
  CreatePostHandler,
  UpdatePostHandler,
  DeletePostHandler,
  UpdatePostLikeHandler,
  RegistrationUserHandler,
  RegistrationConfirmationHandler,
  RegistrationEmailResendingHandler,
  PasswordRecoveryHandler,
  NewPasswordHandler,
  CreateUserHandler,
  DeleteUserHandler,
  CreateDeviceSessionHandler,
  FindSessionByUserIdAndDeviceIdHandler,
  DeleteSessionHandler,
  UpdateSessionHandler,
  FindActiveSessionHandler,
  DeleteSessionExceptThisHandler,
  DeleteDeviceSessionHandler,
];
@Module({
  imports: [
    TypeOrmModule.forRoot({
      logging: true,
      url: process.env.DATABASE_URL,
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '2456',
      database: 'socialHM',
      synchronize: true,
      autoLoadEntities: true,
      entities: [
        Users,
        EmailConfirmation,
        Posts,
        Sessions,
        PasswordRecovery,
        Blogs,
        Comments,
        CommentsLikesInfo,
        PostsLikesInfo,
      ],
    }),
    TypeOrmModule.forFeature([
      Users,
      EmailConfirmation,
      Posts,
      Sessions,
      PasswordRecovery,
      Blogs,
      Comments,
      CommentsLikesInfo,
      PostsLikesInfo,
    ]),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5000,
      },
    ]),
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
    CqrsModule,
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
      { dbName: 'NestJSBD' },
    ),
    MongooseModule.forFeature([]),
  ],
  controllers: [
    BlogsController,
    BlogsControllerSA,
    PostsController,
    CommentsController,
    UsersController,
    AuthController,
    TestingAllDataController,
    SecurityDevicesController,
  ],
  providers: [
    ...commands,
    ...repositories,
    ...service,
    ConfirmationCodeIsValidConstraint,
    LocalStrategy,
    JwtStrategy,
    LoginGuard,

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
