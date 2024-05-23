/* eslint-disable no-underscore-dangle */
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatusType } from '../../../comments/types/comments/input';
import { UserQueryRepository } from '../../../users/repositories/user.query.repository';
import { PostLikesQueryRepository } from '../../repositories/likes/post-likes.query.repository';
import { PostLikesRepository } from '../../repositories/likes/post-likes.repository';
import { PostLikesDocument } from '../../repositories/likes/post-likes.schema';
import { PostsDocument } from '../../repositories/post/post.schema';
import { PostsRepository } from '../../repositories/post/posts.repository';

export class AddLikeToPostCommand {
  constructor(
    public postId: string,
    public userId: string,
    public likeStatus: LikeStatusType,
  ) {}
}

@CommandHandler(AddLikeToPostCommand)
export class AddLikeToPostUseCase implements ICommandHandler<AddLikeToPostCommand> {
  constructor(
    protected postLikesQueryRepository: PostLikesQueryRepository,
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository,
    protected userRepository: UserQueryRepository,
  ) {}

  async execute({ postId, userId, likeStatus }: AddLikeToPostCommand): Promise<void> {
    const user = await this.userRepository.getUserById(userId);
    if (!user) throw new NotFoundException('user not found');
    const targetPost = await this.postsRepository.getPostbyId(postId);

    if (!targetPost) throw new NotFoundException('post not found');

    const userLike: PostLikesDocument | null = await this.postLikesQueryRepository.getLikeByUserId(postId, userId);

    if (!userLike) {
      await this.createLike(postId, targetPost.blogId, userId, user.login, likeStatus, targetPost);
      await this.updateLastThreeLikesInPost(targetPost);
      return;
    }

    // If user's like status is already as expected, no further action needed
    if (likeStatus === userLike.likeStatus) return;

    switch (likeStatus) {
      case 'Dislike':
      case 'Like':
        userLike.likeStatus === 'None'
          ? await this.updateLike(postId, likeStatus, userId)
          : await this.switchLike(postId, likeStatus, userId);
        await this.updateLastThreeLikesInPost(targetPost);
        break;
      case 'None':
        await this.decreaseLike(postId, userLike.likeStatus, userId);
        await this.updateLastThreeLikesInPost(targetPost);
    }
  }

  private async createLike(
    postId: string,
    blogId: string,
    userId: string,
    login: string,
    likeStatus: LikeStatusType,
    targetPost: PostsDocument,
  ): Promise<void> {
    await this.postLikesRepository.createLike(postId, blogId, userId, login, likeStatus);
    await this.postsRepository.updateLikesCount(postId, 'increment', likeStatus);
    await this.updateLastThreeLikesInPost(targetPost);
  }

  private async updateLike(postId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.postsRepository.updateLikesCount(postId, 'increment', likeStatus);
    await this.postLikesRepository.updateLikeStatus(postId, userId, likeStatus);
  }

  private async switchLike(commentId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.postsRepository.updateLikesCount(commentId, 'increment', likeStatus);
    await this.postsRepository.updateLikesCount(commentId, 'decrement', likeStatus === 'Like' ? 'Dislike' : 'Like');
    await this.postLikesRepository.updateLikeStatus(commentId, userId, likeStatus);
  }

  private async decreaseLike(commentId: string, likeStatus: LikeStatusType, userId: string): Promise<void> {
    await this.postsRepository.updateLikesCount(commentId, 'decrement', likeStatus);
    await this.postLikesRepository.updateLikeStatus(commentId, userId, 'None');
  }

  private async updateLastThreeLikesInPost(targetPost: PostsDocument): Promise<void> {
    const likesForPost = await this.postLikesQueryRepository.getLastThreeLikes(targetPost._id);
    if (!likesForPost) return;
    targetPost.extendedLikesInfo.newestLikes = likesForPost;
    await this.postsRepository.savePost(targetPost);
  }
}
