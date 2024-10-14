import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { statusType } from '../../../../base/oject-result';
import { CommentsRepository } from '../../infrastructure/comments.repository';

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
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepository.getCommentById(
      Number(command.commentId),
    );
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    //todo вот тут пришлось сделать Number
    if (comment.userId !== Number(command.userId)) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepository.deleteComment(Number(command.commentId));
    return {
      status: statusType.Success,
      statusMessages: 'Comments has been deleted',
      data: null,
    };
  }
}
