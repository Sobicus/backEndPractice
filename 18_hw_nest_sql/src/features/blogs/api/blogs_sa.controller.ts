import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { BlogInputModelType } from './models/input/create-blog.input.model';
import {
  blogsPagination,
  paginationBlogsInputModelType,
} from '../../../base/helpers/pagination-blogs-helper';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import {
  PaginationPostsInputModelType,
  postsPagination,
} from '../../../base/helpers/pagination-posts-helpers';
import {
  BlogExistModel,
  PostInputModelBlogControllerType,
} from '../../posts/api/models/input/create-post.input.model';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { UserAuthGuard } from '../../../base/guards/basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/command/createBlog.command';
import { UpdateBlogCommand } from '../application/command/updateBlog.command';
import { DeleteBlogCommand } from '../application/command/deleteBlog.command';
import { CreatePostCommand } from '../../posts/application/command/createPost.command';
import { BlogsQueryRepositorySQL } from '../infrastructure/blogs-querySQL.repository';
import { PostsQueryRepositorySQL } from '../../posts/infrastructure/posts-querySQL.repository';

@Controller('sa/blogs')
export class BlogsControllerSA {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private blogsQueryRepositorySQL: BlogsQueryRepositorySQL,
    private postQueryRepository: PostsQueryRepository,
    private postQueryRepositorySQL: PostsQueryRepositorySQL,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogsPagination(pagination);
    return await this.blogsQueryRepositorySQL.getAllBlogs(query);
  }

  @UseGuards(UserAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.commandBus.execute(
      new CreateBlogCommand(inputModel),
    );
    return this.blogsQueryRepositorySQL.getBlogById(newBlogId);
  }

  @UseGuards(UserAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputModel: BlogInputModelType,
  ) {
    const res = await this.commandBus.execute(
      new UpdateBlogCommand(blogId, inputModel),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }

  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string) {
    const res = await this.commandBus.execute(new DeleteBlogCommand(blogId));
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    return;
  }

  @UseGuards(UserAuthGuard)
  @Post(':blogId/posts')
  async createPostByBlogId(
    @Param() { blogId }: BlogExistModel,
    @Body() inputModel: PostInputModelBlogControllerType,
  ) {
    const post = await this.commandBus.execute(
      new CreatePostCommand({
        ...inputModel,
        blogId,
      }),
    );
    if (post.status === 'NotFound') {
      throw new NotFoundException();
    }
    return await this.postQueryRepositorySQL.getPostById(post.data);
  }

  @UseGuards(UserAuthGuard)
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
    return this.postQueryRepositorySQL.getPostByBlogId(
      blogId,
      pagination,
      userId,
    );
  }
}
