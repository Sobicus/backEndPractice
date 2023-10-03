import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMidleware} from "../midlewares/input-blogs-validation-middleware";
import {blogsService} from "../domain/blogs-service";
import {getBlogsPagination} from "../helpers/pagination-helpers";
import {validationPostsByBlogIdMidleware} from "../midlewares/input-postsByBlogId-validation-middleware";
import {IQuery, SortBlogsByEnum} from "../types/paggination-type";

export const blogsRouter = Router()
blogsRouter.get('/', async (req: Request<{}, {}, {}, IQuery<SortBlogsByEnum>>, res: Response) => {
    const pagination = getBlogsPagination(req.query)

    const blogs = await blogsService.findAllBlogs(pagination)
    res.status(200).send(blogs)
})
blogsRouter.get('/:id/', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = await blogsService.findBlogById(req.params.id)

    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(blog)
})
blogsRouter.get('/:id/posts', async (req: RequestWithParamsAmdQuery<{
    id: string
}, IQuery<SortBlogsByEnum>>, res: Response) => {
    const blogId = req.params.id
    const queryParam = req.query
    const posts = await blogsService.findPostByBlogId(blogId, queryParam)
    if (!posts) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(posts)
})
blogsRouter.post('/:id/posts', checkAuthorization, ...validationPostsByBlogIdMidleware, async (req: RequestChangeBlog<{id: string}, postByBlogIdBodyRequest>, res: Response) => {
        const blogId = req.params.id
        const {title, shortDescription, content} = req.body
        const post = await blogsService.createPostByBlogId(title, shortDescription, content, blogId)
        //const createdPostByBlogId = await postService.createPost(title, shortDescription, content, blogId)
        if (!post) return res.sendStatus(404)
        return res.status(201).send(post)
    })
blogsRouter.post('/', checkAuthorization, ...validationBlogsMidleware,
    async (req: postRequestWithBody<blogBodyRequest>, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const createdBlog = await blogsService.createBlog({name, description, websiteUrl})

        res.status(201).send(createdBlog)
    })
blogsRouter.put('/:id', checkAuthorization, ...validationBlogsMidleware, async (req: RequestChangeBlog<{
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
type RequestWithParamsAmdQuery<P, Q> = Request<P, {}, {}, Q>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
export  type blogBodyRequest = {
    name: string
    description: string
    websiteUrl: string
}
type RequestChangeBlog<P, B> = Request<P, {}, B, {}>
type postByBlogIdBodyRequest = {
    title: string
    shortDescription: string
    content: string
}