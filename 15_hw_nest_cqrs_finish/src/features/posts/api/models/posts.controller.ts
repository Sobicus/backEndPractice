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
import { JwtAccessAuthGuard } from '../../../../base/guards/jwt-access.guard';
import { TakeUserId } from '../../../../base/decorators/authMeTakeIserId';
import { InputUpdateCommentModel } from '../../../comments/api/models/input/comments.input.model';
import { CommentsService } from '../../../comments/application/comments.service';
import { InputUpdatePostLikesModel } from './input/posts-likesInfo.input.model';
import { PostsLikesInfoService } from '../../application/posts-likesInfo.service';
import { UserAuthGuard } from '../../../../base/guards/basic.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentCommand } from '../../../comments/application/command/createComment.command';
import { CreatePostCommand } from '../../application/command/createPost.command';
import { UpdatePostCommand } from '../../application/command/updatePost.command';
import { DeletePostCommand } from '../../application/command/deletePost.command';
import { UpdatePostLikeCommand } from '../../application/command/updatePostLike.command';

@Controller('posts')
export class PostsController {
  constructor(
    private postsService: PostsService,
    private postsQueryRepository: PostsQueryRepository,
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
    private postsLikesInfoService: PostsLikesInfoService,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllPosts(
    @Query() pagination: PaginationPostsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const query = postsPagination(pagination);
    return await this.postsQueryRepository.getAllPosts(query, userId);
  }

  @Get(':id')
  async getPostById(
    @Param('id') postId: string,
    @TakeUserId() { userId }: { userId: string | null },
  ) {
    const post = await this.postsQueryRepository.getPostById(postId, userId);
    if (!post) {
      throw new NotFoundException();
    }
    return post;
  }
  @UseGuards(UserAuthGuard)
  @Post()
  async createPost(@Body() inputModel: PostInputModelType) {
    const res = await this.commandBus.execute(
      new CreatePostCommand(inputModel),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (res.status === 'Created') {
      return this.postsQueryRepository.getPostById(res.data as string);
    }
  }
  @UseGuards(UserAuthGuard)
  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() inputModel: PostInputModelType,
  ) {
    const res = await this.commandBus.execute(
      new UpdatePostCommand(postId, inputModel),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
  @UseGuards(UserAuthGuard)
  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const res = await this.commandBus.execute(new DeletePostCommand(postId));
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }

  @Get(':id/comments')
  async getComments(
    @Param('id') postId: string,
    @Query() pagination: PaginationCommentsInputModelType,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const post = await this.postsQueryRepository.getPostById(postId);
    if (!post) {
      throw new NotFoundException();
    }
    const query = commentsPagination(pagination);
    return await this.commentsQueryRepository.getCommentsByPostId(
      postId,
      query,
      userId,
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
    return await this.commentsQueryRepository.getCommentById(
      res.data as string,
    );
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
