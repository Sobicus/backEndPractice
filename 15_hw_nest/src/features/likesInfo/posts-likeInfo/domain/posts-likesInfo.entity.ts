import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';

@Schema()
export class PostsLikesInfo {
  @Prop({ type: String, required: true })
  postId: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  login: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: String, enum: LikesStatusPosts, required: true })
  myStatus: LikesStatusPosts;
}

export type CommentsLikesInfoDocument = HydratedDocument<PostsLikesInfo>;

export const CommentsLikesInfoSchema =
  SchemaFactory.createForClass(PostsLikesInfo);
