import {BlogsRepository} from "../repositories/blogs-repository";
import {BlogViewType} from "../types/blog-types";
import {blogBodyRequest} from "../types/blogsRouter-types";
import {injectable} from "inversify";

@injectable()
export class BlogsService {
    blogRepo: BlogsRepository

    constructor(blogRepo: BlogsRepository) {
        this.blogRepo = blogRepo
    }

    async createBlog(createModel: blogBodyRequest): Promise<BlogViewType> {
        const createdAt = new Date().toISOString()
        const isMembership = false
        const newBlog = {...createModel, createdAt, isMembership}
        const mongoResponse = await this.blogRepo.createBlog(newBlog)
        return {id: mongoResponse, ...createModel, createdAt, isMembership}
    }

    async updateBlog(blogId: string, updateModel: blogBodyRequest): Promise<boolean> {
        return await this.blogRepo.updateBlog(blogId, updateModel)
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const result = await this.blogRepo.deleteBlog(blogId)
        return result
    }
}


