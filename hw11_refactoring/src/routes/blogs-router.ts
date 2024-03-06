import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMiddleware} from "../midlewares/input-blogs-validation-middleware";
import {BlogsService} from "../domain/blogs-service";
import {getBlogsPagination} from "../helpers/pagination-helpers";
import {validationPostsByBlogIdMidleware} from "../midlewares/input-postsByBlogId-validation-middleware";
import {IQuery, SortBlogsByEnum} from "../types/paggination-type";
import {
    blogBodyRequest,
    postByBlogIdBodyRequestBlogs,
    postRequestWithBodyBlogs,
    RequestChangeBlogBlogs,
    RequestWithParamsAmdQueryBlogs,
    RequestWithParamsBlogs
} from "../types/blogsRouter-types";
import {BlogsQueryRepository} from "../repositories/blogs-queryRepository";
import {PostsService} from "../domain/posts-service";

export const blogsRouter = Router()

class BlogsController {
    blogsService: BlogsService
    blogsQueryRepository: BlogsQueryRepository
    postService: PostsService

    constructor() {
        this.blogsService = new BlogsService()
        this.blogsQueryRepository = new BlogsQueryRepository()
        this.postService = new PostsService()
    }

    async getAllBlogs(req: Request<{}, {}, {}, IQuery<SortBlogsByEnum>>, res: Response) {
        const pagination = getBlogsPagination(req.query)
        const blogs = await this.blogsQueryRepository.findAllBlogs(pagination)
        res.status(200).send(blogs)
    }

    async getBlogById(req: RequestWithParamsBlogs<{ id: string }>, res: Response) {
        const blog = await this.blogsQueryRepository.findBlogById(req.params.id)

        if (!blog) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(blog)
    }

    async getPostsByBlogId(req: RequestWithParamsAmdQueryBlogs<{
        id: string
    }, IQuery<SortBlogsByEnum>>, res: Response) {
        const blogId = req.params.id
        const queryParam = req.query
        const posts = await this.blogsQueryRepository.findPostByBlogId(blogId, queryParam)
        if (!posts) {
            res.sendStatus(404)
            return
        }
        res.status(200).send(posts)
    }

    async createPost(req: RequestChangeBlogBlogs<{
        id: string
    }, postByBlogIdBodyRequestBlogs>, res: Response) {
        const blogId = req.params.id
        const {title, shortDescription, content} = req.body
        const post = await this.postService.createPost(title, shortDescription, content, blogId)
        if (!post) return res.sendStatus(404)
        return res.status(201).send(post)
    }

    async createBlog(req: postRequestWithBodyBlogs<blogBodyRequest>, res: Response) {
        const {name, description, websiteUrl} = req.body
        const createdBlog = await this.blogsService.createBlog({name, description, websiteUrl})

        res.status(201).send(createdBlog)
    }

    async updateBlog(req: RequestChangeBlogBlogs<{
        id: string
    }, blogBodyRequest>, res: Response) {
        let {name, description, websiteUrl} = req.body
        const blogIsUpdated = await this.blogsService.updateBlog(req.params.id, {name, description, websiteUrl})
        if (!blogIsUpdated) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }

    async deleteBlog(req: RequestWithParamsBlogs<{ id: string }>, res: Response) {
        const blogIsDeleted = await this.blogsService.deleteBlog(req.params.id);
        if (!blogIsDeleted) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}

const blogsControllerInstance = new BlogsController()

blogsRouter.get('/', blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance))
blogsRouter.get(':id', blogsControllerInstance.getBlogById.bind(blogsControllerInstance))
blogsRouter.get('/:id/posts', blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance))
blogsRouter.post('/:id/posts', checkAuthorization, ...validationPostsByBlogIdMidleware, blogsControllerInstance.createPost.bind(blogsControllerInstance))
blogsRouter.post('/', checkAuthorization, ...validationBlogsMiddleware, blogsControllerInstance.createBlog.bind(blogsControllerInstance))
blogsRouter.put('/:id', checkAuthorization, ...validationBlogsMiddleware, blogsControllerInstance.updateBlog.bind(blogsControllerInstance))
blogsRouter.delete('/:id', checkAuthorization, blogsControllerInstance.deleteBlog.bind(blogsControllerInstance))