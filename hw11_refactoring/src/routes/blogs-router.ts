import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMiddleware} from "../midlewares/input-blogs-validation-middleware";
import {BlogsService} from "../domain/blogs-service";
import {getBlogsPagination} from "../helpers/pagination-helpers";
import {validationPostsByBlogIdMidleware} from "../midlewares/input-postsByBlogId-validation-middleware";
import {IQuery, SortBlogsByEnum} from "../types/paggination-type";
import {postService} from "../domain/posts-service";
import {
    blogBodyRequest,
    postByBlogIdBodyRequestBlogs,
    postRequestWithBodyBlogs,
    RequestChangeBlogBlogs,
    RequestWithParamsAmdQueryBlogs,
    RequestWithParamsBlogs
} from "../types/blogsRouter-types";
import {BlogsQueryRepository} from "../repositories/blogs-queryRepository";

export const blogsRouter = Router()

class BlogsController {
    blogService: BlogsService
    blogsQueryRepository: BlogsQueryRepository

    constructor() {
        this.blogService = new BlogsService()
        this.blogsQueryRepository = new BlogsQueryRepository()
    }

    async getAllBlogs(req: Request<{}, {}, {}, IQuery<SortBlogsByEnum>>, res: Response) {
        const pagination = getBlogsPagination(req.query)
        const blogs = await this.blogsQueryRepository.findAllBlogs(pagination)
        res.status(200).send(blogs)
    }

}

const blogsControllerInstance = new BlogsController()

blogsRouter.get('/', blogsControllerInstance.getAllBlogs)
blogsRouter.get(':id', blogsControllerInstance.getBlogById)
blogsRouter.get('/:id', async (req: RequestWithParamsBlogs<{ id: string }>, res: Response) => {
    const blog = await blogsQueryRepository.findBlogById(req.params.id)

    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(blog)
})
blogsRouter.get('/:id/posts', async (req: RequestWithParamsAmdQueryBlogs<{
    id: string
}, IQuery<SortBlogsByEnum>>, res: Response) => {
    const blogId = req.params.id
    const queryParam = req.query
    const posts = await blogsQueryRepository.findPostByBlogId(blogId, queryParam)
    if (!posts) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(posts)
})
blogsRouter.post('/:id/posts', checkAuthorization, ...validationPostsByBlogIdMidleware, async (req: RequestChangeBlogBlogs<{
    id: string
}, postByBlogIdBodyRequestBlogs>, res: Response) => {
    const blogId = req.params.id
    const {title, shortDescription, content} = req.body
    const post = await postService.createPost(title, shortDescription, content, blogId)
    //const createdPostByBlogId = await postService.createPost(title, shortDescription, content, blogId)
    if (!post) return res.sendStatus(404)
    return res.status(201).send(post)
})
blogsRouter.post('/', checkAuthorization, ...validationBlogsMiddleware,
    async (req: postRequestWithBodyBlogs<blogBodyRequest>, res: Response) => {
        const {name, description, websiteUrl} = req.body
        const createdBlog = await blogsService.createBlog({name, description, websiteUrl})

        res.status(201).send(createdBlog)
    })
blogsRouter.put('/:id', checkAuthorization, ...validationBlogsMiddleware, async (req: RequestChangeBlogBlogs<{
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
blogsRouter.delete('/:id', checkAuthorization, async (req: RequestWithParamsBlogs<{ id: string }>, res: Response) => {
    const blogIsDeleted = await blogsService.deleteBlog(req.params.id);

    if (!blogIsDeleted) {
        res.sendStatus(404)
        return
    }

    res.sendStatus(204)
})

