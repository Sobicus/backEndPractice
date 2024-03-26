import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { InputBlogModelType } from '../api/blogs.controller';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: Model<Blogs>) {}

  async createBlogs(createBlogsDto: CreateBlogDto): Promise<string> {
    const createdBlog = new this.BlogsModel(createBlogsDto);
    const blog = await createdBlog.save();
    return blog._id.toString();
  }

  async updateBlog(blogId: string, inputModel: InputBlogModelType) {
    const updateResult = await this.BlogsModel.updateOne(
      { _id: blogId },
      { $set: inputModel },
    );
    return updateResult.matchedCount == 1;
  }

  async deleteBlog() {}
}

type CreateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
