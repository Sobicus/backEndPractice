import "reflect-metadata";
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
import {RateLimitService} from "./domain/rate-limit-service";
import {RateLimitRepository} from "./repositories/rate-limit-repository";
import {JwtService} from "./application/jwt-service";
import {LikesPostsRepository} from "./repositories/likes-posts-repository";
import {LikesPostsService} from "./domain/like-posts-service";
import {BlogsController} from "./routes/blogs-controller";
import {Container} from "inversify";
import {authController} from "./routes/auth-controller";
import {CommentsController} from "./routes/comments-controller";
import {PostsController} from "./routes/posts-controller";
import {securityDevicesController} from "./routes/securityDevices-controller";
import {UsersController} from "./routes/users-controller";
import {JwtTokensRepository} from "./repositories/jwt-tokens-repository";
import {JwtTokensService} from "./domain/jwt-tokens-service";
import {AuthService} from "./domain/auth-service";

//
// export const blogRepository = new BlogsRepository()
// export const blogsQueryRepository = new BlogsQueryRepository()
// export const blogService = new BlogsService(blogRepository)
// export const postRepository = new PostsRepository()
// export const postQueryRepository = new PostsQueryRepository()
// export const postService = new PostsService(postRepository)
// export const commentRepository = new CommentsRepository()
// export const commentQueryRepository = new CommentsQueryRepository()
// export const commentService = new CommentsService(commentRepository)
// export const likesCommentsRepository = new LikesCommentsRepository()
// export const likesCommentsService = new LikeCommentsService(likesCommentsRepository, commentRepository)
// export const usersRepository = new UsersRepository()
// export const usersQueryRepository = new UsersQueryRepository()
// export const usersService = new UsersService(usersRepository)
// export const sessionsRepository = new SessionsRepository()
// export const sessionsService = new SessionsService(sessionsRepository)
// export const passwordRecoveryRepository = new PasswordRecoveryRepository()
// export const authService = new AuthService(usersService, passwordRecoveryRepository)
// export const rateLimitRepository = new RateLimitRepository()
// export const rateLimitService = new RateLimitService(rateLimitRepository)
// export const jwtService = new JwtService()
// export const likesPostsRepository = new LikesPostsRepository()
// export const likesPostsService = new LikesPostsService(likesPostsRepository, postRepository)

/*
const objects: any = []
export const ioc = {
    getInstance<T>(ClassType: any) {
        const targetInstance = objects.find(o => o instanceof ClassType)
        return targetInstance as T
    }
}
*/


export const container = new Container()
container.bind<BlogsController>(BlogsController).to(BlogsController)
container.bind<BlogsQueryRepository>(BlogsQueryRepository).to(BlogsQueryRepository)
container.bind<BlogsService>(BlogsService).to(BlogsService)
container.bind<authController>(authController).to(authController)
container.bind<SessionsService>(SessionsService).to(SessionsService)
container.bind<CommentsController>(CommentsController).to(CommentsController)
container.bind<CommentsQueryRepository>(CommentsQueryRepository).to(CommentsQueryRepository)
container.bind<CommentsService>(CommentsService).to(CommentsService)
container.bind<LikeCommentsService>(LikeCommentsService).to(LikeCommentsService)
container.bind<PostsController>(PostsController).to(PostsController)
container.bind<PostsQueryRepository>(PostsQueryRepository).to(PostsQueryRepository)
container.bind<PostsService>(PostsService).to(PostsService)
container.bind<LikesPostsService>(LikesPostsService).to(LikesPostsService)
container.bind<securityDevicesController>(securityDevicesController).to(securityDevicesController)
container.bind<JwtService>(JwtService).to(JwtService)
container.bind<UsersController>(UsersController).to(UsersController)
container.bind<UsersQueryRepository>(UsersQueryRepository).to(UsersQueryRepository)
container.bind<UsersService>(UsersService).to(UsersService)
container.bind<BlogsRepository>(BlogsRepository).to(BlogsRepository)
container.bind<CommentsRepository>(CommentsRepository).to(CommentsRepository)
container.bind<JwtTokensRepository>(JwtTokensRepository).to(JwtTokensRepository)
container.bind<LikesCommentsRepository>(LikesCommentsRepository).to(LikesCommentsRepository)
container.bind<LikesPostsRepository>(LikesPostsRepository).to(LikesPostsRepository)
container.bind<PasswordRecoveryRepository>(PasswordRecoveryRepository).to(PasswordRecoveryRepository)
container.bind<PostsRepository>(PostsRepository).to(PostsRepository)
container.bind<RateLimitRepository>(RateLimitRepository).to(RateLimitRepository)
container.bind<SessionsRepository>(SessionsRepository).to(SessionsRepository)
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
container.bind<JwtTokensService>(JwtTokensService).to(JwtTokensService)
container.bind<RateLimitService>(RateLimitService).to(RateLimitService)
container.bind<AuthService>(AuthService).to(AuthService)