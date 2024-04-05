import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { authProviders } from './features/auth';
import { AuthController } from './features/auth/controllers/auth.controller';
import { jwtConstants } from './features/auth/service/constants';
import { blogsProviders } from './features/blogs';
import { BlogsController } from './features/blogs/controllers/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/repositories/blogs-schema';
import { postProviders } from './features/posts';
import { PostsController } from './features/posts/controllers/posts.controller';
import { Post, PostSchema } from './features/posts/repositories/post-schema';
import { TestingController } from './features/testing/controllers/testing.controller';
import { userProviders } from './features/users';
import { UserController } from './features/users/controllers/user.controller';
import { User, UserSchema } from './features/users/repositories/users-schema';
import { ConfCodeIsValidConstraint } from './infrastructure/decorators/validate/conf-code.decorator';
import { EmailIsConformedConstraint } from './infrastructure/decorators/validate/email-is-conformed.decorator';
import { NameIsExistConstraint } from './infrastructure/decorators/validate/name-is-exist.decorator';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL!),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    MailModule,
  ],
  controllers: [BlogsController, PostsController, UserController, AuthController, TestingController],
  providers: [
    ...blogsProviders,
    ...postProviders,
    ...userProviders,
    ...authProviders,
    NameIsExistConstraint,
    ConfCodeIsValidConstraint,
    EmailIsConformedConstraint,
  ],
})
export class AppModule {}
