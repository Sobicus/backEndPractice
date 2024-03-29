import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogInputModelType } from './models/input/create-blog.input.model';
import {
  blogPagination,
  paginationBlogsInputModelType,
} from '../../../base/pagination-blogs-helper';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogPagination(pagination);
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  //@HttpCode(201)
  async getBlogById(@Param('id') userId: string) {
    const res = await this.blogsQueryRepository.getBlogById(userId);
    if (!res) {
      throw new NotFoundException();
    }
  }

  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.blogsService.createBlog(inputModel);
    return this.blogsQueryRepository.getBlogById(newBlogId);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputModel: BlogInputModelType,
  ) {
    const res = await this.blogsService.updateBlog(blogId, inputModel);
    return res.statusMessages;
  }
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    return await this.blogsService.deleteBlog(blogId);
  }
}
