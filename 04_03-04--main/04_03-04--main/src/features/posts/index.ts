import { PostLikesQueryRepository } from './repositories/likes/post-likes.query.repository';
import { PostLikesRepository } from './repositories/likes/post-likes.repository';
import { PostsQueryRepository } from './repositories/post/posts.query.repository';
import { PostsRepository } from './repositories/post/posts.repository';
import { PostService } from './services/post.service';
import { AddLikeToPostUseCase } from './services/useCase/add-like.to.post.useSace';
import { GetAllPostsWithLikeStatusUseCase } from './services/useCase/get-all-post-with-likeStatus.useCase';
import { GetCommentsToPostWithLikeStatusUseCase } from './services/useCase/get-comments-to-post-with-like-status.useCase';
import { GetPostWithLikeStatusUseCase } from './services/useCase/get-post-with-like-status.useCase';

export const postProviders = [
  PostsRepository,
  PostsQueryRepository,
  PostService,
  PostLikesQueryRepository,
  PostLikesRepository,
];

export const postsUseCases = [
  GetPostWithLikeStatusUseCase,
  AddLikeToPostUseCase,
  GetAllPostsWithLikeStatusUseCase,
  GetCommentsToPostWithLikeStatusUseCase,
];
