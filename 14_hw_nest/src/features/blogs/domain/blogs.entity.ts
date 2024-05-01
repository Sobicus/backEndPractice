import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BlogInputModelType } from '../api/models/input/create-blog.input.model';

@Schema()
export class Blogs {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: String, required: true })
  description: string;
  @Prop({ type: String, required: true })
  websiteUrl: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  @Prop({ type: Boolean, required: true, default: false })
  isMembership: boolean;

  static create({
    name,
    websiteUrl,
    description,
  }: BlogInputModelType): BlogsDocument {
    const blog = new this();
    blog.name = name;
    blog.websiteUrl = websiteUrl;
    blog.description = description;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    return blog as BlogsDocument;
  }

  update({ name, websiteUrl, description }: BlogInputModelType) {
    this.name = name;
    this.websiteUrl = websiteUrl;
    this.description = description;
  }
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);

export type BlogsDocument = HydratedDocument<Blogs>;

BlogsSchema.statics = {
  create: Blogs.create,
};

BlogsSchema.methods = {
  update: Blogs.prototype.update,
};
