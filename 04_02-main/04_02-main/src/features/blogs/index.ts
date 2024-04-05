import { BlogsQueryRepository } from './repositories/blogs.query.repository';
import { BlogsRepository } from './repositories/blogs.repository';
import { BlogsService } from './services/blogs.service';

export const blogsProviders = [BlogsService, BlogsRepository, BlogsQueryRepository];
