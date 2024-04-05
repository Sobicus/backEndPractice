/* eslint-disable no-underscore-dangle */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogsDocument } from './blogs-schema';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogsDocument>,
  ) {}

  /**
   * @param blog - новый блог
   * @returns id созданного блога
   */
  async addBlog(blog: Blog): Promise<string> {
    const newBlogToDb = new this.BlogModel(blog);
    await newBlogToDb.save();
    return newBlogToDb._id;
  }

  /**
   * @param blogId
   * @returns true, false
   */
  async deleteBlog(blogId: string): Promise<boolean> {
    const deleteResult = await this.BlogModel.findByIdAndDelete(blogId);
    return !!deleteResult;
  }
  /**
   * @param blogId
   * @returns BlogsDocument (smart object) | null
   */
  async getBlogById(blogId: string): Promise<BlogsDocument | null> {
    return this.BlogModel.findById(blogId);
  }
  /**
   * save blog to repo
   * @param blog : BlogsDocument
   * @returns void
   */
  async saveBlog(blog: BlogsDocument): Promise<void> {
    await blog.save();
  }
}
