import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentsLikesInfo,
  CommentsLikesInfoDocument,
} from '../domain/comments-likesInfo.entity';
import { Model } from 'mongoose';
import {
  CommentsLikesInfoInputModel,
  LikesStatus,
} from '../api/models/input/comments-likesInfo.input.model';

@Injectable()
export class CommentsLikesInfoRepository {
  constructor(
    @InjectModel(CommentsLikesInfo.name)
    private CommentsLikesInfoModel: Model<CommentsLikesInfo>,
  ) {}

  async createLikeInfoComment(
    commentLikesInfoDTO: CommentsLikesInfoInputModel,
  ) {
    await this.CommentsLikesInfoModel.create(commentLikesInfoDTO);
  }
  async findLikeInfoByCommentIdUserId(
    commentId: string,
    userId: string,
  ): Promise<CommentsLikesInfoDocument | null> {
    return this.CommentsLikesInfoModel.findOne({ commentId, userId }).exec();
  }
  async updateLikeInfoComment(
    commentId: string,
    likeStatus: LikesStatus,
    userId: string,
  ) {
    await this.CommentsLikesInfoModel.updateOne(
      { commentId, userId },
      { myStatus: likeStatus },
    );
  }
  async countDocuments(
    commentId: string,
    likeStatus: 'Like' | 'Dislike',
  ): Promise<number> {
    return this.CommentsLikesInfoModel.countDocuments({
      commentId,
      likeStatus,
    });
  }
}
