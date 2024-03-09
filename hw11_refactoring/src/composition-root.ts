import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsQueryRepository} from "./repositories/blogs-queryRepository";
import {BlogsService} from "./domain/blogs-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsQueryRepository} from "./repositories/posts-queryRepository";
import {PostsService} from "./domain/posts-service";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsQueryRepository} from "./repositories/comments-queryRepository";
import {CommentsService} from "./domain/comments-service";
import {LikesCommentsRepository} from "./repositories/likes-commets-repository";
import {LikeCommentsService} from "./domain/like-comments-service";
import {UsersRepository} from "./repositories/users-repository";
import {UsersQueryRepository} from "./repositories/users-queryRepository";
import {UsersService} from "./domain/user-service";
import {SessionsRepository} from "./repositories/sessions-repository";
import {SessionsService} from "./domain/session-service";
import {PasswordRecoveryRepository} from "./repositories/passwordRecovery-repository";
import {AuthService} from "./domain/auth-service";
import {RateLimitService} from "./domain/rate-limit-service";
import {RateLimitRepository} from "./repositories/rate-limit-repository";
import {JwtService} from "./application/jwt-service";

export const blogRepository = new BlogsRepository()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogService = new BlogsService(blogRepository)
export const postRepository = new PostsRepository()
export const postQueryRepository = new PostsQueryRepository()
export const postService = new PostsService(postRepository)
export const commentRepository = new CommentsRepository()
export const commentQueryRepository = new CommentsQueryRepository()
export const commentService = new CommentsService(commentRepository)
export const likesCommentsRepository = new LikesCommentsRepository()
export const likesCommentsService = new LikeCommentsService(likesCommentsRepository, commentRepository)
export const usersRepository = new UsersRepository()
export const usersQueryRepository = new UsersQueryRepository()
export const usersService = new UsersService(usersRepository)
export const sessionsRepository = new SessionsRepository()
export const sessionsService = new SessionsService(sessionsRepository)
export const passwordRecoveryRepository = new PasswordRecoveryRepository()
export const authService = new AuthService(usersService, passwordRecoveryRepository)
export const rateLimitRepository = new RateLimitRepository()
export const rateLimitService = new RateLimitService(rateLimitRepository)
export const jwtService = new JwtService()