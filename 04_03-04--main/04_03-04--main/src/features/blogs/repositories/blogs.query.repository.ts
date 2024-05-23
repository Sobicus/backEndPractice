import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../common/types/output';
import { OutputBlogType } from '../types/output';
import { Blog, BlogsDocument } from './blogs-schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogsDocument>,
  ) {}
  //todo подаставать переменные нормально
  async findAll(sortData: QueryPaginationResult): Promise<PaginationWithItems<OutputBlogType>> {
    const filter: FilterQuery<Blog> = { name: { $regex: sortData.searchNameTerm ?? '', $options: 'i' } };
    const sortFilter: FilterQuery<Blog> = { [sortData.sortBy]: sortData.sortDirection };

    const allBlogs: BlogsDocument[] = await this.BlogModel.find(filter)
      .sort(sortFilter)
      .skip((+sortData.pageNumber - 1) * +sortData.pageSize)
      .limit(+sortData.pageSize);

    const allDtoBlogs: OutputBlogType[] = allBlogs.map((blog: BlogsDocument) => blog.toDto());

    const totalCount: number = await this.BlogModel.countDocuments(filter);

    return new PaginationWithItems(+sortData.pageNumber, +sortData.pageSize, totalCount, allDtoBlogs);
  }

  async findById(id: string): Promise<OutputBlogType | null> {
    const targetBlog: BlogsDocument | null = await this.BlogModel.findById(id);
    if (!targetBlog) return null;
    return targetBlog.toDto();
  }
}
