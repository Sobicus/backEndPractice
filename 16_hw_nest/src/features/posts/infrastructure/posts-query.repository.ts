import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { PaginationPostsOutputModelType } from 'src/base/helpers/pagination-posts-helpers';
import {
  PaginationPostsType,
  PostOutputModelType,
} from '../api/models/output/post.output.model';
import { PostsLikesInfoRepository } from './posts-likesInfo.repository';
import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Posts.name) private PostsModel: Model<Posts>,
    private postsLikesInfoRepository: PostsLikesInfoRepository,
  ) {}

  async getAllPosts(
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType> {
    const posts = await this.PostsModel.find()
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allPosts = await Promise.all(
      posts.map(async (p) => {
        let myStatus = LikesStatusPosts.None;
        if (userId) {
          const reaction =
            await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
              p._id.toString(),
              userId,
            );
          myStatus = reaction ? reaction.myStatus : myStatus;
        }
        const likesCount = await this.postsLikesInfoRepository.countDocuments(
          p._id.toString(),
          LikesStatusPosts.Like,
        );
        const dislikesCount =
          await this.postsLikesInfoRepository.countDocuments(
            p._id.toString(),
            LikesStatusPosts.Dislike,
          );
        const newestLikes =
          await this.postsLikesInfoRepository.findLastThreeLikes(
            p._id.toString(),
            LikesStatusPosts.Like,
          );
        const newestLikesViewModel = newestLikes.map((like) => {
          return {
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login,
          };
        });
        return {
          id: p._id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
            newestLikes: newestLikesViewModel,
          },
        };
      }),
    );
    const totalCount = await this.PostsModel.countDocuments();
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
    postId: string,
    userId?: string | null,
  ): Promise<PostOutputModelType | null> {
    const post = await this.PostsModel.findOne({
      _id: new Types.ObjectId(postId),
    });
    if (!post) {
      return null;
    }
    console.log('getPostById post ', post);
    console.log('userId', userId);
    let myStatus = LikesStatusPosts.None;
    if (userId) {
      const reaction =
        await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
          postId,
          userId,
        );
      console.log('reaction ', reaction);
      myStatus = reaction ? reaction.myStatus : myStatus;
    }
    const likesCount = await this.postsLikesInfoRepository.countDocuments(
      postId,
      LikesStatusPosts.Like,
    );
    const dislikesCount = await this.postsLikesInfoRepository.countDocuments(
      postId,
      LikesStatusPosts.Dislike,
    );
    const newestLikes = await this.postsLikesInfoRepository.findLastThreeLikes(
      postId,
      LikesStatusPosts.Like,
    );
    console.log('newestLikes ', newestLikes);
    const newestLikesViewModel = newestLikes.map((like) => {
      return {
        addedAt: like.createdAt,
        userId: like.userId,
        login: like.login,
      };
    });
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: likesCount,
        dislikesCount: dislikesCount,
        myStatus: myStatus,
        newestLikes: newestLikesViewModel,
      },
    };
  }

  async getPostByBlogId(
    blogId: string,
    pagination: PaginationPostsOutputModelType,
    userId?: string,
  ): Promise<PaginationPostsType | null> {
    const posts = await this.PostsModel.find({ blogId: blogId })
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allPosts = await Promise.all(
      posts.map(async (p) => {
        let myStatus = LikesStatusPosts.None;
        if (userId) {
          const reaction =
            await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
              p._id.toString(),
              userId,
            );
          myStatus = reaction ? reaction.myStatus : myStatus;
        }
        const likesCount = await this.postsLikesInfoRepository.countDocuments(
          p._id.toString(),
          LikesStatusPosts.Like,
        );
        const dislikesCount =
          await this.postsLikesInfoRepository.countDocuments(
            p._id.toString(),
            LikesStatusPosts.Dislike,
          );
        const newestLikes =
          await this.postsLikesInfoRepository.findLastThreeLikes(
            p._id.toString(),
            LikesStatusPosts.Like,
          );
        const newestLikesViewModel = newestLikes.map((like) => {
          return {
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login,
          };
        });
        return {
          id: p._id.toString(),
          title: p.title,
          shortDescription: p.shortDescription,
          content: p.content,
          blogId: p.blogId,
          blogName: p.blogName,
          createdAt: p.createdAt,
          extendedLikesInfo: {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus,
            newestLikes: newestLikesViewModel,
          },
        };
      }),
    );
    const totalCount = await this.PostsModel.countDocuments({ blogId: blogId });
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
