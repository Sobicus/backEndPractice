import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogsDocument = HydratedDocument<Blogs>;

@Schema()
export class Blogs {
  @Prop({ type: String, required: true })
  name: string;
  @Prop()
  description: string;
  @Prop()
  websiteUrl: string;
  @Prop()
  createdAt: string;
  @Prop()
  isMembership: boolean;
}

export const BlogsSchema = SchemaFactory.createForClass(Blogs);
