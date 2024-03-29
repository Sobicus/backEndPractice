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
} from '@nestjs/common';
import { PostsService } from '../../application/posts.service';
import { PostsQueryRepository } from '../../infrastructure/posts.query-repository';
import { PostInputModelType } from './input/create-post.input.model';
import {
  PaginationPostsInputModelType,
  postPagination,
} from '../../../../base/pagination-posts-helpers';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() pagination: PaginationPostsInputModelType) {
    const query = postPagination(pagination);
    return await this.postsQueryRepository.getAllPosts(query);
  }
  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    return await this.postsQueryRepository.getPostById(postId);
  }

  @Post()
  async createPost(@Body() inputModel: PostInputModelType) {
    const res = await this.postsService.createPost(inputModel);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (res.status === 'Created') {
      return this.postsQueryRepository.getPostById(res.data as string);
    }
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() inputModel: PostInputModelType,
  ) {
    const res = await this.postsService.updatePost(postId, inputModel);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const res = await this.postsService.deletePost(postId);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
