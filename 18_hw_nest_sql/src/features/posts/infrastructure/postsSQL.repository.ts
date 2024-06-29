import { Injectable } from '@nestjs/common';
import {
  postCreateDTO,
  PostUpdateDTO,
} from '../api/models/input/create-post.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getPostByPostId(postId: string) {
    const post = await this.dataSource.query(
      `SELECT *
    FROM public."Posts"
      WHERE "id"=CAST($1 as INTEGER)`,
      [postId],
    );
    return post[0];
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

  async updatePost(postUpdateDTO: PostUpdateDTO) {
    await this.dataSource.query(
      `UPDATE public."Posts"
SET "title"=$1, "shortDescription"=$2, "content"=$3
WHERE "id"=CAST($4 as INTEGER)`,
      [
        postUpdateDTO.title,
        postUpdateDTO.shortDescription,
        postUpdateDTO.content,
        postUpdateDTO.postId,
      ],
    );
  }

  async deletePost(postId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Posts"
WHERE "id"=$1`,
      [postId],
    );
  }
}
