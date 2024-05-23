import { Injectable } from '@nestjs/common';

import { BlogsQueryRepository } from '../../blogs/repositories/blogs.query.repository';
import { OutputBlogType } from '../../blogs/types/output';
import { Post, PostsDocument } from '../repositories/post/post.schema';
import { PostsRepository } from '../repositories/post/posts.repository';
import { PostCreateModel, PostUpdateType } from '../types/input';
import { OutputPostType } from '../types/output';

@Injectable()
export class PostService {
  constructor(
    protected postRepository: PostsRepository,
    protected blogsQueryRepository: BlogsQueryRepository,
  ) {}
  async createPost(postData: PostCreateModel): Promise<OutputPostType | null> {
    const targetBlog: OutputBlogType | null = await this.blogsQueryRepository.findById(postData.blogId);

    if (!targetBlog) return null;

    const newPost = new Post(
      postData.title,
      postData.shortDescription,
      postData.content,
      postData.blogId,
      targetBlog!.name,
    );

    const createdPostInDb: PostsDocument = await this.postRepository.addPost(newPost);
    return createdPostInDb.toDto();
  }

  async updatePost(params: PostUpdateType, postId: string): Promise<boolean | null> {
    const targetPost: PostsDocument | null = await this.postRepository.getPostbyId(postId);
    if (!targetPost) return null;

    targetPost.updatePost(params);

    await this.postRepository.savePost(targetPost);
    return true;
  }
  async deleteBlog(blogId: string): Promise<boolean> {
    return this.postRepository.deleteBlog(blogId);
  }
}
