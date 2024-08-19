import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { CommentsLikesInfo } from '../domain/comments-likesInfo.entity';

@Injectable()
export class CommentsLikesInfoRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(CommentsLikesInfo)
    protected commentsLikesInfoRepository: Repository<CommentsLikesInfo>,
  ) {}

  async createLikeInfoComment(commentLikesInfoDTO: CommentsLikesInfo) {
    await this.commentsLikesInfoRepository.save(commentLikesInfoDTO);
    //     await this.dataSource.query(
    //       `INSERT INTO public."CommentsLikes"(
    // "commentId", "userId", "createdAt", "myStatus")
    // VALUES ($1, $2, $3, $4)`,
    //       [
    //         commentLikesInfoDTO.commentId,
    //         commentLikesInfoDTO.userId,
    //         commentLikesInfoDTO.createdAt,
    //         commentLikesInfoDTO.myStatus,
    //       ],
    //     );
  }

  async findLikeInfoByCommentIdUserId(
    commentId: number,
    userId: number,
  ): Promise<CommentsLikesInfo | null> {
    const data = await this.commentsLikesInfoRepository
      .createQueryBuilder('commentLikesInfo')
      //.select('commentLikesInfo.*')
      .where('commentLikesInfo.commentId = :commentId', { commentId })
      .andWhere('commentLikesInfo.userId = :userId', { userId })
      .getOne();
    return data;
    //     const likeInfo = await this.dataSource.query(
    //       `SELECT id, "commentId", "userId", "createdAt", "myStatus"
    // FROM public."CommentsLikes"
    // WHERE "commentId"=$1 and "userId"=$2`,
    //       [commentId, userId],
    //     );
    //     return likeInfo[0];
  }

  async updateLikeInfoComment(
    commentId: number,
    likeStatus: LikesStatusComments,
    userId: number,
  ) {
    await this.commentsLikesInfoRepository
      .createQueryBuilder()
      .update()
      .set({ myStatus: likeStatus })
      .where('commentId = :commentId', { commentId })
      .andWhere('userId = :userId', { userId })
      .execute();
    //     await this.dataSource.query(
    //       `UPDATE public."CommentsLikes"
    // SET "myStatus"=$2
    // WHERE "commentId"=$1 and "userId"=$3`,
    //       [commentId, likeStatus, userId],
    //     );
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."CommentsLikes"`);
  }
}
