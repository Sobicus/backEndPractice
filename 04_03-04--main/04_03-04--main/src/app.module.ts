/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerModule } from '@nestjs/throttler';
import * as process from 'process';

import { authProviders, authUseCases } from './features/auth';
import { AuthController } from './features/auth/controllers/auth.controller';
import { GetInformationAboutUserCase } from './features/auth/service/useCases/user-get-information-about-me.useCase';
import { blogsProviders, blogsUseCases } from './features/blogs';
import { BlogsController } from './features/blogs/controllers/blogs.controller';
import { BlogIsExistConstraint } from './features/blogs/decorators/blog-is-exist.decorator';
import { Blog, BlogSchema } from './features/blogs/repositories/blogs-schema';
import { commentProviders, commentUseCases } from './features/comments';
import { CommentsController } from './features/comments/controller/comments.controller';
import { Comment, CommentSchema } from './features/comments/repositories/comments/comment.schema';
import { CommentLikes, CommentsLikesSchema } from './features/comments/repositories/likes/comment-like.schema';
import { postProviders, postsUseCases } from './features/posts';
import { PostsController } from './features/posts/controllers/posts.controller';
import { PostLikes, PostLikesSchema } from './features/posts/repositories/likes/post-likes.schema';
import { Post, PostSchema } from './features/posts/repositories/post/post.schema';
import { SecurityController } from './features/security/controllers/security.controller';
import { SessionDb, SessionSchema } from './features/security/repository/seesion.schema';
import { TestingController } from './features/testing/controllers/testing.controller';
import { userProviders } from './features/users';
import { UserController } from './features/users/controllers/user.controller';
import { User, UserSchema } from './features/users/repositories/users-schema';
import { QueryPaginationPipe } from './infrastructure/decorators/transform/query-pagination.pipe';
import { ConfCodeIsValidConstraint } from './infrastructure/decorators/validate/conf-code.decorator';
import { EmailIsConformedConstraint } from './infrastructure/decorators/validate/email-is-conformed.decorator';
import { LikeStatusConstraint } from './infrastructure/decorators/validate/like-status.decorator';
import { NameIsExistConstraint } from './infrastructure/decorators/validate/name-is-exist.decorator';
import { PostIsExistConstraint } from './infrastructure/decorators/validate/post-is-exist.decorator';
import { PayloadFromJwtMiddleware } from './infrastructure/middleware/payload-from-jwt.middleware';
import { CookieJwtStrategy } from './infrastructure/strategies/cookie.jwt.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { LikesToMapperManager } from './infrastructure/utils/likes-to-map-manager';
import { MailModule } from './mail/mail.module';

const strategies = [LocalStrategy, JwtStrategy, CookieJwtStrategy];
const decorators = [
  NameIsExistConstraint,
  EmailIsConformedConstraint,
  LikeStatusConstraint,
  ConfCodeIsValidConstraint,
  PostIsExistConstraint,
  BlogIsExistConstraint,
];

@Module({
  imports: [
    //Регистрируем для испльзования Passport strategy
    PassportModule,
    //Регистрируем для испльзования @CommandHandler
    CqrsModule,
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLikes.name, schema: CommentsLikesSchema },
      { name: PostLikes.name, schema: PostLikesSchema },
      { name: SessionDb.name, schema: SessionSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
    MailModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    UserController,
    AuthController,
    TestingController,
    CommentsController,
    SecurityController,
  ],
  providers: [
    ...blogsProviders,
    ...postProviders,
    ...userProviders,
    ...authProviders,
    ...commentProviders,
    ...authUseCases,
    ...blogsUseCases,
    ...commentUseCases,
    ...postsUseCases,
    GetInformationAboutUserCase,
    LikesToMapperManager,
    ...strategies,
    ...decorators,
    QueryPaginationPipe,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PayloadFromJwtMiddleware)
      .forRoutes(
        { path: 'comments/:commentId', method: RequestMethod.GET },
        { path: 'posts/:postId', method: RequestMethod.GET },
        { path: 'posts/:postId/comments', method: RequestMethod.GET },
        { path: 'posts', method: RequestMethod.GET },
        { path: 'blogs/:blogId/posts', method: RequestMethod.GET },
      );
  }
}
