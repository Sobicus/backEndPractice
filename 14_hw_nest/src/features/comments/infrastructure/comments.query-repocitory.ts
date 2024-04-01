import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comments } from '../domain/comments.entity';
import { ObjectId } from 'mongodb';
import { CommentsOutputModels } from '../api/models/output/comments.output.models';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: Model<Comments>,
  ) {}
  async getCommentsById(
    commentsId: string,
  ): Promise<CommentsOutputModels | null> {
    const post = await this.CommentsModel.findOne({
      _id: new ObjectId(commentsId),
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
}
