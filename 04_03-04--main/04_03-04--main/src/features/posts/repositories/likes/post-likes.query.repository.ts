import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IPostLikesQueryRepository } from '../../../../infrastructure/types/interfaces/IPostLikesQueryRepository';
import { NewestLikeType } from '../../types/likes/output';
import { PostLikes, PostLikesDocument } from './post-likes.schema';

@Injectable()
export class PostLikesQueryRepository implements IPostLikesQueryRepository {
  constructor(
    @InjectModel(PostLikes.name)
    private PostLikesModel: Model<PostLikesDocument>,
  ) {}

  async getLikeByUserId(postId: string, userId: string): Promise<PostLikesDocument | null> {
    return this.PostLikesModel.findOne({ postId, userId });
  }
  async getManyLikesByUserId(ids: string[], userId: string): Promise<PostLikesDocument[]> {
    return this.PostLikesModel.find({
      postId: { $in: ids },
      userId,
    });
  }
  async getLastThreeLikes(postId: string): Promise<NewestLikeType[]> {
    const targetLikes: PostLikesDocument[] | null = await this.PostLikesModel.find({
      postId: postId,
      likeStatus: 'Like',
    })
      .sort({ createdAt: -1 })
      .limit(3);
    return targetLikes?.map((like) => like.toDto()) ?? null;
  }
}
