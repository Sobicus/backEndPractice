import {
  Body,
  Controller,
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

import { TakeUserId } from '../../../../base/decorators/authMeTakeIserId';
import { JwtAccessAuthGuard } from '../../../../base/guards/jwt-access.guard';
import {
  PaginationPostsInputModelType,
  postsPagination,
} from '../../../../base/helpers/pagination-posts-helpers';
import { InputUpdateCommentModel } from '../../../comments/api/models/input/comments.input.model';
import { CreateCommentCommand } from '../../../comments/application/command/createComment.command';
import { CommentsQueryRepository } from '../../../comments/infrastructure/comments-query.repository';
import { UpdatePostLikeCommand } from '../../application/command/updatePostLike.command';
import { PostsQueryRepository } from '../../infrastructure/posts-query.repository';
import { InputUpdatePostLikesModel } from './input/posts-likesInfo.input.model';
import {
  commentsPagination,
  PaginationCommentsInputModelType,
} from '../../../../base/helpers/pagination-comments-helpers';

@Controller('posts')
export class PostsController {
  constructor(
    private postsQueryRepositorySQL: PostsQueryRepository,
    private commentsQueryRepositorySQL: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllPosts(
    @Query() pagination: PaginationPostsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const query = postsPagination(pagination);
    return await this.postsQueryRepositorySQL.getAllPosts(query, userId);
  }

  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @TakeUserId() { userId }: { userId: string | null },
  ) {
    const post = await this.postsQueryRepositorySQL.getPostById(
      Number(postId),
      userId,
    );
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') postId: string,
    @Query() pagination: PaginationCommentsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const post = await this.postsQueryRepositorySQL.getPostById(Number(postId));
    if (!post) {
      throw new NotFoundException();
    }
    const query = commentsPagination(pagination);
    return await this.commentsQueryRepositorySQL.getCommentsByPostId(
      postId,
      query,
      Number(userId),
    );
  }

  @UseGuards(JwtAccessAuthGuard)
  @Post(':id/comments')
  async createdComment(
    @Param('id') postId: string,
    @Body() content: InputUpdateCommentModel,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.commandBus.execute(
      new CreateCommentCommand(postId, content.content, userId),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    return await this.commentsQueryRepositorySQL.getCommentById(res.data);
  }

  @HttpCode(204)
  @UseGuards(JwtAccessAuthGuard)
  @Put(':id/like-status')
  async updatePostLikeStatus(
    @Param('id') postId: string,
    @Body() likeStatus: InputUpdatePostLikesModel,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.commandBus.execute(
      new UpdatePostLikeCommand(postId, likeStatus.likeStatus, userId),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
