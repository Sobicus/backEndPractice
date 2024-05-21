import { Injectable } from '@nestjs/common';
import { CommentsRepository } from '../infrastructure/comments.repository';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class CommentsService {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
    private userRepository: UsersRepository,
  ) {}

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

  async createComment(
    postId: string,
    content: string,
    userId: string,
  ): Promise<ObjectClassResult<string | null>> {
    const post = await this.postsRepository.getPostByPostId(postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post doesn`t exists',
        data: null,
      };
    }
    const user = await this.userRepository.getUserById(userId);
    const newComment = {
      content: content,
      userId: userId,
      userLogin: user!.login,
      createdAt: new Date().toISOString(),
      postId: post._id.toString(),
    };
    const newCommentId =
      await this.commentsRepository.createComment(newComment);
    return {
      status: statusType.Created,
      statusMessages: 'Comment has been created',
      data: newCommentId,
    };
  }
}
