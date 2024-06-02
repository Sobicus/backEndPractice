import { Injectable } from '@nestjs/common';
import { PostsLikesInfoRepository } from '../infrastructure/posts-likesInfo.repository';
import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import { PostsRepository } from '../infrastructure/posts.repository';
import { UsersRepository } from '../../users/infrastructure/users.repository';

@Injectable()
export class PostsLikesInfoService {
  constructor(
    private postsLikesInfoRepository: PostsLikesInfoRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  // async updatePostLikeInfo(
  //   postId: string,
  //   likeStatus: LikesStatusPosts,
  //   userId: string,
  // ): Promise<ObjectClassResult> {
  //   const post = await this.postsRepository.getPostByPostId(postId);
  //   if (!post) {
  //     return {
  //       status: statusType.NotFound,
  //       statusMessages: 'Post does`t exists',
  //       data: null,
  //     };
  //   }
  //   const user = await this.usersRepository.getUserById(userId);
  //   const existingReaction =
  //     await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
  //       postId,
  //       userId,
  //     );
  //   if (!existingReaction) {
  //     const newPostLikesInfo = {
  //       postId,
  //       userId,
  //       login: user!.login,
  //       createdAt: new Date().toISOString(),
  //       myStatus: likeStatus,
  //     };
  //     await this.postsLikesInfoRepository.createLikeInfoPost(newPostLikesInfo);
  //     return {
  //       status: statusType.Created,
  //       statusMessages: 'Post likes has been created',
  //       data: null,
  //     };
  //   }
  //   if (existingReaction.myStatus === likeStatus) {
  //     return {
  //       status: statusType.Success,
  //       statusMessages: 'Post likes the same',
  //       data: null,
  //     };
  //   } else {
  //     await this.postsLikesInfoRepository.updateLikeInfoPost(
  //       postId,
  //       userId,
  //       likeStatus,
  //     );
  //     return {
  //       status: statusType.Success,
  //       statusMessages: 'Post likes the same',
  //       data: null,
  //     };
  //   }
  // }
}
