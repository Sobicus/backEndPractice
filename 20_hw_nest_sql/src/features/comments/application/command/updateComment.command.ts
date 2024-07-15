import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsRepositorySQL } from '../../infrastructure/commentsSQL.repository';

export class UpdateCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly content: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepositorySQL: CommentsRepositorySQL) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentsRepositorySQL.getCommentById(
      command.commentId,
    );
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    //todo the same probleme with userID and type
    if (comment.userId !== +command.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepositorySQL.updateComment(
      command.commentId,
      command.content,
    );
    return {
      status: statusType.Success,
      statusMessages: 'Comments has been deleted',
      data: null,
    };
  }
}
