import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { PaginationWithItems } from '../../common/types/output';
import { QueryPagination } from '../../common/utils/queryPagination';
import { BlogSortData } from '../types/input';
import { OutputBlogType } from '../types/output';
import { Blog, BlogsDocument } from './blogs-schema';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogsDocument>,
  ) {}

  async findAll(sortData: BlogSortData): Promise<PaginationWithItems<OutputBlogType>> {
    const formattedSortData = QueryPagination.convertQueryPination(sortData);

    const filter: FilterQuery<Blog> = { name: { $regex: formattedSortData.searchNameTerm ?? '', $options: 'i' } };
    const sortFilter: FilterQuery<Blog> = { [formattedSortData.sortBy]: formattedSortData.sortDirection };

    const allBlogs: BlogsDocument[] = await this.BlogModel.find(filter)
      .sort(sortFilter)
      .skip((+formattedSortData.pageNumber - 1) * +formattedSortData.pageSize)
      .limit(+formattedSortData.pageSize);

    const allDtoBlogs: OutputBlogType[] = allBlogs.map((blog: BlogsDocument) => blog.toDto());

    const totalCount: number = await this.BlogModel.countDocuments(filter);

    return new PaginationWithItems(+formattedSortData.pageNumber, +formattedSortData.pageSize, totalCount, allDtoBlogs);
  }

  async findById(id: string): Promise<OutputBlogType | null> {
    const targetBlog: BlogsDocument | null = await this.BlogModel.findById(id);
    if (!targetBlog) return null;
    return targetBlog.toDto();
  }
}
