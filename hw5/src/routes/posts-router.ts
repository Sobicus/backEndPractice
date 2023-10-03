import {Response, Request, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationPostsMidleware} from "../midlewares/input-posts-validation-middleware";
import {postService} from "../domain/posts-service";
import {getDefaultPagination, getPostsPagination} from "../helpers/pagination-helpers";
import {IQuery, SortPostsByEnum} from "../types/paggination-type";

export const postsRouter = Router()

postsRouter.get('/', async (req: Request<{},{},{},IQuery<SortPostsByEnum>>, res: Response) => {
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
postsRouter.post('/', checkAuthorization, ...validationPostsMidleware, async (req: postRequestWithBody<postBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const newPost = await postService.createPost(title, shortDescription, content, blogId)
    if (!newPost) return res.sendStatus(404);
    return res.status(201).send(newPost);
})
postsRouter.put('/:id', checkAuthorization, ...validationPostsMidleware, async (req: putRequesrChangePost<{
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

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
export type postBodyRequest = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
type putRequesrChangePost<P, B> = Request<P, {}, B, {}>
