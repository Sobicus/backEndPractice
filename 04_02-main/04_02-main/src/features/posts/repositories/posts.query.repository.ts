import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Blog } from '../../blogs/repositories/blogs-schema';
import { PaginationWithItems } from '../../common/types/output';
import { QueryPagination } from '../../common/utils/queryPagination';
import { PostSortData } from '../types/input';
import { OutputPostType } from '../types/output';
import { Post, PostsDocument } from './post-schema';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostsDocument>,
  ) {}

  async getAll(sortData: PostSortData): Promise<PaginationWithItems<OutputPostType>> {
    const formattedSortData = QueryPagination.convertQueryPination(sortData);
    const sortFilter: FilterQuery<Blog> = { [formattedSortData.sortBy]: formattedSortData.sortDirection };

    const allPosts: PostsDocument[] = await this.PostModel.find()
      .sort(sortFilter)
      .skip((+formattedSortData.pageNumber - 1) * +formattedSortData.pageSize)
      .limit(+formattedSortData.pageSize);

    const allDtoPosts: OutputPostType[] = allPosts.map((post: PostsDocument) => post.toDto());
    const totalCount: number = await this.PostModel.countDocuments();
    return new PaginationWithItems(+formattedSortData.pageNumber, +formattedSortData.pageSize, totalCount, allDtoPosts);
  }

  async findById(postId: string): Promise<OutputPostType | null> {
    const targetPost: PostsDocument | null = await this.PostModel.findById(postId);
    if (!targetPost) return null;
    return targetPost.toDto();
  }

  async findByBlogId(blogId: string, sortData: PostSortData): Promise<PaginationWithItems<OutputPostType>> {
    const formattedSortData = QueryPagination.convertQueryPination(sortData);

    const sortFilter: FilterQuery<Blog> = { [formattedSortData.sortBy]: formattedSortData.sortDirection };

    const targetPosts: PostsDocument[] | null = await this.PostModel.find({ blogId: blogId })
      .sort(sortFilter)
      .skip((+formattedSortData.pageNumber - 1) * +formattedSortData.pageSize)
      .limit(+formattedSortData.pageSize);

    const allDtoPosts: OutputPostType[] = targetPosts.map((post: PostsDocument) => post.toDto());

    const totalCount: number = await this.PostModel.countDocuments({ blogId: blogId });

    return new PaginationWithItems(+formattedSortData.pageNumber, +formattedSortData.pageSize, totalCount, allDtoPosts);
  }
}
