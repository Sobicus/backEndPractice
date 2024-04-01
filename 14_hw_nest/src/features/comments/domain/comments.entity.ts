import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentsDocument = HydratedDocument<Comments>;

@Schema()
export class Comments {
  @Prop({ type: String, required: true })
  content: string;
  @Prop({ type: String, required: true })
  userId: string;
  @Prop({ type: String, required: true })
  userLogin: string;
  @Prop({ type: String, required: true })
  createdAt: string;
  // update({ title, shortDescription, content, blogId }: PostInputModelType) {
  //   this.title = title;
  //   this.shortDescription = shortDescription;
  //   this.content = content;
  //   this.blogId = blogId;
  // }
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
//
// PostsSchema.methods = {
//   update: Posts.prototype.update,
// };
