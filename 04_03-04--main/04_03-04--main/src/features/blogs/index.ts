import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsService } from './services/blogs.service';
import { GetPostForBlogUseCase } from './services/useCase/get-posts-for-blog.useCase';

export const blogsProviders = [BlogsService, BlogsRepository, BlogsQueryRepository];
export const blogsUseCases = [GetPostForBlogUseCase];
