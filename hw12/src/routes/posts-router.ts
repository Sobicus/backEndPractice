import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationPostsMiddleware} from "../midlewares/input-posts-validation-middleware";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {validationPostLikesMiddleware} from "../midlewares/input-post-postLikes-middleware";
import {container} from "../composition-root";
import { PostsController } from "./posts-controller";

export const postsRouter = Router()

//const postsControllerInstance = new PostsController(postQueryRepository, postService, likesPostsService)
const postsControllerInstance = container.resolve(PostsController)

postsRouter.get('/', softAuthMiddleware, postsControllerInstance.getAllPosts.bind(postsControllerInstance))
postsRouter.get('/:id', softAuthMiddleware, postsControllerInstance.findPostById.bind(postsControllerInstance))
postsRouter.post('/', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.createPost.bind(postsControllerInstance))
postsRouter.put('/:id', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.updatePost.bind(postsControllerInstance))
postsRouter.delete('/:id', checkAuthorization, postsControllerInstance.deletePost.bind(postsControllerInstance))
postsRouter.post('/:id/comments', authMiddleware, validationCommentsContentMiddleware, postsControllerInstance.createCommetByPostId.bind(postsControllerInstance))
postsRouter.get('/:id/comments', softAuthMiddleware, postsControllerInstance.findCommentsByPostId.bind(postsControllerInstance))
postsRouter.put('/:id/like-status', authMiddleware, validationPostLikesMiddleware, postsControllerInstance.likePostUpdate.bind(postsControllerInstance))




