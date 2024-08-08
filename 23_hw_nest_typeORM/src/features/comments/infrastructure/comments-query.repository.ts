import { Injectable } from '@nestjs/common';
import {
  CommentOutputModel,
  CommentsOutputModel,
} from '../api/models/input/comments.input.model';
import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationCommentsOutputModelType } from '../../../base/helpers/pagination-comments-helpers';
import { Comments } from '../domain/comments.entity';
import { CommentsLikesInfo } from '../domain/comments-likesInfo.entity';
import { makeLogger } from 'ts-loader/dist/logger';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comments)
    protected commentsRepository: Repository<Comments>,
    @InjectRepository(CommentsLikesInfo)
    protected commentsLikesInfoRepository: Repository<CommentsLikesInfo>,
  ) {}

  async getCommentById(
    commentsId: number | string,
    userId?: string,
  ): Promise<CommentOutputModel | null> {
    const commentData = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'user.login',
        'comment.createdAt',
        'comment.userId',
      ])
      .leftJoin('comment.user', 'user')
      .addSelect((qb) => {
        return qb
          .select('COUNT(commentLikesInfoLike.id)')
          .from(CommentsLikesInfo, 'commentLikesInfoLike')
          .where('commentLikesInfoLike.commentId = comment.id')
          .andWhere('commentLikesInfoLike.myStatus = :like', { like: 'Like' })
          .groupBy('commentLikesInfoLike.commentId');
      }, 'likesCount')
      .addSelect((qb) => {
        return qb
          .select('COUNT(commentLikesInfoDislike.id)')
          .from(CommentsLikesInfo, 'commentLikesInfoDislike')
          .where('commentLikesInfoDislike.commentId = comment.id')
          .andWhere('commentLikesInfoDislike.myStatus = :dislike', {
            dislike: 'Dislike',
          })
          .groupBy('commentLikesInfoDislike.commentId');
      }, 'dislikesCount')
      .where('comment.id = :commentsId', { commentsId })
      .getRawOne();
    console.log('commentData', commentData);

    if (!commentData) {
      return null;
    }
    let myStatus = LikesStatusComments.None;

    if (userId) {
      const reaction = await this.commentsLikesInfoRepository
        .createQueryBuilder('commentLikesInfo')
        .where('commentLikesInfo.commentId = :commentsId', { commentsId })
        .andWhere('commentLikesInfo.userId = :userId', { userId })
        .getOne();

      myStatus = reaction ? reaction.myStatus : myStatus;
    }
    return {
      id: commentData.comment_id.toString(),
      content: commentData.comment_content,
      commentatorInfo: {
        userId: commentData.comment_userId.toString(),
        userLogin: commentData.user_login,
      },
      createdAt: commentData.comment_createdAt,
      likesInfo: {
        likesCount: Number(commentData.likesCount) ?? 0,
        dislikesCount: Number(commentData.dislikesCount) ?? 0,
        myStatus: myStatus,
      },
    };
  }

  async getCommentsByPostId(
    postId: string,
    pagination: PaginationCommentsOutputModelType,
    userId?: string,
  ): Promise<CommentsOutputModel> {
    //const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortBy = pagination.sortBy
      ? `"comment"."${pagination.sortBy}"`
      : '"comment"."createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';
    const commentsData = await this.commentsRepository
      .createQueryBuilder('comment')
      .select([
        'comment.id',
        'comment.content',
        'comment.userId',
        'comment.createdAt',
        'user.login',
      ])
      .leftJoin('comment.user', 'user')
      // .addSelect((qb) => {
      //   return qb
      //     .select('COUNT(commentLikesInfoLike.id)')
      //     .from(CommentsLikesInfo, 'commentLikesInfoLike')
      //     .where('commentLikesInfoLike.commentId = comment.id')
      //     .andWhere('commentLikesInfoLike.myStatus = :like', { like: 'Like' })
      //     .groupBy('commentLikesInfoLike.commentId');
      // }, 'likesCount')
      // .addSelect((qb) => {
      //   return qb
      //     .select('COUNT(commentLikesInfoDislike.id')
      //     .from(CommentsLikesInfo, 'commentLikesInfoDislike')
      //     .where('commentLikesInfoDislike.commentId = comment.id')
      //     .andWhere('commentLikesInfoDislike.myStatus = :dislike', {
      //       dislike: 'Dislike',
      //     })
      //     .groupBy('commentLikesInfoDislike.commentId');
      // }, 'dislikesCount')
      .where('comment.postId = :postId', { postId })
      .orderBy(sortBy, sortDirection)
      .offset(pagination.skip)
      .limit(pagination.pageSize)
      .getRawMany();
    const commentsIds = commentsData.map((comment) => comment.comment_id);
    const commentsLikeInfo = await this.commentsLikesInfoRepository
      .createQueryBuilder('commentLikesInfo')
      .select([
        'commentLikesInfo.commentId',
        'commentLikesInfo.userId',
        'commentLikesInfo.myStatus',
      ])
      .where('commentLikesInfo.commentId IN (:...commentsIds)', { commentsIds })
      .getRawMany();

    const allComments = commentsData.map((comment) => {
      const like = 0;
      const dislike = 0;

      const myStatus = LikesStatusComments.None;

      // if (userId) {
      //   if (userId === comment.comment_userId) {
      //   }
      //   const reaction = await this.dataSource.query(
      //     `SELECT *
      //         FROM public."CommentsLikes"
      //         WHERE "commentId"=${comment.id} and "userId"=$1`,
      //     [userId],
      //   );
      //   myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
      // }

      commentsLikeInfo.map((l) => {
        if (l.commentLikesInfo_userId === userId) {
          myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
        }
        if (
          l.commentLikesInfo_commentId === comment.comment_id &&
          l.commentLikesInfo_myStatus === 'Like'
        ) {
          like++;
          console.log('Like 123123123');
        }
      });
      commentsLikeInfo.map((d) => {
        if (
          d.commentLikesInfo_commentId === comment.comment_id &&
          d.commentLikesInfo_myStatus === 'Dislike'
        ) {
          dislike++;
          console.log('Dislike 123123123');
          console.log('Dislike 123123123', dislike);
        }
      });
      console.log('dislike', dislike);
      return {
        id: comment.comment_id.toString(),
        content: comment.comment_content,
        commentatorInfo: {
          userId: comment.comment_userId.toString(),
          userLogin: comment.user_login,
        },
        createdAt: comment.comment_createdAt,
        likesInfo: {
          likesCount: like,
          dislikesCount: dislike,
          myStatus: 'None',
        },
      };
    });

    const totalCount = await this.commentsRepository
      .createQueryBuilder('comment')
      .where('comment.postId = :postId', { postId })
      .getCount();

    const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allComments,
    };
    //     const comments = await this.dataSource.query(
    //       `SELECT c.*,
    // (SELECT CAST(count(*) as INTEGER)
    // FROM public."CommentsLikes" as cl
    // WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Like') as likes_count,
    // (SELECT CAST(count(*) as INTEGER)
    // FROM public."CommentsLikes" as cl
    // WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Dislike') as dislikes_count
    // FROM public."Comments" as c
    // WHERE "postId"=$1
    // ORDER BY ${sortBy} ${sortDirection}
    // LIMIT $2 OFFSET $3`,
    //       [postId, pagination.pageSize, pagination.skip],
    //     );
    //     const allComments = await Promise.all(
    //       comments.map(async (comment) => {
    //         let myStatus = LikesStatusComments.None;
    //
    //         if (userId) {
    //           const reaction = await this.dataSource.query(
    //             `SELECT *
    //         FROM public."CommentsLikes"
    //         WHERE "commentId"=${comment.id} and "userId"=$1`,
    //             [userId],
    //           );
    //           myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
    //         }
    //
    //         return {
    //           id: comment.id.toString(),
    //           content: comment.content,
    //           commentatorInfo: {
    //             userId: comment.userId.toString(),
    //             userLogin: comment.userLogin,
    //           },
    //           createdAt: comment.createdAt,
    //           likesInfo: {
    //             likesCount: comment.likes_count,
    //             dislikesCount: comment.dislikes_count,
    //             myStatus: myStatus,
    //           },
    //         };
    //       }),
    //     );
    //
    //     const totalCount = await this.dataSource.query(
    //       `SELECT CAST(count(*) as INTEGER)
    //       FROM public."Comments"
    //             WHERE "postId"=$1`,
    //       [postId],
    //     );
    //     const formatTotalCount = totalCount[0].count;
    //
    //     const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);
    //     return {
    //       pagesCount: pagesCount,
    //       page: pagination.pageNumber,
    //       pageSize: pagination.pageSize,
    //       totalCount: formatTotalCount,
    //       items: allComments,
    //     };
  }
}
