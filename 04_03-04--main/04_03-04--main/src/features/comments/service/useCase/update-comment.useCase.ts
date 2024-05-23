import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsDocument } from '../../repositories/comments/comment.schema';
import { CommentsRepository } from '../../repositories/comments/comments.repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public content: string,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase implements ICommandHandler<UpdateCommentCommand> {
  constructor(protected commentsRepository: CommentsRepository) {}

  async execute({ commentId, content }: UpdateCommentCommand): Promise<void> {
    const targetComment: CommentsDocument | null = await this.commentsRepository.getCommentById(commentId);
    if (!targetComment) throw new NotFoundException();
    targetComment.updateComment(content);
    await this.commentsRepository.saveComment(targetComment);
  }
}
