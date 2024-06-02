import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import { PostInputModelType } from '../api/models/input/create-post.input.model';

@Injectable()
export class PostsService {
  constructor(
    private postRepository: PostsRepository,
    private blogRepository: BlogsRepository,
  ) {}

  // async createPost(
  //   post: PostInputModelType,
  // ): Promise<ObjectClassResult<string | null>> {
  //   const blog = await this.blogRepository.getBlogByBlogId(post.blogId);
  //   if (!blog) {
  //     return {
  //       status: statusType.NotFound,
  //       statusMessages: 'Blog has not found',
  //       data: null,
  //     };
  //   }
  //   const createdAt = new Date().toISOString();
  //   const postId = await this.postRepository.createPost({
  //     ...post,
  //     blogName: blog.name,
  //     createdAt,
  //   });
  //   return {
  //     status: statusType.Created,
  //     statusMessages: 'Post has been created',
  //     data: postId,
  //   };
  // }

  // async updatePost(
  //   postId: string,
  //   postDTO: PostInputModelType,
  // ): Promise<ObjectClassResult> {
  //   const post = await this.postRepository.getPostByPostId(postId);
  //   if (!post) {
  //     return {
  //       status: statusType.NotFound,
  //       statusMessages: 'Post has been not found',
  //       data: null,
  //     };
  //   }
  //   post.update(postDTO);
  //   await this.postRepository.updatePost(post);
  //   return {
  //     status: statusType.Success,
  //     statusMessages: 'Post has been update',
  //     data: null,
  //   };
  // }

  // async deletePost(postId: string): Promise<ObjectClassResult> {
  //   const post = await this.postRepository.getPostByPostId(postId);
  //   if (!post) {
  //     return {
  //       status: statusType.NotFound,
  //       statusMessages: 'Post has been not found',
  //       data: null,
  //     };
  //   }
  //   await this.postRepository.deletePost(postId);
  //   return {
  //     status: statusType.Success,
  //     statusMessages: 'Post has been delete',
  //     data: null,
  //   };
  // }
}
