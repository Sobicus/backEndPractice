import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LikeStatusType } from '../../../comments/types/comments/input';
import { PostLikes, PostLikesDocument } from './post-likes.schema';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLikes.name)
    private PostLikesModel: Model<PostLikesDocument>,
  ) {}

  async createLike(
    postId: string,
    blogId: string,
    userId: string,
    login: string,
    likeStatus: LikeStatusType,
  ): Promise<void> {
    const newLike = new PostLikes(postId, blogId, userId, login, likeStatus);
    const newLikeToDb = new this.PostLikesModel(newLike);
    await newLikeToDb.save();
  }

  async updateLikeStatus(postId: string, userId: string, likeStatus: LikeStatusType): Promise<void> {
    await this.PostLikesModel.findOneAndUpdate({ postId, userId }, { likeStatus });
  }
}
