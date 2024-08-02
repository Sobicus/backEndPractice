import { Injectable } from '@nestjs/common';
import {
  LikesStatusPosts,
  PostLikesInfoInputModel,
} from '../api/models/input/posts-likesInfo.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesInfoRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findLikeInfoByPostIdUserId(postId: string, userId: string) {
    const likeInfo = await this.dataSource.query(
      `SELECT *
FROM public."PostsLikes"
WHERE "postId"=$1 and "userId"=$2`,
      [postId, userId],
    );
    return likeInfo[0];
  }

  async createLikeInfoPost(postLikesInfoDTO: PostLikesInfoInputModel) {
    await this.dataSource.query(
      `INSERT INTO public."PostsLikes"(
"postId", "userId", login, "createdAt", "myStatus")
VALUES ($1,$2,$3, $4, $5)`,
      [
        postLikesInfoDTO.postId,
        postLikesInfoDTO.userId,
        postLikesInfoDTO.login,
        postLikesInfoDTO.createdAt,
        postLikesInfoDTO.myStatus,
      ],
    );
  }

  async updateLikeInfoPost(
    postId: string,
    userId: string,
    likeStatus: LikesStatusPosts,
  ) {
    await this.dataSource.query(
      `UPDATE public."PostsLikes"
SET "myStatus"=$3
WHERE "postId"=$1 and "userId"=$2`,
      [postId, userId, likeStatus],
    );
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."PostsLikes"`);
  }
}
