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
import { JwtAuthGuard } from '../../../infrastructure/guards/jwt-auth.guard';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateCommentCommand } from '../../comments/service/useCase/create-comment.useCase';
import { LikeCreateModel } from '../../comments/types/comments/input';
import { OutputCommentType } from '../../comments/types/comments/output';
import { PaginationWithItems } from '../../common/types/output';
import { PostService } from '../services/post.service';
import { AddLikeToPostCommand } from '../services/useCase/add-like.to.post.useSace';
import { GetAllPostsWithLikeStatusCommand } from '../services/useCase/get-all-post-with-likeStatus.useCase';
import { GetCommentsToPostWithLikeStatusCommand } from '../services/useCase/get-comments-to-post-with-like-status.useCase';
import { GetPostWithLikeStatusCommand } from '../services/useCase/get-post-with-like-status.useCase';
import { CommentCreateModel, PostCreateModel, PostUpdateType } from '../types/input';
import { OutputPostType } from '../types/output';

@Controller('posts')
export class PostsController {
  constructor(
    protected readonly postService: PostService,
    private commandBus: CommandBus,
  ) {}

  @Get('/')
  async getAllPosts(
    @CurrentUser() userId: string,
    @Query(QueryPaginationPipe) queryData: QueryPaginationResult,
  ): Promise<PaginationWithItems<OutputPostType>> {
    return this.commandBus.execute(new GetAllPostsWithLikeStatusCommand(userId, queryData));
  }

  @Get(':postId')
  async getPost(@CurrentUser() userId: string, @Param('postId') postId: string): Promise<OutputPostType> {
    return this.commandBus.execute(new GetPostWithLikeStatusCommand(postId, userId));
  }

  @Get(':postId/comments')
  async getCommentsForPost(
    @CurrentUser() userId: string,
    @Param('postId') postId: string,
    @Query(QueryPaginationPipe) queryData: QueryPaginationResult,
  ): Promise<PaginationWithItems<OutputCommentType>> {
    return this.commandBus.execute(new GetCommentsToPostWithLikeStatusCommand(userId, postId, queryData));
  }

  @Post()
  @UseGuards(AuthGuard)
  async createPost(@Body() postCreateData: PostCreateModel): Promise<OutputPostType> {
    const newPost: OutputPostType | null = await this.postService.createPost(postCreateData);
    return newPost!;
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() postUpdateData: PostUpdateType): Promise<void> {
    const updateResult = await this.postService.updatePost(postUpdateData, id);
    if (!updateResult) throw new NotFoundException('Post Not Found');
    return;
  }
  @Put('/:postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async addLike(
    @Param('postId') postId: string,
    @Body() { likeStatus }: LikeCreateModel,
    @CurrentUser() userId: string,
  ): Promise<void> {
    await this.commandBus.execute(new AddLikeToPostCommand(postId, userId, likeStatus));
  }

  @Post(':postId/comments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createCommentToPost(
    @CurrentUser() userId: string,
    @Param('postId') postId: string,
    @Body() commentCreateData: CommentCreateModel,
  ): Promise<OutputCommentType> {
    const content = commentCreateData.content;
    return this.commandBus.execute(new CreateCommentCommand(userId, postId, content));
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
