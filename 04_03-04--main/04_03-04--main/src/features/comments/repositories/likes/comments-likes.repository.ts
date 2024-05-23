import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LikeStatusType } from '../../types/comments/input';
import { CommentLikes, CommentsLikesDocument } from './comment-like.schema';

@Injectable()
export class CommentsLikesRepository {
  constructor(
    @InjectModel(CommentLikes.name)
    private CommentLieksModel: Model<CommentsLikesDocument>,
  ) {}

  async createLike(
    commentId: string,
    postId: string,
    userId: string,
    login: string,
    likeStatus: LikeStatusType,
  ): Promise<void> {
    const newLike = new CommentLikes(commentId, userId, login, likeStatus, postId);
    const newLikeToDb = new this.CommentLieksModel(newLike);
    await newLikeToDb.save();
  }

  async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatusType): Promise<void> {
    await this.CommentLieksModel.findOneAndUpdate({ commentId, userId }, { likeStatus });
  }
}
