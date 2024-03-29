import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import { ObjectId } from 'mongodb';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Posts.name) private PostsModel: Model<Posts>) {}
  async getPostByPostId(postId: string): Promise<PostsDocument | null> {
    return this.PostsModel.findOne({ _id: new ObjectId(postId) });
  }
  async createPost(post: postCreateDTO): Promise<string> {
    const createdPost = await this.PostsModel.create(post);
    return createdPost._id.toString();
  }
  async updatePost(postModel: PostsDocument) {
    await this.savePost(postModel);
  }
  async deletePost(postId: string) {
    await this.PostsModel.deleteOne({ _id: new ObjectId(postId) });
  }
  private async savePost(postModel: PostsDocument) {
    await postModel.save();
  }
}
type postCreateDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
