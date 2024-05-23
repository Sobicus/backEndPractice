import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { HydratedDocument } from 'mongoose';

@Schema()
export class CommentsLikesInfo {
  @Prop({ type: String, required: true })
  commentId: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: String, enum: LikesStatusComments, required: true })
  myStatus: LikesStatusComments;
}

export type CommentsLikesInfoDocument = HydratedDocument<CommentsLikesInfo>;

export const CommentsLikesInfoSchema =
  SchemaFactory.createForClass(CommentsLikesInfo);
