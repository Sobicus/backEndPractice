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
    console.log(comment);
    // const comment = await this.dataSource.query(
    //   `SELECT *
    // FROM public."Comments"
    // WHERE "id"=CAST($1 as INTEGER)`,
    //   [commentsId],
    // );
    //
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

    // const likesCount = await this.dataSource.query(
    //   `SELECT CAST(count(*)as INTEGER)
    //     FROM public."CommentsLikes"
    //     WHERE "commentId"=$1 and "myStatus" ILIKE $2`,
    //   [commentsId, LikesStatusComments.Like],
    // );
    //
    // const dislikesCount = await this.dataSource.query(
    //   `SELECT CAST(count(*)as INTEGER)
    //     FROM public."CommentsLikes"
    //     WHERE "commentId"=$1 and "myStatus" ILIKE $2`,
    //   [commentsId, LikesStatusComments.Dislike],
    // );

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

  // async getCommentsByPostId(
  //   postId: string,
  //   pagination: PaginationCommentsOutputModelType,
  //   userId?: string,
  // ): Promise<CommentsOutputModel> {
  //   const comments = await this.CommentsModel.find({ postId })
  //     .sort({ [pagination.sortBy]: pagination.sortDirection })
  //     .limit(pagination.pageSize)
  //     .skip(pagination.skip)
  //     .lean();
  //   const allComments = await Promise.all(
  //     comments.map(async (comment) => {
  //       let myStatus = LikesStatusComments.None;
  //       if (userId) {
  //         const reaction =
  //           await this.commentsLikesInfoRepository.findLikeInfoByCommentIdUserId(
  //             comment._id as number,
  //             userId,
  //           );
  //         myStatus = reaction ? reaction.myStatus : myStatus;
  //       }
  //       const likesCount =
  //         await this.commentsLikesInfoRepository.countDocuments(
  //           comment._id,
  //           LikesStatusComments.Like,
  //         );
  //       const dislikesCount =
  //         await this.commentsLikesInfoRepository.countDocuments(
  //           comment._id,
  //           LikesStatusComments.Dislike,
  //         );
  //       return {
  //         id: comment._id,
  //         content: comment.content,
  //         commentatorInfo: {
  //           userId: comment.userId,
  //           userLogin: comment.userLogin,
  //         },
  //         createdAt: comment.createdAt,
  //         likesInfo: {
  //           likesCount: likesCount,
  //           dislikesCount: dislikesCount,
  //           myStatus: myStatus,
  //         },
  //       };
  //     }),
  //   );
  //   const totalCount = await this.CommentsModel.countDocuments({ postId });
  //   const pagesCount = Math.ceil(totalCount / pagination.pageSize);
  //   return {
  //     pagesCount: pagesCount,
  //     page: pagination.pageNumber,
  //     pageSize: pagination.pageSize,
  //     totalCount: totalCount,
  //     items: allComments,
  //   };
  // }
}
