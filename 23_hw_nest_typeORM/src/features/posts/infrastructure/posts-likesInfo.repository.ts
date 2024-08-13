import { Injectable } from '@nestjs/common';
import {
  LikesStatusPosts,
  PostLikesInfoInputModel,
} from '../api/models/input/posts-likesInfo.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PostsLikesInfo } from '../domain/posts-likesInfo.entity';

@Injectable()
export class PostsLikesInfoRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(PostsLikesInfo)
    protected postsLikesInfoRepository: Repository<PostsLikesInfo>,
  ) {}

  async findLikeInfoByPostIdUserId(
    postId: number,
    userId: number,
  ): Promise<PostsLikesInfo | null> {
    return await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      //.select('postsLikesInfo.*')
      .where('postsLikesInfo.postId = :postId', { postId })
      .andWhere('postsLikesInfo.userId = :userId', { userId })
      .getOne();
    //     const likeInfo = await this.dataSource.query(
    //       `SELECT *
    // FROM public."PostsLikes"
    // WHERE "postId"=$1 and "userId"=$2`,
    //       [postId, userId],
    //     );
    //     return likeInfo[0];
  }

  async createLikeInfoPost(postLikesInfoDTO: PostsLikesInfo) {
    await this.postsLikesInfoRepository.save(postLikesInfoDTO);
    //     await this.dataSource.query(
    //       `INSERT INTO public."PostsLikes"(
    // "postId", "userId", login, "createdAt", "myStatus")
    // VALUES ($1,$2,$3, $4, $5)`,
    //       [
    //         postLikesInfoDTO.postId,
    //         postLikesInfoDTO.userId,
    //         postLikesInfoDTO.login,
    //         postLikesInfoDTO.createdAt,
    //         postLikesInfoDTO.myStatus,
    //       ],
    //     );
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
