import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Posts.name) private PostsModel: Model<Posts>) {}
  async getPostByPostId(postId: string): Promise<PostsDocument | null> {
    return this.PostsModel.findOne({ _id: new Types.ObjectId(postId) });
  }
  async createPost(post: postCreateDTO): Promise<string> {
    console.log(post);
    console.log(1);
    const createdPost = await this.PostsModel.create(post);
    return createdPost._id.toString();
  }
  async updatePost(postModel: PostsDocument) {
    await this.savePost(postModel);
  }
  async deletePost(postId: string) {
    await this.PostsModel.deleteOne({ _id: new Types.ObjectId(postId) });
  }
  private async savePost(postModel: PostsDocument) {
    await postModel.save();
  }
  async deleteALl() {
    await this.PostsModel.deleteMany();
  }
}
//TODO check type
type postCreateDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};
