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
import { PostsQueryRepository } from '../repositories/posts.query.repository';
import { PostService } from '../services/postService';
import { PostCreateModel, PostSortData, PostUpdateType } from '../types/input';
import { OutputPostType } from '../types/output';

@Controller('posts')
export class PostsController {
  constructor(
    protected readonly postService: PostService,
    protected readonly postQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() queryData: PostSortData): Promise<PaginationWithItems<OutputPostType>> {
    return this.postQueryRepository.getAll(queryData);
  }

  @Get(':postId')
  async getPost(@Param('postId') postId: string): Promise<OutputPostType> {
    const targetPost: OutputPostType | null = await this.postQueryRepository.findById(postId);
    if (!targetPost) throw new NotFoundException('Post Not Found');
    return targetPost;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() postCreateData: PostCreateModel): Promise<OutputPostType> {
    const newPost: OutputPostType | null = await this.postService.createPost(postCreateData);
    if (!newPost) throw new NotFoundException('Blog Not Exist');
    return newPost;
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() postUpdateData: PostUpdateType): Promise<void> {
    const updateResult = await this.postService.updatePost(postUpdateData, id);
    if (!updateResult) throw new NotFoundException('Blog Not Found');
    return;
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deletePost(@Param('id') id: string): Promise<void> {
    const delteResult = await this.postService.deleteBlog(id);
    if (!delteResult) throw new NotFoundException('Blog Not Found');
    return;
  }
}
