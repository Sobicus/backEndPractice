import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import {
  blogsPagination,
  paginationBlogsInputModelType,
} from '../../../base/helpers/pagination-blogs-helper';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import {
  PaginationPostsInputModelType,
  postsPagination,
} from '../../../base/helpers/pagination-posts-helpers';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { CommandBus } from '@nestjs/cqrs';
import { BlogsQueryRepositorySQL } from '../infrastructure/blogs-querySQL.repository';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsQueryRepositorySQL: BlogsQueryRepositorySQL,
    private postQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogsPagination(pagination);
    return await this.blogsQueryRepositorySQL.getAllBlogs(query);
  }

  @Get(':id')
  async getBlogById(@Param('id' /*ParseIntPipe*/) userId: string) {
    const res = await this.blogsQueryRepositorySQL.getBlogById(userId);
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query() query: PaginationPostsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.blogsQueryRepository.getBlogById(blogId);
    if (!res) {
      throw new NotFoundException();
    }
    const pagination = postsPagination(query);
    return this.postQueryRepository.getPostByBlogId(blogId, pagination, userId);
  }
}
