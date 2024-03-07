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
import { LikeCommentsService } from "./domain/like-comments-service";

export const blogRepo = new BlogsRepository()
export const blogsQueryRepository = new BlogsQueryRepository()
export const blogService = new BlogsService(blogRepo)
export const postRepo = new PostsRepository()
export const postQueryRepository = new PostsQueryRepository()
export const postService = new PostsService(postRepo)
export const commentRepo = new CommentsRepository()
export const commentQueryRepository = new CommentsQueryRepository()
export const commentService = new CommentsService(commentRepo)
export const likesCommentsRepository = new LikesCommentsRepository()
export const likesCommentsService = new LikeCommentsService(likesCommentsRepository, commentRepo)