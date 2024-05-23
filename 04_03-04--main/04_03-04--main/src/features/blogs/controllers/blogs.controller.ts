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

import { QueryPaginationPipe } from '../../../infrastructure/decorators/transform/query-pagination.pipe';
import { AuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PaginationWithItems } from '../../common/types/output';
import { PostService } from '../../posts/services/post.service';
import { OutputPostType } from '../../posts/types/output';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import { BlogsService } from '../services/blogs.service';
import { GetPostForBlogCommand } from '../services/useCase/get-posts-for-blog.useCase';
import { BlogCreateModel, PostToBlogCreateModel } from '../types/input';
import { OutputBlogType } from '../types/output';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected readonly blogsQueryRepository: BlogsQueryRepository,
    protected readonly blogsService: BlogsService,
    protected readonly postService: PostService,
    protected readonly commandBus: CommandBus,
  ) {}

  @Get('')
  async getAllBlogs(
    @Query(QueryPaginationPipe) queryData: QueryPaginationResult,
  ): Promise<PaginationWithItems<OutputBlogType>> {
    return this.blogsQueryRepository.findAll(queryData);
  }

  @Get(':id')
  async getBlog(@Param('id') id: string): Promise<OutputBlogType> {
    const targetBlog = await this.blogsQueryRepository.findById(id);
    if (!targetBlog) throw new NotFoundException('Blog Not Found');
    return targetBlog;
  }

  @Post('')
  @UseGuards(AuthGuard)
  async createBlog(@Body() blogCreateData: BlogCreateModel): Promise<OutputBlogType> {
    return this.blogsService.createBlog(blogCreateData);
  }

  @Get(':blogId/posts')
  async getPostForBlog(
    @CurrentUser() userId: string,
    @Query(QueryPaginationPipe) queryData: QueryPaginationResult,
    @Param('blogId') blogId: string,
  ): Promise<PaginationWithItems<OutputPostType>> {
    return this.commandBus.execute(new GetPostForBlogCommand(userId, blogId, queryData));
  }

  @Post(':blogId/posts')
  @UseGuards(AuthGuard)
  async createPostToBlog(
    @Param('blogId') blogId: string,
    @Body() postData: PostToBlogCreateModel,
  ): Promise<OutputPostType> {
    const newPost: OutputPostType | null = await this.postService.createPost({ ...postData, blogId });
    if (!newPost) throw new NotFoundException('Blog Not Exist');
    return newPost;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() blogUpdateType: BlogCreateModel): Promise<void> {
    const updateResult = await this.blogsService.updateBlog(blogUpdateType, id);
    if (!updateResult) throw new NotFoundException('Blog Not Found');
    return;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const delteResult = await this.blogsService.deleteBlog(id);
    if (!delteResult) throw new NotFoundException('Blog Not Found');
    return;
  }
}
