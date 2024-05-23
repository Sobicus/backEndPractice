import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments-query.repository';
import { CommentsService } from '../application/comments.service';
import { JwtAccessAuthGuard } from 'src/base/guards/jwt-access.guard';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { InputUpdateCommentModel } from './models/input/comments.input.model';
import { InputUpdtLikesModel } from '../../likesInfo/comments-likesInfo/api/models/input/comments-likesInfo.input.model';
import { CommentsLikesInfoService } from '../../likesInfo/comments-likesInfo/application/comments-likesInfo.service';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
    private commentsLikesInfoService: CommentsLikesInfoService,
  ) {}

  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const comment = this.commentsQueryRepository.getCommentById(
      commentId,
      userId,
    );
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }

  @HttpCode(204)
  @UseGuards(JwtAccessAuthGuard)
  @Delete(':id')
  async deleteComment(
    @Param('id') commentId: string,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.commentsService.deleteComment(commentId, userId);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (res.status === 'Forbidden') {
      throw new ForbiddenException();
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAccessAuthGuard)
  @Put(':id')
  async updateComment(
    @Param('id') commentId: string,
    @TakeUserId() { userId }: { userId: string },
    @Body() content: InputUpdateCommentModel,
  ) {
    const res = await this.commentsService.updateComment(
      commentId,
      content.content,
      userId,
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (res.status === 'Forbidden') {
      throw new ForbiddenException();
    }
  }

  @UseGuards(JwtAccessAuthGuard)
  @Put(':id/like-status')
  async updateCommentLikeStatus(
    @Param('id') commentId: string,
    @Body() likeStatus: InputUpdtLikesModel,
    @TakeUserId() { userId }: { userId: string },
  ) {
    await this.commentsLikesInfoService.likeCommentUpdate(
      commentId,
      likeStatus.likeStatus,
      userId,
    );
  }
}
