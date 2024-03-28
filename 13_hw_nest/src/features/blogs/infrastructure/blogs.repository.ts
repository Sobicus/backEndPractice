import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: Model<Blogs>) {}

  async getBlog(blogId: string): Promise<BlogsDocument | null> {
    return this.BlogsModel.findOne({ _id: new ObjectId(blogId) });
  }

  async createBlogs(createBlogsDto: CreateBlogDto): Promise<string> {
    const createdBlog = new this.BlogsModel(createBlogsDto);
    const blog = await createdBlog.save();
    return blog._id.toString();
  }

  async updateBlog(blog: BlogsDocument) {
    await this.saveBlog(blog);
  }

  async deleteBlog(blogId: string) {
    await this.BlogsModel.deleteOne({
      _id: new ObjectId(blogId),
    });
  }
  private async saveBlog(blog: BlogsDocument) {
    await blog.save();
  }
}

type CreateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
