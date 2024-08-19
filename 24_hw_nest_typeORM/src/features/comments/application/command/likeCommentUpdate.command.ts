import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { statusType } from '../../../../base/oject-result';
import { LikesStatusComments } from '../../api/models/input/comments-likesInfo.input.model';
import { CommentsLikesInfo } from '../../domain/comments-likesInfo.entity';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsLikesInfoRepository } from '../../infrastructure/comments-likesInfo.repository';

export class LikeCommentUpdateCommand {
  constructor(
    public readonly commentId: string,
    public readonly likeStatus: LikesStatusComments,
    public readonly userId: string,
  ) {}
}

@CommandHandler(LikeCommentUpdateCommand)
export class LikeCommentUpdateHandler
  implements ICommandHandler<LikeCommentUpdateCommand>
{
  constructor(
    private commentsLikesInfoRepository: CommentsLikesInfoRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: LikeCommentUpdateCommand) {
    const comment = await this.commentsRepository.getCommentById(
      Number(command.commentId),
    );

    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'comment doesn`t exists',
        data: null,
      };
    }
    const existingReaction =
      await this.commentsLikesInfoRepository.findLikeInfoByCommentIdUserId(
        Number(command.commentId),
        Number(command.userId),
      );
    if (!existingReaction) {
      const newCommentLikeInfo = CommentsLikesInfo.createCommentLikesInfo(
        Number(command.userId),
        Number(command.commentId),
        command.likeStatus,
      );
      await this.commentsLikesInfoRepository.createLikeInfoComment(
        newCommentLikeInfo,
      );
      return {
        status: statusType.Success,
        statusMessages: 'comment likes has been created',
        data: null,
      };
    }
    if (existingReaction.myStatus === command.likeStatus) {
      return {
        status: statusType.Success,
        statusMessages: 'comment likes the same',
        data: null,
      };
    } else {
      await this.commentsLikesInfoRepository.updateLikeInfoComment(
        Number(command.commentId),
        command.likeStatus,
        Number(command.userId),
      );
      return {
        status: statusType.Success,
        statusMessages: 'comment likes has been changed',
        data: null,
      };
    }
  }
}
