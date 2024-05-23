import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OutputCommentType } from '../../types/comments/output';
import { Comment, CommentsDocument } from './comment.schema';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentsDocument>,
  ) {}

  async getCommentById(commentId: string): Promise<OutputCommentType | null> {
    const targetComment: CommentsDocument | null = await this.CommentModel.findById(commentId);
    return targetComment?.toDto() ?? null;
  }
}
