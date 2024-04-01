import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
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
  blogsPagination,
  paginationBlogsInputModelType,
} from '../../../base/pagination-blogs-helper';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/posts.query-repository';
import {
  PaginationPostsInputModelType,
  postPagination,
} from '../../../base/pagination-posts-helpers';
import { PostInputModelBlogControllerType } from '../../posts/api/models/input/create-post.input.model';

@Controller('blogs')
export class BlogsController {
  constructor(
    private blogsService: BlogsService,
    private blogsQueryRepository: BlogsQueryRepository,
    private postService: PostsService,
    private postQueryRepository: PostsQueryRepository,
  ) {}

  @Get()
  async getAllBlogs(@Query() pagination: paginationBlogsInputModelType) {
    const query = blogsPagination(pagination);
    return await this.blogsQueryRepository.getAllBlogs(query);
  }

  @Get(':id')
  //@HttpCode(201)
  async getBlogById(@Param('id') userId: string) {
    const res = await this.blogsQueryRepository.getBlogById(userId);
    if (!res) {
      throw new NotFoundException();
    }
    return res;
  }

  @Post()
  async createBlog(@Body() inputModel: BlogInputModelType) {
    const newBlogId = await this.blogsService.createBlog(inputModel);
    return this.blogsQueryRepository.getBlogById(newBlogId);
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() inputModel: BlogInputModelType,
  ) {
    const res = await this.blogsService.updateBlog(blogId, inputModel);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') blogId: string) {
    const res = await this.blogsService.deleteBlog(blogId);
    if (res.status === 'NotFound') {
      throw new NotFoundException();
    }
  }
  @Get(':id/posts')
  async getPostsByBlogId(
    @Param('id') blogId: string,
    @Query() query: PaginationPostsInputModelType,
  ) {
    const res = await this.blogsService.getBlogById(blogId);
    if (!res) {
      throw new NotFoundException();
    }
    const pagination = postPagination(query);
    return this.postQueryRepository.getPostByBlogId(blogId, pagination);
  }
  @Post(':id/posts')
  async createPostByBlogId(
    @Param('id') blogId: string,
    @Body() inputModel: PostInputModelBlogControllerType,
  ) {
    const post = await this.postService.createPost({ ...inputModel, blogId });
    if (post.status === 'NotFound') {
      throw new NotFoundException();
    }
    return await this.postQueryRepository.getPostById(post.data as string);
  }
}
