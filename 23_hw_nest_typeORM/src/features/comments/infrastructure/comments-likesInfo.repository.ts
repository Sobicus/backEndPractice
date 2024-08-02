import { Injectable } from '@nestjs/common';
import {
  CommentsLikesInfoInputModel,
  LikesStatusComments,
} from '../api/models/input/comments-likesInfo.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsLikesInfoRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async createLikeInfoComment(
    commentLikesInfoDTO: CommentsLikesInfoInputModel,
  ) {
    await this.dataSource.query(
      `INSERT INTO public."CommentsLikes"(
"commentId", "userId", "createdAt", "myStatus")
VALUES ($1, $2, $3, $4)`,
      [
        commentLikesInfoDTO.commentId,
        commentLikesInfoDTO.userId,
        commentLikesInfoDTO.createdAt,
        commentLikesInfoDTO.myStatus,
      ],
    );
  }

  async findLikeInfoByCommentIdUserId(commentId: string, userId: string) {
    const likeInfo = await this.dataSource.query(
      `SELECT id, "commentId", "userId", "createdAt", "myStatus"
FROM public."CommentsLikes"
WHERE "commentId"=$1 and "userId"=$2`,
      [commentId, userId],
    );
    return likeInfo[0];
  }

  async updateLikeInfoComment(
    commentId: string,
    likeStatus: LikesStatusComments,
    userId: string,
  ) {
    await this.dataSource.query(
      `UPDATE public."CommentsLikes"
SET "myStatus"=$2
WHERE "commentId"=$1 and "userId"=$3`,
      [commentId, likeStatus, userId],
    );
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."CommentsLikes"`);
  }
}
