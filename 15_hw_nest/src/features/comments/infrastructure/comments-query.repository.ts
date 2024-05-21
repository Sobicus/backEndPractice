import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comments } from '../domain/comments.entity';

import { PaginationCommentsOutputModelType } from '../../../base/helpers/pagination-comments-helpers';
import {
  CommentOutputModel,
  CommentsOutputModel,
} from '../api/models/input/comments.input.model';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: Model<Comments>,
  ) {}

  async getCommentById(commentsId: string): Promise<CommentOutputModel | null> {
    const post = await this.CommentsModel.findOne({
      _id: new Types.ObjectId(commentsId),
    });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      content: post.content,
      commentatorInfo: {
        userId: post.userId,
        userLogin: post.userLogin,
      },
      createdAt: post.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'test',
      },
    };
  }

  async getCommentsByPostId(
    postId: string,
    pagination: PaginationCommentsOutputModelType,
  ): Promise<CommentsOutputModel> {
    const comments = await this.CommentsModel.find({ postId })
      .sort(pagination.sortBy)
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allComments = comments.map((comment) => {
      return {
        id: comment._id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.userId,
          userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'test',
        },
      };
    });
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
