import { PostsQueryRepository } from './repositories/posts.query.repository';
import { PostsRepository } from './repositories/posts.repository';
import { PostService } from './services/postService';

export const postProviders = [PostsRepository, PostsQueryRepository, PostService];
