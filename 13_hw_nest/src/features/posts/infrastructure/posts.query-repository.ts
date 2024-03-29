import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from '../domain/posts.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

import { PaginationPostsOutputModelType } from 'src/base/pagination-posts-helpers';
import {
  PaginationPostsType,
  PostOutputModelType,
} from '../api/models/output/post.output.model';

@Injectable()
export class PostsQueryRepository {
  constructor(@InjectModel(Posts.name) private PostsModel: Model<Posts>) {}
  async getAllPosts(
    pagination: PaginationPostsOutputModelType,
  ): Promise<PaginationPostsType> {
    const posts = await this.PostsModel.find()
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allPosts = posts.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      shortDescription: p.shortDescription,
      content: p.content,
      blogId: p.blogId,
      blogName: p.blogName,
      createdAt: p.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          {
            addedAt: '2024-03-29T00:09:59.478Z',
            userId: 'string',
            login: 'string',
          },
        ],
      },
    }));
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
  async getPostById(postId: string): Promise<PostOutputModelType | null> {
    const post = await this.PostsModel.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      return null;
    }
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
        newestLikes: [
          {
            addedAt: '2024-03-29T00:09:59.478Z',
            userId: 'string',
            login: 'string',
          },
        ],
      },
    };
  }
}
