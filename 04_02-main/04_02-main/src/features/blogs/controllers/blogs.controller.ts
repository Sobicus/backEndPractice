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

import { AuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import { PaginationWithItems } from '../../common/types/output';
import { PostsQueryRepository } from '../../posts/repositories/posts.query.repository';
import { PostService } from '../../posts/services/postService';
import { PostSortData } from '../../posts/types/input';
import { OutputPostType } from '../../posts/types/output';
import { BlogsQueryRepository } from '../repositories/blogs.query.repository';
import { BlogsService } from '../services/blogs.service';
import { BlogCreateModel, BlogSortData, BlogUpdateType, PostToBlogCreateModel } from '../types/input';
import { OutputBlogType } from '../types/output';

@Controller('blogs')
export class BlogsController {
  constructor(
    protected readonly blogsQueryRepository: BlogsQueryRepository,
    protected readonly postQueryRepository: PostsQueryRepository,
    protected readonly blogsService: BlogsService,
    protected readonly postService: PostService,
  ) {}

  @Get('')
  async getAllBlogs(@Query() queryData: BlogSortData): Promise<PaginationWithItems<OutputBlogType>> {
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
    @Query() queryData: PostSortData,
    @Param('blogId') blogId: string,
  ): Promise<PaginationWithItems<OutputPostType>> {
    const targetBlog = await this.blogsQueryRepository.findById(blogId);
    if (!targetBlog) throw new NotFoundException('Post Not Found');
    return this.postQueryRepository.findByBlogId(blogId, queryData);
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
  async updateBlog(@Param('id') id: string, @Body() blogUpdateType: BlogUpdateType): Promise<void> {
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
