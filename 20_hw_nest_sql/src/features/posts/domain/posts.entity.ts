import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PostInputModelType } from '../api/models/input/create-post.input.model';

export type PostsDocument = HydratedDocument<Posts>;

@Schema()
export class Posts {
  @Prop({ type: String, required: true })
  title: string;
  @Prop({ type: String, required: true })
  shortDescription: string;
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  blogId: string;
  @Prop({ type: String, required: true })
  blogName: string;
  @Prop({ type: String, required: true })
  createdAt: string;

  update({ title, shortDescription, content, blogId }: PostInputModelType) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
  }
}

export const PostsSchema = SchemaFactory.createForClass(Posts);

PostsSchema.methods = {
  update: Posts.prototype.update,
};
