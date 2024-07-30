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
import { BlogInputModelType } from './models/input/create-blog.input.model';
import {
  blogsPagination,
  paginationBlogsInputModelType,
} from '../../../base/helpers/pagination-blogs-helper';
import {
  PaginationPostsInputModelType,
  postsPagination,
} from '../../../base/helpers/pagination-posts-helpers';
import {
  BlogExistModel,
  PostChangeBody,
  PostChangeParam,
} from '../../posts/api/models/input/create-post.input.model';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { UserAuthGuard } from '../../../base/guards/basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/command/createBlog.command';
import { UpdateBlogCommand } from '../application/command/updateBlog.command';
import { DeleteBlogCommand } from '../application/command/deleteBlog.command';
import { CreatePostCommand } from '../../posts/application/command/createPost.command';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { UpdatePostCommand } from '../../posts/application/command/updatePost.command';
import { DeletePostCommand } from '../../posts/application/command/deletePost.command';

@Controller('sa/blogs')
export class BlogsControllerSA {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @UseGuards(UserAuthGuard)
  @Get()
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogsPagination(pagination);
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @UseGuards(UserAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.commandBus.execute<CreateBlogCommand, number>(
      new CreateBlogCommand(inputModel),
    );
    return this.blogsQueryRepository.getBlogById(newBlogId);
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
    @Body() inputModel: PostChangeBody,
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
    return await this.postQueryRepository.getPostById(post.data);
  }

  @UseGuards(UserAuthGuard)
  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query() query: PaginationPostsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.blogsQueryRepository.getBlogById(Number(blogId));
    if (!res) {
      throw new NotFoundException();
    }
    const pagination = postsPagination(query);
    return this.postQueryRepository.getPostByBlogId(blogId, pagination, userId);
  }

  @UseGuards(UserAuthGuard)
  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePost(
    @Param() putModel: PostChangeParam,
    @Body() inputModel: PostChangeBody,
  ) {
    const checkBlog = await this.blogsQueryRepository.getBlogById(
      Number(putModel.blogId),
    );
    if (!checkBlog) {
      throw new NotFoundException();
    }
    const res = await this.commandBus.execute(
      new UpdatePostCommand(putModel.postId, inputModel),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }

  @UseGuards(UserAuthGuard)
  @Delete(':blogId/posts/:postId')
  @HttpCode(204)
  async deletePost(@Param() putModel: PostChangeParam) {
    const res = await this.commandBus.execute(
      new DeletePostCommand(putModel.postId),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
