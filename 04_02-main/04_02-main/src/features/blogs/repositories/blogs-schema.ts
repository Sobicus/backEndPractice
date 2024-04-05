import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { BlogUpdateType } from '../types/input';
import { OutputBlogType } from '../types/output';

@Schema()
export class Blog {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  websiteUrl: string;

  @Prop({ required: true })
  createdAt: string;

  @Prop({
    required: true,
  })
  isMembership: boolean;
  constructor(name: string, description: string, websiteUrl: string) {
    // eslint-disable-next-line no-underscore-dangle
    this._id = crypto.randomUUID();
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
    this.createdAt = new Date().toISOString();
    this.isMembership = false;
  }

  toDto(): OutputBlogType {
    return {
      // eslint-disable-next-line no-underscore-dangle
      id: this._id,
      name: this.name,
      description: this.description,
      websiteUrl: this.websiteUrl,
      createdAt: this.createdAt,
      isMembership: this.isMembership,
    };
  }
  updateBlog(params: BlogUpdateType): void {
    this.name = params.name;
    this.description = params.description;
    this.websiteUrl = params.websiteUrl;
  }
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
BlogSchema.loadClass(Blog);

export type BlogsDocument = HydratedDocument<Blog>;
