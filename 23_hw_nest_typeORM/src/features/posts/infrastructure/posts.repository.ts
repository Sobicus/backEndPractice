import { Injectable } from '@nestjs/common';
import { PostUpdateDTO } from '../api/models/input/create-post.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Posts } from '../domain/posts.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Posts) protected postsRepository: Repository<Posts>,
  ) {}

  async getPostByPostId(postId: string): Promise<Posts | null> {
    //return await this.postsRepository.findOne({ where: { id: postId } });
    return await this.postsRepository
      .createQueryBuilder('posts')
      .where('posts.id = :id', { id: postId })
      .getOne();
    // const post = await this.dataSource.query(
    //   `SELECT *
    // FROM public."Posts"
    //   WHERE "id"=CAST($1 as INTEGER)`,
    //   [postId],
    // );
    // return post[0];
  }

  async createPost(postDTO: Posts): Promise<number> {
    const post = await this.postsRepository.save(postDTO);
    return post.id;
    //     const postId = await this.dataSource.query(
    //       `INSERT INTO public."Posts"(
    // "title", "shortDescription", "content", "blogId", "blogName", "createdAt")
    // VALUES ($1, $2, $3, CAST($4 as INTEGER), $5, $6)
    // RETURNING "id"`,
    //       [
    //         post.title,
    //         post.shortDescription,
    //         post.content,
    //         post.blogId,
    //         post.blogName,
    //         post.createdAt,
    //       ],
    //     );
    //     console.log('postId[0].id', postId[0].id);
    //     return postId[0].id;
  }

  async updatePost(postUpdateDTO: PostUpdateDTO) {
    await this.postsRepository
      .createQueryBuilder('posts')
      .update()
      .set({
        title: postUpdateDTO.title,
        shortDescription: postUpdateDTO.shortDescription,
        content: postUpdateDTO.content,
      })
      .where('id = :id', { id: postUpdateDTO.postId })
      .execute();
    //     await this.dataSource.query(
    //       `UPDATE public."Posts"
    // SET "title"=$1, "shortDescription"=$2, "content"=$3
    // WHERE "id"=CAST($4 as INTEGER)`,
    //       [
    //         postUpdateDTO.title,
    //         postUpdateDTO.shortDescription,
    //         postUpdateDTO.content,
    //         postUpdateDTO.postId,
    //       ],
    //     );
  }

  async deletePost(postId: number) {
    await this.postsRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: postId })
      .execute();
    //     await this.dataSource.query(
    //       `DELETE FROM public."Posts"
    // WHERE "id"=$1`,
    //       [postId],
    //     );
  }
  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Posts"`);
  }
}
