import {BlogsRepository, BlogViewType} from "../repositories/blogs-repository";
import {blogBodyRequest} from "../routes/blogs-router";
import {IBlockPagination, IQuery, Paginated, SortBlogsByEnum} from "../types/paggination-type";
import {postsViewType} from "../repositories/posts-repository";

class BlogsService {
    blogRepo: BlogsRepository

    constructor() {
        this.blogRepo = new BlogsRepository()
    }

    async findAllBlogs(pagination: IBlockPagination): Promise<Paginated<BlogViewType>> {
        return this.blogRepo.findAllBlogs(pagination)
    }

    async findBlogById(blogId: string): Promise<BlogViewType | null> {
        return await this.blogRepo.findBlogById(blogId)
    }

    async findPostByBlogId(blogId: string, query: IQuery<SortBlogsByEnum>): Promise<Paginated<postsViewType> | null> {
        return await this.blogRepo.findPostByBlogId(blogId, query)
    }

    async createBlog(createModel: blogBodyRequest): Promise<BlogViewType> {
        const createdAt = new Date().toISOString()
        const isMembership = false
        const newBlog = {...createModel, createdAt, isMembership}
        const mongoResponse = await this.blogRepo.createBlog(newBlog)
        return {id: mongoResponse, ...createModel, createdAt, isMembership}
    }

    async createPostByBlogId(title: string, shortDescription: string, content: string, blogId: string): Promise<postsViewType | null> {
        return this.blogRepo.createPostByBlogId(title, shortDescription, content, blogId)
    }

    async updateBlog(blogId: string, updateModel: blogBodyRequest): Promise<boolean> {
        return await this.blogRepo.updateBlog(blogId, updateModel)
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const result = await this.blogRepo.deleteBlog(blogId)
        return result
    }
}

export const blogsService = new BlogsService();