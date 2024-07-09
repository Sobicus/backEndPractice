import { Injectable } from '@nestjs/common';
import {
  CommentOutputModel,
  CommentsOutputModel,
} from '../api/models/input/comments.input.model';
import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PaginationCommentsOutputModelType } from '../../../base/helpers/pagination-comments-helpers';

@Injectable()
export class CommentsQueryRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getCommentById(
    commentsId: number | string,
    userId?: string,
  ): Promise<CommentOutputModel | null> {
    const comment = await this.dataSource.query(
      `SELECT c.*,
(SELECT CAST(count(*) as INTEGER)
FROM public."CommentsLikes" as cl
WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Like') as likes_count,
(SELECT CAST(count(*) as INTEGER)
FROM public."CommentsLikes" as cl
WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Dislike') as dislikes_count
FROM public."Comments" as c
WHERE "id"=$1`,
      [commentsId],
    );

    if (!comment[0]) {
      return null;
    }

    let myStatus = LikesStatusComments.None;

    if (userId) {
      const reaction = await this.dataSource.query(
        `SELECT *
        FROM public."CommentsLikes"
        WHERE "commentId"=$1 and "userId"=$2`,
        [commentsId, userId],
      );
      myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
    }

    return {
      id: comment[0].id,
      content: comment[0].content,
      commentatorInfo: {
        userId: comment[0].userId,
        userLogin: comment[0].userLogin,
      },
      createdAt: comment[0].createdAt,
      likesInfo: {
        likesCount: comment[0].likes_count,
        dislikesCount: comment[0].dislikes_count,
        myStatus: myStatus,
      },
    };
  }

  async getCommentsByPostId(
    postId: string,
    pagination: PaginationCommentsOutputModelType,
    userId?: string,
  ): Promise<CommentsOutputModel> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';
    const comments = await this.dataSource.query(
      `SELECT c.*,
(SELECT CAST(count(*) as INTEGER)
FROM public."CommentsLikes" as cl
WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Like') as likes_count,
(SELECT CAST(count(*) as INTEGER)
FROM public."CommentsLikes" as cl
WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Dislike') as dislikes_count
FROM public."Comments" as c
WHERE "postId"=$1
ORDER BY ${sortBy} ${sortDirection}
LIMIT $2 OFFSET $3`,
      [postId, pagination.pageSize, pagination.skip],
    );
    const allComments = await Promise.all(
      comments.map(async (comment) => {
        let myStatus = LikesStatusComments.None;

        if (userId) {
          const reaction = await this.dataSource.query(
            `SELECT *
        FROM public."CommentsLikes"
        WHERE "commentId"=${comment.id} and "userId"=$1`,
            [userId],
          );
          myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
        }

        return {
          id: comment.id,
          content: comment.content,
          commentatorInfo: {
            userId: comment.userId,
            userLogin: comment.userLogin,
          },
          createdAt: comment.createdAt,
          likesInfo: {
            likesCount: comment.likes_count,
            dislikesCount: comment.dislikes_count,
            myStatus: myStatus,
          },
        };
      }),
    );

    const totalCount = await this.dataSource.query(
      `SELECT CAST(count(*) as INTEGER)
      FROM public."Comments"
            WHERE "postId"=$1`,
      [postId],
    );
    const formatTotalCount = totalCount[0].count;

    const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: formatTotalCount,
      items: allComments,
    };
  }
}
