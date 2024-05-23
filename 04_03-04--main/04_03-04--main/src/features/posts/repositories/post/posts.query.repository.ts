import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OutputPostType } from '../../types/output';
import { Post, PostsDocument } from './post.schema';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostsDocument>,
  ) {}

  async findById(postId: string): Promise<OutputPostType | null> {
    const targetPost: PostsDocument | null = await this.PostModel.findById(postId);
    if (!targetPost) return null;
    return targetPost.toDto();
  }
}
