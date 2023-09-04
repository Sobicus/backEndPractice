import {Response, Request, Router} from "express";
import {postsRepository, postsRepositoryType} from "../repositories/posts-repository";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";

export const postsRouter = Router()

postsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(postsRepository)
})
postsRouter.get('/:id', (req: RequestWithParam<{ id: string }>, res: Response) => {
    const post = postsRepository.find(el => el.id === req.params.id)
    if (!post) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(post)
})
postsRouter.post('/', checkAuthorization, async (req: postRequestWithBody<postAddBodyRequest>, res: Response) => {
    let {title, shortDescription, content, blogId} = req.body
    const blog = await blogsRepository.find(b => b.id === blogId)

    if (!blog) {
        res.sendStatus(404)
    } else {
        const newPost: postsRepositoryType = {
            id: (+new Date() + ''),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.description
        }
        postsRepository.push(newPost)
        res.status(201).send(newPost)
    }
})
postsRouter.put('/', checkAuthorization, async()=>{

} )

type RequestWithParam<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
type postAddBodyRequest = {
    title: "string"
    shortDescription: "string"
    content: "string"
    blogId: "string"
}
