import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Posts, PostsDocument } from '../domain/posts.entity';
import { postCreateDTO } from '../api/models/input/create-post.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepositorySQL {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getPostByPostId(postId: string): Promise<PostsDocument | null> {
    return this.PostsModel.findOne({ _id: new Types.ObjectId(postId) });
  }

  async createPost(post: postCreateDTO) {
    const postId = await this.dataSource.query(
      `INSERT INTO public."Posts"(
"title", "shortDescription", "content", "blogId", "blogName", "createdAt")
VALUES ($1, $2, $3, CAST($4 as INTEGER), $5, $6)
RETURNING "id"`,
      [
        post.title,
        post.shortDescription,
        post.content,
        post.blogId,
        post.blogName,
        post.createdAt,
      ],
    );
    console.log('postId[0].id', postId[0].id);
    return postId[0].id;
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
