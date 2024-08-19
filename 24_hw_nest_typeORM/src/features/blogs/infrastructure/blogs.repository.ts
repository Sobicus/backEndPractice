import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { BlogUpdetedModelType } from '../api/models/input/create-blog.input.model';
import { UpdateBlogCommand } from '../application/command/updateBlog.command';
import { Blogs } from '../domain/blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs) protected blogsRepository: Repository<Blogs>,
  ) {}

  async getBlogByBlogId(blogId: number): Promise<Blogs | null> {
    return await this.blogsRepository.findOne({ where: { id: blogId } });
    //     const blog = await this.dataSource.query(
    //       `SELECT *
    // FROM public."Blogs"
    // WHERE "id" = CAST($1 as INTEGER)`,
    //       [blogId],
    //     );
    //     return blog[0];
  }

  async updateBlog(inputModel: BlogUpdetedModelType): Promise<void> {
    await this.blogsRepository.update(inputModel.id, {
      name: inputModel.name,
      description: inputModel.description,
      websiteUrl: inputModel.websiteUrl,
    });

    //     await this.dataSource.query(
    //       `UPDATE public."Blogs"
    // SET "name"=$1, "description"=$2, "websiteUrl"=$3
    // WHERE "id"=CAST($4 as INTEGER)`,
    //       [
    //         inputModel.inputModel.name,
    //         inputModel.inputModel.description,
    //         inputModel.inputModel.websiteUrl,
    //         inputModel.blogId,
    //       ],
    //     );
  }

  async deleteBlog(blogId: string) {
    await this.blogsRepository.delete(blogId);
    //     await this.dataSource.query(
    //       `DELETE FROM public."Blogs"
    // WHERE "id"=CAST($1 as INTEGER)`,
    //       [blogId],
    //     );
  }
  async createBlog(blogDTO: Blogs): Promise<number> {
    const blog = await this.blogsRepository.save(blogDTO);
    return blog.id;
    //     const blogId = await this.dataSource.query(
    //       `INSERT INTO public."Blogs"(
    // "name", "description", "websiteUrl", "createdAt", "isMembership")
    // VALUES ($1,$2,$3,$4,$5)
    // RETURNING "id"`,
    //       [
    //         blog.name,
    //         blog.description,
    //         blog.websiteUrl,
    //         blog.createdAt,
    //         blog.isMembership,
    //       ],
    //     );
    //     return blogId[0].id;
  }

  async deleteAll() {
    await this.dataSource.query(`DELETE FROM public."Blogs"`);
  }
}
