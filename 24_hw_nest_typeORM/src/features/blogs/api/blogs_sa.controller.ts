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
import { CommandBus } from '@nestjs/cqrs';

import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { UserAuthGuard } from '../../../base/guards/basic.guard';
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
import { CreatePostCommand } from '../../posts/application/command/createPost.command';
import { DeletePostCommand } from '../../posts/application/command/deletePost.command';
import { UpdatePostCommand } from '../../posts/application/command/updatePost.command';
import { PostsQueryRepository } from '../../posts/infrastructure/posts-query.repository';
import { CreateBlogCommand } from '../application/command/createBlog.command';
import { DeleteBlogCommand } from '../application/command/deleteBlog.command';
import { UpdateBlogCommand } from '../application/command/updateBlog.command';
import { BlogsQueryRepository } from '../infrastructure/blogs-query.repository';
import { BlogInputModelType } from './models/input/create-blog.input.model';
import { ApiHeaders, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateBlogEndpoint,
  CreatePostByBlogIdEndpoint,
  DeleteBlogEndpoint,
  DeletePostByBlogIdEndpoint,
  GetAllBlogsEndpoint,
  GetPosByBlogIdEndpoint,
  PutUpdatePostThrowBlogIdEndpoint,
  UpdateBlogEndpoint,
} from '../../../base/swagger/sa_blogs_endpoints';

@ApiTags('sa/blogs')
//@ApiHeaders([{ name: 'Authorization' }])
@Controller('sa/blogs')
export class BlogsControllerSA {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
    private postQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  //We have two ways how to use swagger decorators:
  //1. Use them as a function and pass the parameters to them
  //2. Use them as a decorator
  @GetAllBlogsEndpoint()
  // @ApiOperation({ summary: 'Get all blogs' })
  // @ApiResponse({ status: 200, type: PaginationBlogsType })
  // @ApiResponse({ status: 400, description: 'Unauthorized' })
  // @ApiSecurity('basic')
  @UseGuards(UserAuthGuard)
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogsPagination(pagination);
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @CreateBlogEndpoint()
  @UseGuards(UserAuthGuard)
  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.commandBus.execute<CreateBlogCommand, number>(
      new CreateBlogCommand(inputModel),
    );
    return this.blogsQueryRepository.getBlogById(newBlogId);
  }

  @ApiParam({ name: 'id', required: true, description: 'Blog id' })
  @UpdateBlogEndpoint()
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

  @DeleteBlogEndpoint()
  @ApiParam({ name: 'id', required: true, description: 'Blog id' })
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

  @CreatePostByBlogIdEndpoint()
  @ApiParam({ name: 'blogId', required: true, description: 'Blog id' })
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

  @ApiParam({ name: 'id', required: true, description: 'Blog id' })
  @GetPosByBlogIdEndpoint()
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

  @ApiParam({ name: 'blogId', required: true, description: 'Blog id' })
  @ApiParam({ name: 'postId', required: true, description: 'Post id' })
  @PutUpdatePostThrowBlogIdEndpoint()
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
  @ApiParam({ name: 'blogId', required: true, description: 'Blog id' })
  @ApiParam({ name: 'postId', required: true, description: 'Post id' })
  @DeletePostByBlogIdEndpoint()
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
