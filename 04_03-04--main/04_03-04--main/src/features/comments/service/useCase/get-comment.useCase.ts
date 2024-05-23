import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsDocument } from '../../repositories/comments/comment.schema';
import { CommentsRepository } from '../../repositories/comments/comments.repository';
import { CommentsLikesQueryRepository } from '../../repositories/likes/comments-likes-query.repository';
import { LikeStatusType } from '../../types/comments/input';
import { OutputCommentType } from '../../types/comments/output';

export class GetCommentByIdCommand {
  constructor(
    public commentId: string,
    public userId: string | null,
  ) {}
}

@CommandHandler(GetCommentByIdCommand)
export class GetCommentByIdUseCase implements ICommandHandler<GetCommentByIdCommand> {
  constructor(
    protected commentsRepository: CommentsRepository,
    protected commentLikesQueryRepository: CommentsLikesQueryRepository,
  ) {}

  async execute({ commentId, userId }: GetCommentByIdCommand): Promise<OutputCommentType> {
    const targetComment: CommentsDocument | null = await this.commentsRepository.getCommentById(commentId);
    if (!targetComment) throw new NotFoundException(`Comment with id ${commentId} not found`);
    const likeStatus = await this.getLikeStatus(commentId, userId);
    return targetComment.toDto(likeStatus);
  }
  private async getLikeStatus(commentId: string, userId: string | null): Promise<LikeStatusType> {
    if (!userId) return 'None';

    const userLike = await this.commentLikesQueryRepository.getLikeByUserId(commentId, userId);
    return userLike?.likeStatus ?? 'None';
  }
}
