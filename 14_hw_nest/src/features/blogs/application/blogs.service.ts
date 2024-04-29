import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { BlogInputModelType } from '../api/models/input/create-blog.input.model';
import { ObjectClassResult, statusType } from '../../../base/oject-result';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository) {}
  async getBlogById(blogId: string): Promise<BlogsDocument | null> {
    return await this.blogRepository.getBlogByBlogId(blogId);
  }
  async createBlog(inputBlogModel: BlogInputModelType): Promise<string> {
    // const createdAt = new Date().toISOString();
    // const isMembership = false;
    // return await this.blogRepository.createBlogs({
    //   ...InputBlogModel,
    //   createdAt,
    //   isMembership,
    // });
    console.log(inputBlogModel);
    const blog = Blogs.create(inputBlogModel);
    console.log(blog);
    const createdBlog = await this.blogRepository.saveBlog(blog);
    console.log(createdBlog);
    return createdBlog._id.toString();
  }
  async updateBlog(
    blogId: string,
    inputModel: BlogInputModelType,
  ): Promise<ObjectClassResult> {
    const blog = await this.blogRepository.getBlogByBlogId(blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    blog.update(inputModel);
    await this.blogRepository.updateBlog(blog);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been update',
      data: null,
    };
  }
  async deleteBlog(blogId: string): Promise<ObjectClassResult> {
    const blog = await this.blogRepository.getBlogByBlogId(blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    await this.blogRepository.deleteBlog(blogId);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been delete',
      data: null,
    };
  }
}
