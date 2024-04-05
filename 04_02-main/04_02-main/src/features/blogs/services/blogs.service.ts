import { Injectable } from '@nestjs/common';

import { BlogsRepository } from '../repositories/blogs.repository';
import { Blog, BlogsDocument } from '../repositories/blogs-schema';
import { BlogCreateModel, BlogUpdateType } from '../types/input';
import { OutputBlogType } from '../types/output';
@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}

  async createBlog(blogData: BlogCreateModel): Promise<OutputBlogType> {
    const newBlog = new Blog(blogData.name, blogData.description, blogData.websiteUrl);

    await this.blogsRepository.addBlog(newBlog);
    return newBlog.toDto();
  }

  async updateBlog(newData: BlogUpdateType, blogId: string): Promise<boolean | null> {
    const targetBlog: BlogsDocument | null = await this.blogsRepository.getBlogById(blogId);
    if (!targetBlog) return null;
    targetBlog.updateBlog(newData);
    await this.blogsRepository.saveBlog(targetBlog);
    return true;
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(blogId);
  }
}
