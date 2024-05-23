/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { LikeStatus } from '../../../posts/types/likes/input';
import { OutputCommentType } from '../../types/comments/output';

@Schema()
export class Comment {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true }) postId: string;
  @Prop({ required: true }) content: string;
  @Prop({ _id: false, required: true, type: { userId: String, userLogin: String } })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  @Prop({ required: true }) createdAt: string;
  @Prop({ required: true, default: 0 }) likesCount: number;
  @Prop({ required: true, default: 0 }) dislikesCount: number;
  constructor(postId: string, content: string, userInfo: { userId: string; userLogin: string }) {
    this._id = crypto.randomUUID();
    this.postId = postId;
    this.content = content;
    this.createdAt = new Date().toISOString();
    this.commentatorInfo = {
      userId: userInfo.userId,
      userLogin: userInfo.userLogin,
    };
    this.likesCount = 0;
    this.dislikesCount = 0;
  }
  toDto(myStatus: LikeStatus = 'None'): OutputCommentType {
    return {
      id: this._id,
      content: this.content,
      createdAt: this.createdAt,
      commentatorInfo: this.commentatorInfo,
      likesInfo: {
        likesCount: this.likesCount,
        dislikesCount: this.dislikesCount,
        myStatus: myStatus,
      },
    };
  }
  updateComment(content: string): void {
    this.content = content;
  }
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
CommentSchema.loadClass(Comment);
export type CommentsDocument = HydratedDocument<Comment>;
