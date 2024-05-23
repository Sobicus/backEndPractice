import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesStatus } from '../api/models/input/comments-likesInfo.input.model';
import { HydratedDocument } from 'mongoose';

@Schema()
export class CommentsLikesInfo {
  @Prop({ type: String, required: true })
  commentId: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: String, enum: LikesStatus, required: true })
  myStatus: LikesStatus;
}

export type CommentsLikesInfoDocument = HydratedDocument<CommentsLikesInfo>;

export const CommentsLikesInfoSchema =
  SchemaFactory.createForClass(CommentsLikesInfo);
