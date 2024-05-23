import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepository } from '../../repositories/comments/comments.repository';

export class DeleteCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdUseCase implements ICommandHandler<DeleteCommentByIdCommand> {
  constructor(protected commentsRepository: CommentsRepository) {}

  async execute({ commentId }: DeleteCommentByIdCommand): Promise<void> {
    const deleteResult = await this.commentsRepository.deleteUserById(commentId);
    if (!deleteResult) throw new NotFoundException();
  }
}
