import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserQueryRepository } from '../../../users/repositories/user.query.repository';
import { CommentsQueryRepository } from '../../repositories/comments/comments.query.repository';
import { CommentsRepository } from '../../repositories/comments/comments.repository';
import { CommentsLikesDocument } from '../../repositories/likes/comment-like.schema';
import { CommentsLikesRepository } from '../../repositories/likes/comments-likes.repository';
import { CommentsLikesQueryRepository } from '../../repositories/likes/comments-likes-query.repository';
import { LikeStatusType } from '../../types/comments/input';

export class AddLikeToCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
    public likeStatus: LikeStatusType,
  ) {}
}

@CommandHandler(AddLikeToCommentCommand)
export class AddLikeToCommentUseCase implements ICommandHandler<AddLikeToCommentCommand> {
  constructor(
    protected commentsQueryRepository: CommentsQueryRepository,
    protected commentLikesQueryRepository: CommentsLikesQueryRepository,
    protected commentsRepository: CommentsRepository,
    protected commentsLikesRepository: CommentsLikesRepository,
    protected userRepository: UserQueryRepository,
  ) {}

  async execute({ commentId, userId, likeStatus }: AddLikeToCommentCommand): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    const targetComment = await this.commentsQueryRepository.getCommentById(commentId);

    if (!targetComment) throw new NotFoundException();
    const userLike: CommentsLikesDocument | null = await this.commentLikesQueryRepository.getLikeByUserId(
      commentId,
      userId,
    );

    if (!userLike) {
      await this.createLike(commentId, likeStatus, userId, user.login, user.login);
      return;
    }

    // If user's like status is already as expected, no further action needed
    if (likeStatus === userLike.likeStatus) return;

    switch (likeStatus) {
      case 'Dislike':
      case 'Like':
        userLike.likeStatus === 'None'
          ? await this.updateLike(commentId, likeStatus, userId)
          : await this.switchLike(commentId, likeStatus, userId);
        break;
      case 'None':
        await this.decreaseLike(commentId, userLike.likeStatus, userId);
    }
  }

  private async createLike(
    commentId: string,
    likeStatus: LikeStatusType,
    userId: string,
    login: string,
    postId: string,
  ): Promise<void> {
    await this.commentsLikesRepository.createLike(commentId, postId, userId, login, likeStatus);
    await this.commentsRepository.updateLikesCount(commentId, 'increment', likeStatus);
  }

  private async updateLike(commentId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.commentsRepository.updateLikesCount(commentId, 'increment', likeStatus);
    await this.commentsLikesRepository.updateLikeStatus(commentId, userId, likeStatus);
  }

  private async switchLike(commentId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.commentsRepository.updateLikesCount(commentId, 'increment', likeStatus);
    await this.commentsRepository.updateLikesCount(commentId, 'decrement', likeStatus === 'Like' ? 'Dislike' : 'Like');
    await this.commentsLikesRepository.updateLikeStatus(commentId, userId, likeStatus);
  }

  private async decreaseLike(commentId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.commentsRepository.updateLikesCount(commentId, 'decrement', likeStatus);
    await this.commentsLikesRepository.updateLikeStatus(commentId, userId, 'None');
  }
}
