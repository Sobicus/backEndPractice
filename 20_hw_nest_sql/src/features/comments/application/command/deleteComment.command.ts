import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { CommentsRepositorySQL } from '../../infrastructure/commentsSQL.repository';

export class DeleteCommentCommand {
  constructor(
    public readonly commentId: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private commentsRepositorySQL: CommentsRepositorySQL) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepositorySQL.getCommentById(
      command.commentId,
    );
    console.log('command userID', command);
    console.log('deleted comment', comment);
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    //todo вот тут пришлось сделать +
    if (comment.userId !== +command.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepositorySQL.deleteComment(command.commentId);
    return {
      status: statusType.Success,
      statusMessages: 'Comments has been deleted',
      data: null,
    };
  }
}
