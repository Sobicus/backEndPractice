/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { LikeStatusType } from '../../../comments/types/comments/input';
import { NewestLikeType } from '../../types/likes/output';

@Schema()
export class PostLikes {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true }) postId: string;
  @Prop({ required: true }) blogId: string;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) userId: string;
  @Prop({ required: true }) login: string;
  @Prop({ required: true, enum: ['None', 'Like', 'Dislike'] })
  likeStatus: LikeStatusType;
  constructor(postId: string, blogId: string, userId: string, login: string, likeStatus: LikeStatusType) {
    this._id = crypto.randomUUID();
    this.postId = postId;
    this.blogId = blogId;
    this.createdAt = new Date();
    this.userId = userId;
    this.login = login;
    this.likeStatus = likeStatus;
  }
  toDto(): NewestLikeType {
    return {
      addedAt: this.createdAt.toISOString(),
      userId: this.userId,
      login: this.login,
    };
  }
}
export const PostLikesSchema = SchemaFactory.createForClass(PostLikes);
PostLikesSchema.loadClass(PostLikes);
export type PostLikesDocument = HydratedDocument<PostLikes>;
