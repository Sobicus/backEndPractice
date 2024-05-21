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
import { PostsQueryRepository } from '../../infrastructure/posts-query.repository';
import { PostInputModelType } from './input/create-post.input.model';
import {
  PaginationPostsInputModelType,
  postsPagination,
} from '../../../../base/helpers/pagination-posts-helpers';
import {
  commentsPagination,
  PaginationCommentsInputModelType,
} from '../../../../base/helpers/pagination-comments-helpers';
import { CommentsQueryRepository } from '../../../comments/infrastructure/comments-query.repository';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get()
  async getAllPosts(@Query() pagination: PaginationPostsInputModelType) {
    const query = postsPagination(pagination);
    return await this.postsQueryRepository.getAllPosts(query);
  }

  @Get(':id')
  async getPostById(@Param('id') postId: string) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
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

  @Get(':id/comments')
  async getComments(
    @Param('id') postId: string,
    @Query() pagination: PaginationCommentsInputModelType,
  ) {
    const query = commentsPagination(pagination);
    return await this.commentsQueryRepository.getCommentsByPostId(
      postId,
      query,
    );
  }
}
