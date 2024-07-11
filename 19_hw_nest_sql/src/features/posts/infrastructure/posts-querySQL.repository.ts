import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../domain/posts.entity';
import { Model } from 'mongoose';

import { PaginationPostsOutputModelType } from 'src/base/helpers/pagination-posts-helpers';
import {
  PaginationPostsType,
  PostOutputModelType,
} from '../api/models/output/post.output.model';
import { PostsLikesInfoRepository } from './posts-likesInfo.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { LikesStatusComments } from '../../comments/api/models/input/comments-likesInfo.input.model';

@Injectable()
export class PostsQueryRepositorySQL {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
    private postsLikesInfoRepository: PostsLikesInfoRepository,
    @InjectDataSource() protected dataSource: DataSource,
  ) {}

  async getAllPosts(
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';
    const posts = await this.dataSource.query(
      `SELECT p.*,
	(SELECT CAST(count(*) as INTEGER)
	FROM public."PostsLikes" as pl
	WHERE p."id" = pl."postId" and "myStatus"='Like') as likes_count,
	(SELECT CAST(count(*) as INTEGER)
	FROM public."PostsLikes" as pl
	WHERE p."id" = pl."postId" and "myStatus"='Dislike') as dislikes_count
FROM public."Posts" as p
ORDER BY ${sortBy} ${sortDirection}
LIMIT $1 OFFSET $2`,
      [pagination.pageSize, pagination.skip],
    );

    const allPosts = await Promise.all(
      posts.map(async (p) => {
        let myStatus = LikesStatusComments.None;

        if (userId) {
          const reaction = await this.dataSource.query(
            `SELECT *
        FROM public."PostsLikes"
        WHERE "userId"=$2 and "postId"=$1`,
            [p.id, userId],
          );
          myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
        }

        const threeLikes = await this.dataSource.query(
          `SELECT CAST("createdAt" as text),CAST("userId" as text), "login"
FROM public."PostsLikes"
WHERE "postId"=$1
ORDER BY "createdAt" DESC
LIMIT 3 OFFSET 0
`,
          [p.id],
        );

        const threeLastLikes = threeLikes.map((like) => {
          return {
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login,
          };
        });

        return {
          id: p.id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId.toString(),
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: {
            likesCount: p.likes_count,
            dislikesCount: p.dislikes_count,
            myStatus: myStatus,
            newestLikes: threeLastLikes,
          },
        };
      }),
    );
    const totalCount = await this.dataSource
      .query(`SELECT CAST(count(*) as INTEGER)
FROM public."Posts"`);
    const formatTotalCount = totalCount[0].count;

    const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: formatTotalCount,
      items: allPosts,
    };
  }

  async getPostById(
    postId: string,
    userId?: string | null,
  ): Promise<PostOutputModelType | null> {
    const post = await this.dataSource.query(
      `SELECT p.*,
(SELECT CAST(count(*) as INTEGER)
FROM public."PostsLikes" as pl
WHERE p."id" = pl."postId" and "myStatus"='Like') as likes_count,
(SELECT CAST(count(*) as INTEGER)
FROM public."PostsLikes" as pl
WHERE p."id" = pl."postId" and "myStatus"='Dislike') as dislikes_count
FROM public."Posts" as p
WHERE "id"=$1`,
      [postId],
    );
    const postData = post[0];
    if (!postData) {
      return null;
    }
    let myStatus = LikesStatusComments.None;

    if (userId) {
      const reaction = await this.dataSource.query(
        `SELECT *
        FROM public."PostsLikes"
        WHERE "userId"=$2 and "postId"=$1`,
        [postId, userId],
      );
      myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
    }
    const threeLikes = await this.dataSource.query(
      `SELECT CAST("createdAt" as text),CAST("userId" as text), "login"
FROM public."PostsLikes"
WHERE "postId"=$1
ORDER BY "createdAt" DESC
LIMIT 3 OFFSET 0
`,
      [postId],
    );
    const threeLastLikes = threeLikes.map((like) => {
      return {
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.login,
      };
    });
    return {
      id: postData.id.toString(),
      title: postData.title,
      shortDescription: postData.shortDescription,
      content: postData.content,
      blogId: postData.blogId.toString(),
      blogName: postData.blogName,
      createdAt: postData.createdAt,
      extendedLikesInfo: {
        likesCount: postData.likes_count,
        dislikesCount: postData.dislikes_count,
        myStatus: myStatus,
        newestLikes: threeLastLikes,
      },
    };

    //------------------------------------------
    /*
    SELECT
    p."id",
    p."title",
    p."shortDescription",
    p."content",
    p."blogId",
    p."blogName",
    p."createdAt",
    JSON_BUILD_OBJECT(
        'likesCount', COALESCE(likes_count, 0),
        'dislikesCount', COALESCE(dislikes_count, 0),
        'myStatus', 'None', -- Здесь можно указать статус, если он известен
        'newestLikes', COALESCE(newest_likes, '[]'::json)
    ) AS "extendedLikesInfo"
FROM
    public."Posts" p
LEFT JOIN (
    SELECT
        "postId",
        COUNT(*) FILTER (WHERE "myStatus" = 'Like') AS likes_count,
        COUNT(*) FILTER (WHERE "myStatus" = 'Dislike') AS dislikes_count,
        (
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'addedAt', "createdAt",
                    'userId', "userId",
                    'login', "login"
                )
            )
            FROM (
                SELECT "createdAt", "userId", "login"
                FROM public."PostsLikes"
                WHERE "postId" = pl."postId" AND "myStatus" = 'Like'
                ORDER BY "createdAt" DESC
                LIMIT 3
            ) subquery
        ) AS newest_likes
    FROM
        public."PostsLikes" pl
    GROUP BY
        "postId"
) pl ON p."id" = pl."postId"
WHERE
    p."id" = 594;
    */
    //------------------------------------------
  }

  async getPostByBlogId(
    blogId: string,
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType | null> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';

    const posts = await this.dataSource.query(
      `SELECT p.*,
(SELECT CAST(count(*) as INTEGER)
FROM public."PostsLikes" as pl
WHERE p."id" = pl."postId" and "myStatus"='Like') as likes_count,
(SELECT CAST(count(*) as INTEGER)
FROM public."PostsLikes" as pl
WHERE p."id" = pl."postId" and "myStatus"='Dislike') as dislikes_count
FROM public."Posts" as p
WHERE p."blogId"=$1
ORDER BY ${sortBy} ${sortDirection}
LIMIT $2 OFFSET $3`,
      [blogId, pagination.pageSize, pagination.skip],
    );
    console.log('getPostByBlogId======================>>>>>>');
    console.log('posts', posts);
    const allPosts = await Promise.all(
      posts.map(async (p) => {
        let myStatus = LikesStatusComments.None;

        if (userId) {
          const reaction = await this.dataSource.query(
            `SELECT *
        FROM public."PostsLikes"
        WHERE "userId"=$2 and "postId"=$1`,
            [p.id, userId],
          );
          myStatus = reaction[0] ? reaction[0].myStatus : myStatus;
        }

        const threeLikes = await this.dataSource.query(
          `SELECT CAST("createdAt" as text),CAST("userId" as text), "login"
FROM public."PostsLikes"
WHERE "postId"=$1
ORDER BY "createdAt" DESC
LIMIT 3 OFFSET 0
`,
          [p.id],
        );
        console.log('threeLikes', threeLikes);
        const threeLastLikes = threeLikes.map((like) => {
          return {
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login,
          };
        });
        console.log('threeLastLikes', threeLastLikes);

        return {
          id: p.id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId.toString(),
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: {
            likesCount: p.likes_count,
            dislikesCount: p.dislikes_count,
            myStatus: myStatus,
            newestLikes: threeLastLikes,
          },
        };
      }),
    );
    console.log('allPosts', posts);

    const totalCount = await this.dataSource.query(
      `SELECT CAST(count(*) as INTEGER)
FROM public."Posts"
WHERE "blogId"=$1`,
      [blogId],
    );

    const formatTotalCount = totalCount[0].count;

    const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: formatTotalCount,
      items: allPosts,
    };
  }
}
