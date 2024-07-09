import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostsLikesInfo,
  PostsLikesInfoDocument,
} from '../domain/posts-likesInfo.entity';
import { Model } from 'mongoose';
import {
  LikesStatusPosts,
  PostLikesInfoInputModel,
} from '../api/models/input/posts-likesInfo.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PostsLikesInfoRepositorySQL {
  constructor(
    @InjectModel(PostsLikesInfo.name)
    private PostsLikesInfoModel: Model<PostsLikesInfo>,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}
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

  async countDocuments(
    postId: string,
    likeStatus: 'Like' | 'Dislike',
  ): Promise<number> {
    return this.PostsLikesInfoModel.countDocuments({
      postId,
      myStatus: likeStatus,
    });
  }
  async findLastThreeLikes(postId: string, likeStatus: LikesStatusPosts.Like) {
    return this.PostsLikesInfoModel.find({
      postId: postId,
      myStatus: likeStatus,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }
  async deleteALl() {
    await this.PostsLikesInfoModel.deleteMany();
  }
}
