/* eslint-disable no-underscore-dangle */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { LikeStatusType } from '../../../comments/types/comments/input';
import { PostUpdateType } from '../../types/input';
import { NewestLikeType } from '../../types/likes/output';
import { OutputPostType } from '../../types/output';

@Schema()
export class ExtendedLikesInfo {
  @Prop({ required: true, default: 0 })
  likesCount: number;

  @Prop({ required: true, default: 0 })
  dislikesCount: number;

  @Prop({ _id: false, required: true, default: [] })
  newestLikes: NewestLikeType[];
}

export const ExtendedLikesInfoSchema = SchemaFactory.createForClass(ExtendedLikesInfo);

@Schema()
export class Post {
  @Prop({ required: true }) _id: string;

  @Prop({ required: true }) title: string;

  @Prop({ required: true }) shortDescription: string;

  @Prop({ required: true }) content: string;

  @Prop({ required: true }) blogId: string;

  @Prop({ required: true }) blogName: string;

  @Prop({ required: true }) createdAt: string;

  @Prop({ _id: false, required: true, type: ExtendedLikesInfoSchema })
  extendedLikesInfo: ExtendedLikesInfo;
  constructor(title: string, shortDescription: string, content: string, blogId: string, blogName: string) {
    this._id = crypto.randomUUID();
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
    this.createdAt = new Date().toISOString();
    this.extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      newestLikes: [],
    };
  }
  toDto(likeStatus: LikeStatusType = 'None'): OutputPostType {
    return {
      id: this._id.toString(),
      title: this.title,
      shortDescription: this.shortDescription,
      content: this.content,
      blogId: this.blogId,
      blogName: this.blogName,
      createdAt: this.createdAt,
      extendedLikesInfo: {
        likesCount: this.extendedLikesInfo.likesCount,
        dislikesCount: this.extendedLikesInfo.dislikesCount,
        myStatus: likeStatus,
        newestLikes: this.extendedLikesInfo.newestLikes,
      },
    };
  }

  updatePost(params: PostUpdateType): void {
    this.title = params.title;
    this.shortDescription = params.shortDescription;
    this.content = params.content;
    this.blogId = params.blogId;
  }
}

export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.loadClass(Post);
export type PostsDocument = HydratedDocument<Post>;
