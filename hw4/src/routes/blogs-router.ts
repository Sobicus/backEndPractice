import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMidleware} from "../midlewares/input-blogs-validation-middleware";
import {blogsService} from "../domain/blogs-service";
import {getBlogsPagination} from "../helpers/pagination-helpers";
import {client, dataBaseName} from "../repositories/db";
import {ObjectId} from "mongodb";
import {BlogViewType} from "../repositories/blogs-repository";
import {postsRepositoryType} from "../repositories/posts-repository";
import {validationPostsByBlogIdMidleware} from "../midlewares/input-postsByBlogId-validation-middleware";
import {postService} from "../domain/posts-service";

export const blogsRouter = Router()
blogsRouter.get('/', async (req: Request, res: Response) => {
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
//--------- Find all posts createt byID---------------------------
blogsRouter.get('/:id/posts', async (req: RequestWithParams<{ id: string }>, res: Response) => {
    let blog = await client.db(dataBaseName).collection<BlogViewType>('blogs').findOne({_id: new ObjectId(req.params.id)})
    if (!blog) {
        res.sendStatus(404)
        return
    }
    const blogId = blog._id.toString()
    const pagination = getBlogsPagination(req.query)
    const posts = await client.db(dataBaseName)
        .collection<postsRepositoryType>('posts')
        .find({blogId: blogId})
        .sort({[pagination.sortBy]: pagination.sortDirection})
        .skip(pagination.skip).limit(pagination.pageSize)
        .toArray();
    const allPosts = posts.map(p => ({
        id: p._id.toString(),
        title: p.title,
        shortDescription: p.shortDescription,
        content: p.content,
        blogId: p.blogId,
        blogName: p.blogName,
        createdAt: p.createdAt
    }))
    const totalCount = await client.db(dataBaseName).collection<postsRepositoryType>('posts').countDocuments({blogId: blogId})
    const pagesCount = Math.floor(totalCount / pagination.pageSize)
    res.status(200).send({
        "pagesCount": pagesCount === 0 ? 1 : pagesCount,
        "page": pagination.pageNumber,
        "pageSize": pagination.pageSize,
        "totalCount": totalCount,
        "items": posts
    })
})
//----------------------------------------------------------------
//----------------Create newPost by ID----------------------------
blogsRouter.post('/:id/posts', checkAuthorization, ...validationPostsByBlogIdMidleware, async (req: RequestChangeBlog<{
    id: string
}, postByBlogIdBodyRequest>, res: Response) => {
    const blogId = req.params.id
    const {title, shortDescription, content} = req.body
    const createdPostByBlogId = await postService.createPost(title, shortDescription, content, blogId)
    if (!createdPostByBlogId) return res.status(404)
    res.status(201).send(createdPostByBlogId)
})
//----------------------------------------------------------------
blogsRouter.post('/', checkAuthorization, ...validationBlogsMidleware, async (req: postRequestWithBody<blogBodyRequest>, res: Response) => {
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