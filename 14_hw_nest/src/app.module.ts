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

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URL || 'mongodb://127.0.0.1:27017',
      { dbName: 'NestSJBD' },
    ),
    MongooseModule.forFeature([
      { name: Blogs.name, schema: BlogsSchema },
      { name: Posts.name, schema: PostsSchema },
      { name: Comments.name, schema: CommentsSchema },
      { name: Users.name, schema: UsersSchema },
    ]),
  ],
  controllers: [
    BlogsController,
    PostsController,
    CommentsController,
    UsersController,
    TestingAllDataController,
  ],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsService,
    PostsQueryRepository,
    CommentsQueryRepository,
    UsersRepository,
    UsersQueryRepository,
    UsersService,
  ],
})
export class AppModule {}
