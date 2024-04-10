import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blogs } from '../domain/blogs.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  BlogOutputModelType,
  PaginationBlogsType,
} from '../api/models/output/blog.output.model';
import { paginationBlogsOutModelType } from '../../../base/helpers/pagination-blogs-helper';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(Blogs.name) private BlogsModel: Model<Blogs>) {}

  async getAllBlogs(
    pagination: paginationBlogsOutModelType,
  ): Promise<PaginationBlogsType> {
    const filter = {
      name: { $regex: pagination.searchNameTerm, $options: 'i' },
    };
    const blogs = await this.BlogsModel.find(filter)
      .sort({ [pagination.sortBy]: pagination.sortDirection })
      .limit(pagination.pageSize)
      .skip(pagination.skip)
      .lean();
    const allBlogs = blogs.map((b) => {
      return {
        id: b._id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      };
    });
    const totalCount = await this.BlogsModel.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: totalCount,
      items: allBlogs,
    };
  }

  async getBlogById(blogId: string): Promise<BlogOutputModelType | null> {
    const blog = await this.BlogsModel.findOne({ _id: new ObjectId(blogId) });
    if (!blog) {
      return null;
    }
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
  }
}
