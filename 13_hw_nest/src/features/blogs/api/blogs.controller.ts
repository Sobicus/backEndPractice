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
import { BlogsService } from '../aplication/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { BlogInputModelType } from './models/input/create-blog.input.model';
import {
  blogPagination,
  paginationBlogInputModelType,
} from '../../../base/pagination-blogs-helper';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  getAllBlogs(@Query() pagination: paginationBlogInputModelType) {
    const query = blogPagination(pagination);
    return this.blogQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  //@HttpCode(201)
  async getAllBlog(@Param('id') userId: string) {
    const res = await this.blogQueryRepository.getBlogById(userId);
    if (!res) {
      throw new NotFoundException();
    }
  }

  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.blogService.createBlog(inputModel);
    return this.blogQueryRepository.getBlogById(newBlogId);
  }

  @Put(':id')
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputModel: BlogInputModelType,
  ) {
    const res = await this.blogService.updateBlog(blogId, inputModel);
    return res.errorMessages;
  }
  @Delete(':id')
  async deleteBlog(@Param('id') blogId: string) {
    return await this.blogService.deleteBlog(blogId);
  }
}
