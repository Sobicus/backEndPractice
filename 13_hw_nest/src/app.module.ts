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

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017', { dbName: 'NestSJBD' }),
    MongooseModule.forFeature([
      { name: Blogs.name, schema: BlogsSchema },
      { name: Posts.name, schema: PostsSchema },
    ]),
  ],
  controllers: [BlogsController, PostsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsRepository,
    PostsService,
    PostsQueryRepository,
  ],
})
export class AppModule {}
