import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { PaginationPostsOutputModelType } from 'src/base/helpers/pagination-posts-helpers';
import { DataSource, Repository } from 'typeorm';

import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';
import {
  PaginationPostsType,
  PostOutputModelType,
} from '../api/models/output/post.output.model';
import { Posts } from '../domain/posts.entity';
import { PostsLikesInfo } from '../domain/posts-likesInfo.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Posts)
    protected postsRepository: Repository<Posts>,
    @InjectRepository(PostsLikesInfo)
    protected postsLikesInfoRepository: Repository<PostsLikesInfo>,
  ) {}

  async getAllPosts(
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    //all posts with likes and dislikes
    const postsData = await this.postsRepository
      .createQueryBuilder('post')
      .select(['post.*', 'blog.name as "blogName"'])
      .leftJoin('post.blog', 'blog')
      .addSelect((qb) => {
        return qb
          .select('COUNT(like.id)')
          .from(PostsLikesInfo, 'like')
          .where('like.postId = post.id')
          .andWhere('like.myStatus = :like', { like: 'Like' });
      }, 'likesCount')
      .addSelect((qb) => {
        return qb
          .select('COUNT(dislike.id)')
          .from(PostsLikesInfo, 'dislike')
          .where('dislike.postId = post.id')
          .andWhere('dislike.myStatus = :dislike', { dislike: 'Dislike' });
      }, 'dislikesCount')
      .orderBy(sortBy, sortDirection)
      .limit(pagination.pageSize)
      .offset(pagination.skip)
      .getRawMany();
    //take all postsId from postData
    const postsIds = postsData.map((p) => p.id);
    //get 3 last likes by postsIds
    if (postsIds.length === 0) {
      return {
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: [],
      };
    }
    const postsLikesInfo = await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      .select([
        'postsLikesInfo.createdAt as "addedAt"',
        'postsLikesInfo.userId as "userId"',
        'postsLikesInfo.postId as "postId"',
        'user.login as "login"',
      ])
      .leftJoin('postsLikesInfo.user', 'user')
      .where('postsLikesInfo.postId IN (:...postsIds)', { postsIds })
      .andWhere('postsLikesInfo.myStatus = :like', { like: 'Like' })
      .orderBy('postsLikesInfo.createdAt', 'DESC')
      //.limit(3)
      .getRawMany();

    const allPostsLikesInfo = await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      .select([
        'postsLikesInfo.createdAt',
        'postsLikesInfo.userId',
        'postsLikesInfo.postId',
        'user.login',
        'postsLikesInfo.myStatus as "myStatus"',
      ])
      .leftJoin('postsLikesInfo.user', 'user')
      .where('postsLikesInfo.postId IN (:...postsIds)', { postsIds })
      .andWhere('postsLikesInfo.userId = :userId', { userId })
      .getRawMany();
    const allPosts = postsData.map((p) => {
      let myStatus = LikesStatusPosts.None;
      if (userId) {
        const reaction = allPostsLikesInfo.find(
          (like) =>
            like.postsLikesInfo_postId === p.id &&
            like.postsLikesInfo_userId === +userId,
        );

        myStatus = reaction ? reaction.myStatus : myStatus;
      }
      const newsLikes = postsLikesInfo
        .filter((like) => like.postId === p.id)
        .slice(0, 3)
        .map((like) => {
          return {
            addedAt: like.addedAt,
            login: like.login,
            userId: like.userId.toString(),
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
          likesCount: Number(p.likesCount),
          dislikesCount: Number(p.dislikesCount),
          myStatus: myStatus,
          newestLikes: newsLikes,
        },
      };
    });
    const totalCount = await this.postsRepository
      .createQueryBuilder('post')
      .getCount();

    const pagesCount = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allPosts,
    };
  }

  async getPostById(
    postId: number,
    userId?: string | null,
  ): Promise<PostOutputModelType | null> {
    const postData = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoin('post.blog', 'blog')
      .select([
        'post.id',
        'post.title',
        'post.shortDescription',
        'post.content',
        'post.blogId',
        'blog.name',
        'post.createdAt',
      ])
      .addSelect((qb) => {
        return qb
          .select('COUNT(like.id)')
          .from(PostsLikesInfo, 'like')
          .where('like.postId = post.id')
          .andWhere('like.myStatus = :like', { like: 'Like' });
      }, 'likesCount')
      .addSelect((qb) => {
        return qb
          .select('COUNT(dislike.id)')
          .from(PostsLikesInfo, 'dislike')
          .where('dislike.postId = post.id')
          .andWhere('dislike.myStatus = :dislike', { dislike: 'Dislike' });
      }, 'dislikesCount')
      .where('post.id = :postId', { postId })
      .getRawOne();

    if (!postData) {
      return null;
    }

    let myStatus = LikesStatusPosts.None;
    if (userId) {
      const reaction = await this.postsLikesInfoRepository
        .createQueryBuilder('postsLikesInfo')
        .where('postsLikesInfo.postId = :postId', { postId })
        .andWhere('postsLikesInfo.userId = :userId', { userId })
        .getOne();
      myStatus = reaction ? reaction.myStatus : myStatus;
    }
    const newsLikes = await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      .select([
        'postsLikesInfo.createdAt',
        'postsLikesInfo.userId',
        'user.login',
      ])
      .leftJoinAndSelect('postsLikesInfo.user', 'user')
      .where('postsLikesInfo.postId = :postId', { postId })
      .andWhere('postsLikesInfo.myStatus = :like', { like: 'Like' })
      .orderBy('postsLikesInfo.createdAt', 'DESC')
      .limit(3)
      .getRawMany();
    const threeLastLikes = newsLikes.map((like) => {
      return {
        addedAt: like.postsLikesInfo_createdAt,
        userId: like.postsLikesInfo_userId.toString(),
        login: like.login,
      };
    });

    return {
      id: postData.post_id.toString(),
      title: postData.post_title,
      shortDescription: postData.post_shortDescription,
      content: postData.post_content,
      blogId: postData.post_blogId.toString(),
      blogName: postData.blog_name,
      createdAt: postData.post_createdAt,
      extendedLikesInfo: {
        likesCount: Number(postData.likesCount),
        dislikesCount: Number(postData.dislikesCount),
        myStatus: myStatus,
        newestLikes: threeLastLikes,
      },
    };
  }

  async getPostByBlogId(
    blogId: string,
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType> {
    const sortBy = `post."${pagination.sortBy}"` ?? 'post."createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';
    //all postsByBlogId with likes and dislikes
    const postsData = await this.postsRepository
      .createQueryBuilder('post')
      .select(['post.*', 'blog.name as "blogName"'])
      .leftJoin('post.blog', 'blog')
      .addSelect((qb) => {
        return qb
          .select('COUNT(like.id)')
          .from(PostsLikesInfo, 'like')
          .where('like.postId = post.id')
          .andWhere('like.myStatus = :like', { like: 'Like' });
      }, 'likesCount')
      .addSelect((qb) => {
        return qb
          .select('COUNT(dislike.id)')
          .from(PostsLikesInfo, 'dislike')
          .where('dislike.postId = post.id')
          .andWhere('dislike.myStatus = :dislike', { dislike: 'Dislike' });
      }, 'dislikesCount')
      .where('post.blogId = :blogId', { blogId })
      .orderBy(sortBy, sortDirection)
      .limit(pagination.pageSize)
      .offset(pagination.skip)
      .getRawMany();
    //take all postsId from postData
    const postsIds = postsData.map((p) => p.id);
    //get 3 last likes by postsIds
    const postsLikesInfo = await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      .select([
        'postsLikesInfo.createdAt as "addedAt"',
        'postsLikesInfo.userId as "userId"',
        'postsLikesInfo.postId as "postId"',
        'user.login as "login"',
      ])
      .leftJoin('postsLikesInfo.user', 'user')
      .where('postsLikesInfo.postId IN (:...postsIds)', { postsIds })
      .andWhere('postsLikesInfo.myStatus = :like', { like: 'Like' })
      .orderBy('postsLikesInfo.createdAt', 'DESC')
      .getRawMany();

    const allPostsLikesInfo = await this.postsLikesInfoRepository
      .createQueryBuilder('postsLikesInfo')
      .select([
        'postsLikesInfo.createdAt',
        'postsLikesInfo.userId',
        'postsLikesInfo.postId',
        'user.login',
        'postsLikesInfo.myStatus as "myStatus"',
      ])
      .leftJoin('postsLikesInfo.user', 'user')
      .where('postsLikesInfo.postId IN (:...postsIds)', { postsIds })
      .andWhere('postsLikesInfo.userId = :userId', { userId })
      .getRawMany();

    const allPosts = postsData.map((p) => {
      let myStatus = LikesStatusPosts.None;
      if (userId) {
        const reaction = allPostsLikesInfo.find(
          (like) =>
            like.postsLikesInfo_postId === p.id &&
            like.postsLikesInfo_userId === +userId,
        );
        myStatus = reaction ? reaction.myStatus : myStatus;
      }
      const newsLikes = postsLikesInfo
        .filter((like) => like.postId === p.id)
        .slice(0, 3)
        .map((like) => {
          return {
            addedAt: like.addedAt,
            login: like.login,
            userId: like.userId.toString(),
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
          likesCount: Number(p.likesCount),
          dislikesCount: Number(p.dislikesCount),
          myStatus: myStatus,
          newestLikes: newsLikes,
        },
      };
    });
    const totalCount = await this.postsRepository
      .createQueryBuilder('post')
      .where('post.blogId = :blogId', { blogId })
      .getCount();

    const pagesCount = Math.ceil(totalCount / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allPosts,
    };
  }
}
