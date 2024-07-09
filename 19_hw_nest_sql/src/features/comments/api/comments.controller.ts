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
import { JwtAccessAuthGuard } from 'src/base/guards/jwt-access.guard';
import { TakeUserId } from '../../../base/decorators/authMeTakeIserId';
import { InputUpdateCommentModel } from './models/input/comments.input.model';
import { InputUpdateCommentLikesModel } from './models/input/comments-likesInfo.input.model';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteCommentCommand } from '../application/command/deleteComment.command';
import { UpdateCommentCommand } from '../application/command/updateComment.command';
import { LikeCommentUpdateCommand } from '../application/command/likeCommentUpdate.command';
import { CommentsQueryRepositorySQL } from '../infrastructure/comments-querySQL.repository';

@Controller('comments')
export class CommentsController {
  constructor(
    private commandBus: CommandBus,
    private commentsQueryRepositorySQL: CommentsQueryRepositorySQL,
  ) {}

  @Get(':id')
  async getCommentById(
    @Param('id') commentId: string,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const comment = await this.commentsQueryRepositorySQL.getCommentById(
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
    const res = await this.commandBus.execute(
      new DeleteCommentCommand(commentId, userId),
    );
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
    const res = await this.commandBus.execute(
      new UpdateCommentCommand(commentId, content.content, userId),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
    if (res.status === 'Forbidden') {
      throw new ForbiddenException();
    }
  }

  @HttpCode(204)
  @UseGuards(JwtAccessAuthGuard)
  @Put(':id/like-status')
  async updateCommentLikeStatus(
    @Param('id') commentId: string,
    @Body() likeStatus: InputUpdateCommentLikesModel,
    @TakeUserId() { userId }: { userId: string },
  ) {
    const res = await this.commandBus.execute(
      new LikeCommentUpdateCommand(commentId, likeStatus.likeStatus, userId),
    );
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
}
