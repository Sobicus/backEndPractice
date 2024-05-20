import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { ObjectClassResult, statusType } from '../../../base/oject-result';

@Injectable()
export class CommentsService {
  constructor(private commentsRepository: CommentsRepository) {}

  async deleteComment(
    commentId: string,
    userId: string,
  ): Promise<ObjectClassResult> {
    const comment = await this.commentsRepository.getComment(commentId);
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    if (comment.userId !== userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepository.deleteComment(commentId);
    return {
      status: statusType.Success,
      statusMessages: 'Comments has been deleted',
      data: null,
    };
  }
  async updateComment(commentId: string, content: string, userId: string) {
    const comment = await this.commentsRepository.getComment(commentId);
    if (!comment) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Comments has been not found',
        data: null,
      };
    }
    if (comment.userId !== userId) {
      return {
        status: statusType.Forbidden,
        statusMessages: 'this comment does not belong for you ',
        data: null,
      };
    }
    await this.commentsRepository.updateComment(commentId, content);
    return {
      status: statusType.Success,
      statusMessages: 'Comments has been deleted',
      data: null,
    };
  }
}
