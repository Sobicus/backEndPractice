import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMidleware} from "../midlewares/input-blogs-validation-middleware";
import {blogsService} from "../domain/blogs-service";
import {BlogsRepository} from "../repositories/blogs-repository";

export const blogsRouter = Router()
blogsRouter.get('/', async (req: Request, res: Response) => {
    console.log(req.query)
    const {
        searchNameTerm,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize
    } = req.query
    console.log(searchNameTerm)
    console.log(sortBy)
    console.log(sortDirection)
    console.log(pageNumber)
    console.log(pageSize)
    const blogs = await blogsService.findAllBlogs()
    res.status(200).send(blogs)
})
blogsRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = await blogsService.findBlogById(req.params.id)

    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(blog)
})
blogsRouter.post('/', checkAuthorization, ...validationBlogsMidleware, async (req: postRequestWithBody<blogBodyRequest>, res: Response) => {
    let {name, description, websiteUrl} = req.body
    const createdBlog = await blogsService.createBlog({name, description, websiteUrl})

    res.status(201).send(createdBlog)
})
blogsRouter.put('/:id', checkAuthorization, ...validationBlogsMidleware, async (req: putRequestChangeBlog<{
    id: string
}, blogBodyRequest>, res: Response) => {
    let {name, description, websiteUrl} = req.body
    const blogIsUpdated = await blogsService.updateBlog(req.params.id, {name, description, websiteUrl})

    if (!blogIsUpdated) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})
blogsRouter.delete('/:id', checkAuthorization, async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blogIsDeleted = await blogsService.deleteBlog(req.params.id);

    if (!blogIsDeleted) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
export  type blogBodyRequest = {
    name: string
    description: string
    websiteUrl: string
}
type putRequestChangeBlog<P, B> = Request<P, {}, B, {}>
