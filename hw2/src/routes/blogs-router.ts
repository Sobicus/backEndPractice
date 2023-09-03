import {NextFunction, Request, Response, Router} from "express";
import {blogsRepository, blogsRepositoryType} from "../repositories/blogs-repository";
import {validationMidleware} from "../midlewares/input-validation-middleware";
import { checkAuthorization } from "../midlewares/authorization-check-middleware";

export const blogsRouter = Router()

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository)
})
blogsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = blogsRepository.find(blog => blog.id === req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(blog)
})

blogsRouter.post('/', checkAuthorization, ...validationMidleware, (req: postRequestWithBody<blogPostBodyRequest>, res: Response) => {
    let {name, description, websiteUrl} = req.body
    const newBlog: blogsRepositoryType = {
        id: (+new Date() + ''),
        name,
        description,
        websiteUrl,
    }

    blogsRepository.push(newBlog)
    res.status(201).send(newBlog)
})
blogsRouter.put('/:id', checkAuthorization, ...validationMidleware,(req: putRequestChangeBlog<{ id: string }, blogPostBodyRequest>, res: Response) => {
    const blog = blogsRepository.find(b => b.id === req.params.id)
    const blogIndex = blogsRepository.findIndex(b => b.id === req.params.id)
    let {name, description, websiteUrl} = req.body

    if (!blog) {
        res.sendStatus(404)
        return
    }
    const changeBlog = {...blog, name, description, websiteUrl}
    blogsRepository.splice(blogIndex, 1, changeBlog)
    res.sendStatus(204)
})
blogsRouter.delete('/:id', checkAuthorization, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const indexToDelete = blogsRepository.findIndex(b => b.id === req.params.id)
    if (indexToDelete !== -1) {
        blogsRepository.splice(indexToDelete, 1)
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
type blogPostBodyRequest = {
    name: string
    description: string
    websiteUrl: string
}
type putRequestChangeBlog<P, B> = Request<P, {}, B, {}>
