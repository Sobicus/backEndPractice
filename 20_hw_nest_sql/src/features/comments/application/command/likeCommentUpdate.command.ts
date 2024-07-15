import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { LikesStatusComments } from '../../api/models/input/comments-likesInfo.input.model';
import { CommentsLikesInfoRepository } from '../../infrastructure/comments-likesInfo.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsRepositorySQL } from '../../infrastructure/commentsSQL.repository';
import { CommentsLikesInfoRepositorySQL } from '../../infrastructure/comments-likesInfoSQL.repository';

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
    private commentsLikesInfoRepositorySQL: CommentsLikesInfoRepositorySQL,
    private commentsRepositorySQL: CommentsRepositorySQL,
  ) {}

  async execute(command: LikeCommentUpdateCommand) {
    const comment = await this.commentsRepositorySQL.getCommentById(
      command.commentId,
    );

    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'comment doesn`t exists',
        data: null,
      };
    }
    const existingReaction =
      await this.commentsLikesInfoRepositorySQL.findLikeInfoByCommentIdUserId(
        command.commentId,
        command.userId,
      );
    if (!existingReaction) {
      const newCommentLikeInfo = {
        commentId: command.commentId,
        userId: command.userId,
        createdAt: new Date().toISOString(),
        myStatus: command.likeStatus,
      };
      await this.commentsLikesInfoRepositorySQL.createLikeInfoComment(
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
      await this.commentsLikesInfoRepositorySQL.updateLikeInfoComment(
        command.commentId,
        command.likeStatus,
        command.userId,
      );
      return {
        status: statusType.Success,
        statusMessages: 'comment likes has been changed',
        data: null,
      };
    }
  }
}
