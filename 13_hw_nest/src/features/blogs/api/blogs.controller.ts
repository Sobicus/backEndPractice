import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { BlogsService } from '../aplication/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/blogs.query-repository';
import { ObjectId } from 'mongodb';

export class InputBlogModelType {
  name: string;
  description: string;
  websiteUrl: string;
}

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogService: BlogsService,
    private blogQueryRepository: BlogsQueryRepository,
  ) {}

  @Get()
  getAllBlogs() {
    return this.blogQueryRepository.getAllBlogs();
  }

  @Get(':id')
  getAllBlog(@Param('id') userId: string) {
    if (!ObjectId.isValid(userId)) {
      return 'objectId is not valid';
    }
    return this.blogQueryRepository.getBlogById(userId);
  }

  @Post()
  async createBlog(@Body() inputModel: InputBlogModelType) {
    const newBlogId = await this.blogService.createBlog(inputModel);
    return this.blogQueryRepository.getBlogById(newBlogId);
  }

  @Put()
  updateBlogs(@Body() inputModel: InputBlogModelType) {
    return this.blogService.updateBlog(blogId);
  }
}

// type BlogsQueryType = {
//   searchNameTerm: string;
//   sortBy: string;
//   sortDirection: InputDescription;
//   pageNumber: number;
//   pageSize: number;
// };

// enum InputDescription {
//   asc = 'asc',
//   desc = 'desc',
// }
