import { Injectable } from '@nestjs/common';
import { BlogsDocument } from '../domain/blogs.entity';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UpdateBlogCommand } from '../application/command/updateBlog.command';

@Injectable()
export class BlogsRepositorySQL {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async getBlogByBlogId(blogId: string) {
    const blog = await this.dataSource.query(
      `SELECT *
FROM public."Blogs"
WHERE "id" = CAST($1 as INTEGER)`,
      [blogId],
    );
    return blog[0];
  }

  async updateBlog(inputModel: UpdateBlogCommand): Promise<void> {
    await this.dataSource.query(
      `UPDATE public."Blogs"
SET "name"=$1, "description"=$2, "websiteUrl"=$3
WHERE "id"=CAST($4 as INTEGER)`,
      [
        inputModel.inputModel.name,
        inputModel.inputModel.description,
        inputModel.inputModel.websiteUrl,
        inputModel.blogId,
      ],
    );
  }

  async deleteBlog(blogId: string) {
    await this.dataSource.query(
      `DELETE FROM public."Blogs"
WHERE "id"=CAST($1 as INTEGER)`,
      [blogId],
    );
  }
  async createBlog(blog: BlogsDocument) {
    const blogId = await this.dataSource.query(
      `INSERT INTO public."Blogs"(
"name", "description", "websiteUrl", "createdAt", "isMembership")
VALUES ($1,$2,$3,$4,$5)
RETURNING "id"`,
      [
        blog.name,
        blog.description,
        blog.websiteUrl,
        blog.createdAt,
        blog.isMembership,
      ],
    );
    return blogId[0].id;
  }

  // async deleteAll() {
  //   await this.BlogsModel.deleteMany();
  // }
}
