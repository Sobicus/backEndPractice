import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments } from '../domain/comments.entity';

import { PaginationCommentsOutputModelType } from '../../../base/helpers/pagination-comments-helpers';
import {
  CommentOutputModel,
  CommentsOutputModel,
} from '../api/models/input/comments.input.model';
import { CommentsLikesInfoRepository } from '../../likesInfo/comments-likesInfo/infrastructure/comments-likesInfo.repository';
import { LikesStatusComments } from '../../likesInfo/comments-likesInfo/api/models/input/comments-likesInfo.input.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: Model<Comments>,
    private commentsLikesInfoRepository: CommentsLikesInfoRepository,
  ) {}

  async getCommentById(
    commentsId: string,
    userId?: string,
  ): Promise<CommentOutputModel | null> {
    const comment = await this.CommentsModel.findOne({
      _id: new Types.ObjectId(commentsId),
    });
    if (!comment) {
      return null;
    }

    let myStatus = LikesStatusComments.None;
    if (userId) {
      const reaction =
        await this.commentsLikesInfoRepository.findLikeInfoByCommentIdUserId(
          commentsId,
          userId,
        );
      myStatus = reaction ? reaction.myStatus : myStatus;
    }
    const likesCount = await this.commentsLikesInfoRepository.countDocuments(
      commentsId,
      LikesStatusComments.Like,
    );
    const dislikesCount = await this.commentsLikesInfoRepository.countDocuments(
      commentsId,
      LikesStatusComments.Dislike,
    );
    return {
      id: comment._id.toString(),
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.userLogin,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
      },
    };
  }

  async getCommentsByPostId(
    postId: string,
    pagination: PaginationCommentsOutputModelType,
    userId?: string,
  ): Promise<CommentsOutputModel> {
    const comments = await this.CommentsModel.find({ postId })
      .sort(pagination.sortBy)
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allComments = await Promise.all(
      comments.map(async (comment) => {
        let myStatus = LikesStatusComments.None;
        if (userId) {
          const reaction =
            await this.commentsLikesInfoRepository.findLikeInfoByCommentIdUserId(
              comment._id.toString(),
              userId,
            );
          myStatus = reaction ? reaction.myStatus : myStatus;
        }
        const likesCount =
          await this.commentsLikesInfoRepository.countDocuments(
            comment._id.toString(),
            LikesStatusComments.Like,
          );
        const dislikesCount =
          await this.commentsLikesInfoRepository.countDocuments(
            comment._id.toString(),
            LikesStatusComments.Dislike,
          );
        return {
          id: comment._id.toString(),
          content: comment.content,
          commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
          },
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
          },
        };
      }),
    );
    const totalCount = await this.CommentsModel.countDocuments({ postId });
    const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allComments,
    };
  }
}
