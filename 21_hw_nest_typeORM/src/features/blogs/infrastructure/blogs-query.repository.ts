import { Injectable } from '@nestjs/common';
import {
  BlogOutputModelType,
  PaginationBlogsType,
} from '../api/models/output/blog.output.model';
import { paginationBlogsOutModelType } from '../../../base/helpers/pagination-blogs-helper';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getAllBlogs(
    pagination: paginationBlogsOutModelType,
  ): Promise<PaginationBlogsType> {
    const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';

    const blogs = await this.dataSource.query(
      `SELECT "id", "name", "description", "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
WHERE "name" ILIKE $1
ORDER BY ${sortBy} ${sortDirection}
LIMIT $2 OFFSET $3`,
      [`%${pagination.searchNameTerm}%`, pagination.pageSize, pagination.skip],
    );

    const allBlogs = blogs.map((b) => {
      return {
        id: b.id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      };
    });

    const totalCount = await this.dataSource.query(
      `SELECT CAST(count(*) as INTEGER)
FROM public."Blogs"
WHERE "name" ILIKE $1`,
      [`%${pagination.searchNameTerm}%`],
    );

    const formatTotalCount = totalCount[0].count;

    const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);
    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: formatTotalCount,
      items: allBlogs,
    };
  }

  async getBlogById(blogId: string): Promise<BlogOutputModelType | null> {
    const blog = await this.dataSource.query(
      `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
FROM public."Blogs"
      WHERE "id"=CAST($1 as INTEGER)`,
      [blogId],
    );
    const blogMapped = blog.map((b) => {
      return {
        id: b.id.toString(),
        name: b.name,
        description: b.description,
        websiteUrl: b.websiteUrl,
        createdAt: b.createdAt,
        isMembership: b.isMembership,
      };
    });
    return blogMapped[0];
  }
}
