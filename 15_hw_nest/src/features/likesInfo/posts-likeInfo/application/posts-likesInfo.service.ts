import { Injectable } from '@nestjs/common';
import { PostsLikesInfoRepository } from '../infrastructure/posts-likesInfo.repository';
import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';
import { ObjectClassResult } from '../../../../base/oject-result';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';

@Injectable()
export class PostsLikesInfoService {
  constructor(
    private postsLikesInfoRepository: PostsLikesInfoRepository,
    private postsRepository: PostsRepository,
  ) {}
  async updatePostLikeInfo(
    postId: string,
    likeStatus: LikesStatusPosts,
    userId: string,
  ): Promise<ObjectClassResult> {}
}
