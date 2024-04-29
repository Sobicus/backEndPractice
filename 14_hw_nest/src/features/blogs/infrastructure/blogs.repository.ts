import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs, BlogsDocument } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class BlogsRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: Model<Blogs>) {}

  async getBlogByBlogId(blogId: string): Promise<BlogsDocument | null> {
    return this.BlogsModel.findOne({ _id: new Types.ObjectId(blogId) });
  }

  async createBlogs(createBlogsDto: CreateBlogDto): Promise<string> {
    const createdBlog = new this.BlogsModel(createBlogsDto);
    const blog = await createdBlog.save();
    return blog._id.toString();
  }

  async updateBlog(blog: BlogsDocument) {
    // await this.saveBlog(blog);
    return await blog.save();
  }

  async deleteBlog(blogId: string) {
    await this.BlogsModel.deleteOne({
      _id: new Types.ObjectId(blogId),
    });
  }
  async saveBlog(blog: BlogsDocument) {
    //return await blog.save();
    const blogModel = new this.BlogsModel(blog);
    return await blogModel.save();
  }
  async deleteAll() {
    await this.BlogsModel.deleteMany();
  }
}

type CreateBlogDto = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};
