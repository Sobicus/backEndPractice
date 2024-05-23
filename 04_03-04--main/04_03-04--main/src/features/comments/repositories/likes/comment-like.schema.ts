/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { LikeStatusType } from '../../types/comments/input';

@Schema()
export class CommentLikes {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true }) commentId: string;
  @Prop({ required: true }) postId: string;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) login: string;
  @Prop({ required: true, enum: ['None', 'Like', 'Dislike'] })
  likeStatus: LikeStatusType;
  constructor(commentId: string, userId: string, login: string, likeStatus: LikeStatusType, postId: string) {
    this._id = crypto.randomUUID();
    this.commentId = commentId;
    this.postId = postId;
    this.createdAt = new Date();
    this.userId = userId;
    this.login = login;
    this.likeStatus = likeStatus;
  }
}
export const CommentsLikesSchema = SchemaFactory.createForClass(CommentLikes);
CommentsLikesSchema.loadClass(CommentLikes);
export type CommentsLikesDocument = HydratedDocument<CommentLikes>;
