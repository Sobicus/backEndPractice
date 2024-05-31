import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public content: string,
    public userId: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(private commentsRepository: CommentsRepository) {}

  async execute(command: UpdateCommentCommand) {
    const comment = await this.commentsRepository.getComment(command.commentId);
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    if (comment.userId !== command.userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepository.updateComment(
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
