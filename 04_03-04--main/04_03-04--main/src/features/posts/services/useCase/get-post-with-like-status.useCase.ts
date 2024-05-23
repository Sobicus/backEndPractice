import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { LikeStatusType } from '../../../comments/types/comments/input';
import { PostLikesQueryRepository } from '../../repositories/likes/post-likes.query.repository';
import { PostsDocument } from '../../repositories/post/post.schema';
import { PostsRepository } from '../../repositories/post/posts.repository';
import { OutputPostType } from '../../types/output';

export class GetPostWithLikeStatusCommand {
  constructor(
    public postId: string,
    public userId: string | null,
  ) {}
}

@CommandHandler(GetPostWithLikeStatusCommand)
export class GetPostWithLikeStatusUseCase implements ICommandHandler<GetPostWithLikeStatusCommand> {
  constructor(
    protected postRepository: PostsRepository,
    protected postlikesQueryRepository: PostLikesQueryRepository,
  ) {}

  async execute({ postId, userId }: GetPostWithLikeStatusCommand): Promise<OutputPostType> {
    const post: PostsDocument | null = await this.postRepository.getPostbyId(postId);
    if (!post) throw new NotFoundException(`Post with id ${postId} not found`);
    const likeStatus = await this.getLikeStatus(postId, userId);

    return post.toDto(likeStatus);
  }
  private async getLikeStatus(postId: string, userId: string | null): Promise<LikeStatusType> {
    if (!userId) return 'None';
    const userLike = await this.postlikesQueryRepository.getLikeByUserId(postId, userId);
    return userLike?.likeStatus ?? 'None';
  }
}
