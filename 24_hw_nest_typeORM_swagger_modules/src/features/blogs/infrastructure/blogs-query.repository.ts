import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, ILike, Repository } from 'typeorm';

import { paginationBlogsOutModelType } from '../../../base/helpers/pagination-blogs-helper';
import {
  BlogOutputModelType,
  PaginationBlogsType,
} from '../api/models/output/blog.output.model';
import { Blogs } from '../domain/blogs.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs) protected blogsRepository: Repository<Blogs>,
  ) {}

  async getAllBlogs(
    pagination: paginationBlogsOutModelType,
  ): Promise<PaginationBlogsType> {
    const sortBy = pagination.sortBy ?? 'createdAt';
    const sortDirection = pagination.sortDirection === 'asc' ? 'ASC' : 'DESC';

    const [blogs, total] = await this.blogsRepository.findAndCount({
      where: {
        name: ILike(`%${pagination.searchNameTerm}%`),
      },
      order: {
        [sortBy]: sortDirection,
      },
      take: pagination.pageSize,
      skip: pagination.skip,
    });

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

    const pagesCount = Math.ceil(total / pagination.pageSize);

    return {
      pagesCount: pagesCount,
      page: pagination.pageNumber,
      pageSize: pagination.pageSize,
      totalCount: total,
      items: allBlogs,
    };
    //     const sortBy = `"${pagination.sortBy}"` ?? '"createdAt"';
    //     const sortDirection = pagination.sortDirection === 'asc' ? 'asc' : 'desc';
    //
    //     const blogs = await this.dataSource.query(
    //       `SELECT "id", "name", "description", "websiteUrl", "createdAt", "isMembership"
    // FROM public."Blogs"
    // WHERE "name" ILIKE $1
    // ORDER BY ${sortBy} ${sortDirection}
    // LIMIT $2 OFFSET $3`,
    //       [`%${pagination.searchNameTerm}%`, pagination.pageSize, pagination.skip],
    //     );
    //
    //     const allBlogs = blogs.map((b) => {
    //       return {
    //         id: b.id.toString(),
    //         name: b.name,
    //         description: b.description,
    //         websiteUrl: b.websiteUrl,
    //         createdAt: b.createdAt,
    //         isMembership: b.isMembership,
    //       };
    //     });
    //
    //     const totalCount = await this.dataSource.query(
    //       `SELECT CAST(count(*) as INTEGER)
    // FROM public."Blogs"
    // WHERE "name" ILIKE $1`,
    //       [`%${pagination.searchNameTerm}%`],
    //     );
    //
    //     const formatTotalCount = totalCount[0].count;
    //
    //     const pagesCount = Math.ceil(formatTotalCount / pagination.pageSize);
    //     return {
    //       pagesCount: pagesCount,
    //       page: pagination.pageNumber,
    //       pageSize: pagination.pageSize,
    //       totalCount: formatTotalCount,
    //       items: allBlogs,
    //     };
  }

  async getBlogById(blogId: number): Promise<BlogOutputModelType | null> {
    const blog = await this.blogsRepository.findOneBy({ id: blogId });
    if (!blog) {
      return null;
    }
    return {
      id: blog.id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt,
      isMembership: blog.isMembership,
    };
    //     const blog = await this.dataSource.query(
    //       `SELECT id, name, description, "websiteUrl", "createdAt", "isMembership"
    // FROM public."Blogs"
    //       WHERE "id"=CAST($1 as INTEGER)`,
    //       [blogId],
    //     );
    //     const blogMapped = blog.map((b) => {
    //       return {
    //         id: b.id.toString(),
    //         name: b.name,
    //         description: b.description,
    //         websiteUrl: b.websiteUrl,
    //         createdAt: b.createdAt,
    //         isMembership: b.isMembership,
    //       };
    //     });
    //     return blogMapped[0];
  }
}
