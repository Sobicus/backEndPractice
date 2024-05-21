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
import { InputUpdateCommentModel } from './models/output/comments.output.models';

@Controller('comments')
export class CommentsController {
  constructor(
    private commentsQueryRepository: CommentsQueryRepository,
    private commentsService: CommentsService,
  ) {}

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const comment = this.commentsQueryRepository.getCommentById(commentId);
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
}
