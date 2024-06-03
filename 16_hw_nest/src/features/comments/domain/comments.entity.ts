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
  @Prop({ type: String, required: true })
  postId: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
