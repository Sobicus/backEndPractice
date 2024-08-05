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

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comments)
    protected commentsRepository: Repository<Comments>,
  ) {}

  async getCommentById(
    commentsId: number | string,
    userId?: string,
  ): Promise<CommentOutputModel | null> {
    const commentData = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select(['comment.*', 'user.login as "userLogin"'])
      .where('comment.id = :commentsId', { commentsId })
      .getRawOne();
    if (!commentData) {
      return null;
    }
    return {
      id: commentData.id.toString(),
      content: commentData.content,
      commentatorInfo: {
        userId: commentData.userId.toString(),
        userLogin: commentData.userLogin,
      },
      createdAt: commentData.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
    //     const comment = await this.dataSource.query(
    //       `SELECT c.*,
    // (SELECT CAST(count(*) as INTEGER)
    // FROM public."CommentsLikes" as cl
    // WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Like') as likes_count,
    // (SELECT CAST(count(*) as INTEGER)
    // FROM public."CommentsLikes" as cl
    // WHERE c."id"=cl."commentId" and cl."myStatus" ILIKE 'Dislike') as dislikes_count
    // FROM public."Comments" as c
    // WHERE "id"=$1`,
    //       [commentsId],
    //     );
    //
    //     if (!comment[0]) {
    //       return null;
    //     }
    //
    //     let myStatus = LikesStatusComments.None;
    //
    //     if (userId) {
    //       const reaction = await this.dataSource.query(
    //         `SELECT *
    //         FROM public."CommentsLikes"
    //         WHERE "commentId"=$1 and "userId"=$2`,
    //         [commentsId, userId],
    //       );
    //       myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
    //     }
    //
    //     return {
    //       id: comment[0].id.toString(),
    //       content: comment[0].content,
    //       commentatorInfo: {
    //         userId: comment[0].userId.toString(),
    //         userLogin: comment[0].userLogin,
    //       },
    //       createdAt: comment[0].createdAt,
    //       likesInfo: {
    //         likesCount: comment[0].likes_count,
    //         dislikesCount: comment[0].dislikes_count,
    //         myStatus: myStatus,
    //       },
    //     };
  }

  async getCommentsByPostId(
    postId: string,
    pagination: PaginationCommentsOutputModelType,
    userId?: string,
  ): Promise<CommentsOutputModel> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const commentsData = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .select(['comment.*', 'user.login as "userLogin"'])
      .where('comment.postId = :postId', { postId })
      .orderBy(sortBy, sortDirection)
      .offset(pagination.skip)
      .limit(pagination.pageSize)
      .getRawMany();

    const allComments = commentsData.map((comment) => {
      return {
        id: comment.id.toString(),
        content: comment.content,
        commentatorInfo: {
          userId: comment.userId.toString(),
          userLogin: comment.userLogin,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
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
