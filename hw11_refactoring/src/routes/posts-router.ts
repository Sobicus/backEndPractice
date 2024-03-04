import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationPostsMiddleware} from "../midlewares/input-posts-validation-middleware";
import {getPostsPagination} from "../helpers/pagination-helpers";
import {IQuery, SortPostsByEnum} from "../types/paggination-type";
import {authMiddleware} from "../midlewares/auth-middleware";
import {getCommentsPagination, queryCommentsType} from "../helpers/pagination-comments";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {UsersViewType} from "../types/user-types";
import {
    postBodyRequest,
    postRequestComment,
    postRequestWithBody,
    putRequestChangePost,
    RequestWithParams,
    RequestWithParamsAndQuery
} from "../types/postsRouter-types";
import {PostsQueryRepository} from "../repositories/posts-queryRepository";
import {PostsService} from "../domain/posts-service";

export const postsRouter = Router()

class PostsController {
    postsQueryRepository: PostsQueryRepository
    postService: PostsService

    constructor() {
        this.postsQueryRepository = new PostsQueryRepository()
        this.postService = new PostsService()
    }

    async getAllPosts(req: Request<{}, {}, {}, IQuery<SortPostsByEnum>>, res: Response) {
        const postsPagination = getPostsPagination(req.query)
        const posts = await this.postsQueryRepository.findAllPosts(postsPagination)
        res.status(200).send(posts)
    }

    async findPostById(req: RequestWithParams<{ id: string }>, res: Response) {
        const post = await this.postsQueryRepository.findPostById(req.params.id)
        if (!post) {
            res.sendStatus(404)
            return;
        }
        return res.status(200).send(post);
    }

    async createPost(req: postRequestWithBody<postBodyRequest>, res: Response) {
        let {title, shortDescription, content, blogId} = req.body
        const newPost = await this.postService.createPost(title, shortDescription, content, blogId)
        if (!newPost) return res.sendStatus(404);
        return res.status(201).send(newPost);
    }

    async updatePost(req: putRequestChangePost<{
        id: string
    }, postBodyRequest>, res: Response) {
        let {title, shortDescription, content, blogId} = req.body
        const postIsUpdated = await this.postService.updatePost(req.params.id, {
            title,
            shortDescription,
            content,
            blogId
        })
        if (!postIsUpdated) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async deletePost(req: RequestWithParams<{ id: string }>, res: Response) {
        const postIsDelete = await this.postService.deletePost(req.params.id)
        if (!postIsDelete) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async createCommetByPostId(req: postRequestComment<{ id: string }, {
        content: string
    }, UsersViewType>, res: Response) {
        const newComment = await this.postService.createCommetByPostId(req.params.id, req.body.content, req.user!)
        if (!newComment) {
            return res.sendStatus(404)
        }
        return res.status(201).send(newComment)
    }

    async findCommentsByPostId(req: RequestWithParamsAndQuery<{
        id: string
    }, queryCommentsType>, res: Response) {
        const userId = req.user?.id
        const paggination = getCommentsPagination(req.query)
        const post = await this.postsQueryRepository.doesPostExist(req.params.id)
        if (!post) {
            res.sendStatus(404)
            return
        }
        const comments = await this.postsQueryRepository.findCommentsByPostId(req.params.id, paggination, userId)
        return res.status(200).send(comments)
    }
}

const postsControllerInstance = new PostsController()

postsRouter.get('/', postsControllerInstance.getAllPosts.bind(postsControllerInstance))
postsRouter.get('/:id', postsControllerInstance.findPostById.bind(postsControllerInstance))
postsRouter.post('/', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.createPost.bind(postsControllerInstance))
postsRouter.put('/:id', checkAuthorization, ...validationPostsMiddleware, postsControllerInstance.updatePost.bind(postsControllerInstance))
postsRouter.delete('/:id', checkAuthorization, postsControllerInstance.deletePost.bind(postsControllerInstance))
postsRouter.post('/:id/comments', authMiddleware, validationCommentsContentMiddleware, postsControllerInstance.createCommetByPostId.bind(postsControllerInstance))
postsRouter.get('/:id/comments', softAuthMiddleware, postsControllerInstance.findCommentsByPostId.bind(postsControllerInstance))




