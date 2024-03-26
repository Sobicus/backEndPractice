import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs.repository';
import { InputBlogModelType } from '../api/blogs.controller';

@Injectable()
export class BlogsService {
  constructor(private blogRepository: BlogsRepository) {}

  async createBlog(InputBlogModel: InputBlogModelType): Promise<string> {
    const createdAt = new Date().toISOString();
    const isMembership = true;
    return await this.blogRepository.createBlogs({
      ...InputBlogModel,
      createdAt,
      isMembership,
    });
  }
  async updateBlog(blogId: string, inputModel: InputBlogModelType) {
    return this.blogRepository.updateBlog(blogId, inputModel);
  }
}
