import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { QueryPaginationResult } from '../../../../infrastructure/types/query-sort.type';
import { Blog } from '../../../blogs/repositories/blogs-schema';
import { LikeStatusType } from '../../../comments/types/comments/input';
import { PaginationWithItems } from '../../../common/types/output';
import { PostUpdateType } from '../../types/input';
import { Post, PostsDocument } from './post.schema';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectModel(Post.name)
    private PostModel: Model<PostsDocument>,
  ) {}
  async getAll(sortData: QueryPaginationResult): Promise<PaginationWithItems<PostsDocument>> {
    const sortFilter: FilterQuery<Blog> = { [sortData.sortBy]: sortData.sortDirection };

    const posts: PostsDocument[] = await this.PostModel.find()
      .sort(sortFilter)
      .skip((+sortData.pageNumber - 1) * +sortData.pageSize)
      .limit(+sortData.pageSize);

    //const dtoPosts: OutputPostType[] = posts.map((post: PostsDocument) => post.toDto());
    const totalCount: number = await this.PostModel.countDocuments();
    return new PaginationWithItems(+sortData.pageNumber, +sortData.pageSize, totalCount, posts);
  }
  async findByBlogId(blogId: string, sortData: QueryPaginationResult): Promise<PaginationWithItems<PostsDocument>> {
    const sortFilter: FilterQuery<Blog> = { [sortData.sortBy]: sortData.sortDirection };

    const targetPosts: PostsDocument[] | null = await this.PostModel.find({ blogId })
      .sort(sortFilter)
      .skip((+sortData.pageNumber - 1) * +sortData.pageSize)
      .limit(+sortData.pageSize);

    const totalCount: number = await this.PostModel.countDocuments({ blogId });

    return new PaginationWithItems(+sortData.pageNumber, +sortData.pageSize, totalCount, targetPosts);
  }
  /**
   * Create new post
   * @param newPost - Пост
   * @returns ID созданного поста
   */
  async addPost(newPost: Post): Promise<PostsDocument> {
    const newPostToDB: PostsDocument = new this.PostModel(newPost);
    await this.savePost(newPostToDB);
    return newPostToDB;
  }
  async postIsExist(postId: string): Promise<boolean> {
    const post = await this.PostModel.findById(postId);
    return !!post;
  }
  /**
   * @param params
   * @param id - post id
   * @returns true,false
   */
  async updateBlog(params: PostUpdateType, id: string): Promise<boolean> {
    const updateResult = await this.PostModel.findByIdAndUpdate(id, params);
    return !!updateResult;
  }
  /**
   * delete current post
   * @param postId
   * @returns true, false
   */
  async deleteBlog(postId: string): Promise<boolean> {
    const deleteResult = await this.PostModel.findByIdAndDelete(postId);
    return !!deleteResult;
  }
  async savePost(post: PostsDocument): Promise<void> {
    await post.save();
  }
  async getPostbyId(postId: string): Promise<PostsDocument | null> {
    return this.PostModel.findById(postId);
  }

  async updateLikesCount(
    postId: string,
    operation: 'increment' | 'decrement',
    likeStatus: LikeStatusType,
  ): Promise<void> {
    const updateField = likeStatus === 'Like' ? 'likesCount' : 'dislikesCount';
    const updateValue = operation === 'increment' ? 1 : -1;

    // Если нужно обновить оба поля (switch), вызовите эту функцию дважды с разными полями
    await this.PostModel.findByIdAndUpdate(
      postId,
      { $inc: { [`extendedLikesInfo.${updateField}`]: updateValue } },
      { new: true },
    );
  }
}
