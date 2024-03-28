import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogInputModelType } from '../api/models/input/create-blog.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository) {}

  async createBlog(InputBlogModel: BlogInputModelType): Promise<string> {
    const createdAt = new Date().toISOString();
    const isMembership = false;
    return await this.blogRepository.createBlogs({
      ...InputBlogModel,
      createdAt,
      isMembership,
    });
  }
  async updateBlog(
    blogId: string,
    inputModel: BlogInputModelType,
  ): Promise<ObjectClassResult> {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        errorMessages: 'Blog has not found',
        data: null,
      };
    }
    blog.update(inputModel);
    await this.blogRepository.updateBlog(blog);
    return {
      status: statusType.Success,
      errorMessages: 'Blog has been update',
      data: null,
    };
  }
  async deleteBlog(blogId: string) {
    const blog = await this.blogRepository.getBlog(blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        errorMessages: 'Blog has not found',
        data: null,
      };
    }
    await this.blogRepository.deleteBlog(blogId);
    return {
      status: statusType.Success,
      errorMessages: 'Blog has been delete',
      data: null,
    };
  }
}
