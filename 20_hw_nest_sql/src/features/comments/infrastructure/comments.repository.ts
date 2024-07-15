import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comments, CommentsDocument } from '../domain/comments.entity';
import { Model, Types } from 'mongoose';
import { InputCreateCommentModel } from '../api/models/input/comments.input.model';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comments.name) private CommentsModel: Model<Comments>,
  ) {}

  async getCommentById(commentId: string): Promise<null | CommentsDocument> {
    return this.CommentsModel.findOne({ _id: new Types.ObjectId(commentId) });
  }

  async deleteComment(commentId: string): Promise<void> {
    await this.CommentsModel.deleteOne({ _id: new Types.ObjectId(commentId) });
  }

  async updateComment(commentId: string, content: string) {
    await this.CommentsModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      { content },
    );
  }

  async createComment(newComment: InputCreateCommentModel): Promise<string> {
    const comment = await this.CommentsModel.create(newComment);
    return comment._id.toString();
  }
  async deleteALl() {
    await this.CommentsModel.deleteMany();
  }
}
