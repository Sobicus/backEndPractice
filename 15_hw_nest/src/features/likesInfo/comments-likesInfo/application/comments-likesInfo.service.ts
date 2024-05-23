import { Injectable } from '@nestjs/common';
import { CommentsLikesInfoRepository } from '../infrastructure/comments-likesInfo.repository';
import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { CommentsRepository } from '../../../comments/infrastructure/comments.repository';
import { ObjectClassResult, statusType } from '../../../../base/oject-result';

@Injectable()
export class CommentsLikesInfoService {
  constructor(
    private commentsLikesInfoRepository: CommentsLikesInfoRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async likeCommentUpdate(
    commentId: string,
    likeStatus: LikesStatusComments,
    userId: string,
  ): Promise<ObjectClassResult> {
    const comment = await this.commentsRepository.getComment(commentId);
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post doesn`t exists',
        data: null,
      };
    }
    const existingReaction =
      await this.commentsLikesInfoRepository.findLikeInfoByCommentIdUserId(
        commentId,
        userId,
      );
    if (!existingReaction) {
      const newCommentLikeInfo = {
        postId: commentId,
        userId: userId,
        createdAt: new Date().toISOString(),
        myStatus: likeStatus,
      };
      await this.commentsLikesInfoRepository.createLikeInfoComment(
        newCommentLikeInfo,
      );
      return {
        status: statusType.Success,
        statusMessages: 'comment likes has been created',
        data: null,
      };
    }
    if (existingReaction.myStatus === likeStatus) {
      return {
        status: statusType.Success,
        statusMessages: 'comment likes the same',
        data: null,
      };
    } else {
      await this.commentsLikesInfoRepository.updateLikeInfoComment(
        commentId,
        likeStatus,
        userId,
      );
      return {
        status: statusType.Success,
        statusMessages: 'comment likes has been changed',
        data: null,
      };
    }
  }
}
