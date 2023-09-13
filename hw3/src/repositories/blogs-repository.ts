import {blogBodyRequest} from "../routes/blogs-router";
import {client, dataBaseName} from "./db";

export type blogsRepositoryType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
class blogsRepository {

    async findAllBlogs(): Promise<blogsRepositoryType[]> {
        return await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').find({}).toArray()
    }

// тут был undefined поменял на налл это так работает мангошка?????
    async findBlogById(blogId: string): Promise<blogsRepositoryType | null> {
        let blog: blogsRepositoryType | null = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').findOne({id: blogId})
        return blog
        // blogsDb.find((b) => b.id === blogId)
    }

    async updateBlog(blogId: string, updateModel: blogBodyRequest): Promise<boolean> {
        const resultUpdateModel = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').updateOne({id: blogId}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async createBlog(createModel: blogBodyRequest): Promise<blogsRepositoryType> {
        const newBlog: blogsRepositoryType = {
            id: (+new Date() + ''),
            ...createModel
        }
        const resultNewBlog = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').insertOne(newBlog)
        return newBlog
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const resultDeleteBlog = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').deleteOne({id: blogId})
        return resultDeleteBlog.deletedCount === 1
    }
}

export const BlogRepository = new blogsRepository();