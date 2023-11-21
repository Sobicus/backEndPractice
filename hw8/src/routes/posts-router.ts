import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationPostsMiddleware} from "../midlewares/input-posts-validation-middleware";
import {postService} from "../domain/posts-service";
import {getPostsPagination} from "../helpers/pagination-helpers";
import {IQuery, SortPostsByEnum} from "../types/paggination-type";
import {authMiddleware} from "../midlewares/auth-middleware";
import {UsersOutputType} from "../repositories/users-repository";
import {getCommentsPagination, queryCommentsType} from "../helpers/pagination-comments";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";

export const postsRouter = Router()

postsRouter.get('/', async (req: Request<{}, {}, {}, IQuery<SortPostsByEnum>>, res: Response) => {
    const postsPagination = getPostsPagination(req.query)
    const posts = await postService.findAllPosts(postsPagination)
    res.status(200).send(posts)
})
postsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const post = await postService.findPostById(req.params.id)
    if (!post) {
        res.sendStatus(404)
        return;
    }
    return res.status(200).send(post);
})
postsRouter.post('/', checkAuthorization, ...validationPostsMiddleware, async (req: postRequestWithBody<postBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = await postService.createPost(title, shortDescription, content, blogId)
    if (!newPost) return res.sendStatus(404);
    return res.status(201).send(newPost);
})
postsRouter.put('/:id', checkAuthorization, ...validationPostsMiddleware, async (req: putRequestChangePost<{
    id: string
}, postBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const postIsUpdated = await postService.updatePost(req.params.id, {title, shortDescription, content, blogId})
    if (!postIsUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
postsRouter.delete('/:id', checkAuthorization, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const postIsDelete = await postService.deletePost(req.params.id)
    if (!postIsDelete) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
postsRouter.post('/:id/comments',
    authMiddleware,
    validationCommentsContentMiddleware,
    async (req: postRequestComment<{ id: string }, { content: string }, UsersOutputType>, res: Response) => {
        const post = await postService.findPostById(req.params.id)
        if (!post) {
            return res.sendStatus(404)
        }
        const newComment = await postService.createCommetByPostId(req.params.id, req.body.content, req.user!)
        return res.status(201).send(newComment)
    })
postsRouter.get('/:id/comments', async (req: RequestWithParamsAndQuery<{
    id: string
}, queryCommentsType>, res: Response) => {
    console.log(req.query)
    const paggination = getCommentsPagination(req.query)
    console.log(paggination)
    const post = await postService.findPostById(req.params.id)
    const query = req.query
    if (!post) {
        res.sendStatus(404)
        return
    }
    const comments = await postService.findCommentsById(req.params.id, paggination)
    return res.status(200).send(comments)
})

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
export type postBodyRequest = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
type postRequestComment<P, B, U extends UsersOutputType> = Request<P, {}, B, {}, U>
type putRequestChangePost<P, B> = Request<P, {}, B, {}>
type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
