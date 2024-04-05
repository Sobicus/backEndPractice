import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PostUpdateType } from '../types/input';
import { Post, PostsDocument } from './post-schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostsDocument>,
  ) {}
  /**
   * Create new post
   * @param newPost - Пост
   * @returns ID созданного поста
   */
  async addPost(newPost: Post): Promise<PostsDocument> {
    const newPostToDB: PostsDocument = new this.PostModel(newPost);
    await newPostToDB.save();
    return newPostToDB;
  }
  /**
   * @param params
   * @param id - post id
   * @returns true,false
   */
  async updateBlog(params: PostUpdateType, id: string): Promise<boolean> {
    const updateResult = await this.PostModel.findByIdAndUpdate(id, params);
    return !!updateResult;
  }
  /**
   * delete current post
   * @param postId
   * @returns true, false
   */
  async deleteBlog(postId: string): Promise<boolean> {
    const deleteResult = await this.PostModel.findByIdAndDelete(postId);
    return !!deleteResult;
  }
  async savePost(post: PostsDocument): Promise<void> {
    await post.save();
  }
  async getPostbyId(postId: string): Promise<PostsDocument | null> {
    return this.PostModel.findById(postId);
  }
}
