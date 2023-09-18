import {blogBodyRequest} from "../routes/blogs-router";
import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";

export type blogsRepositoryType = {
    //id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export type BlogViewType = {
    id: string,
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

export class BlogsRepository {

    async findAllBlogs(): Promise<BlogViewType[]> {
        const blogs = await client.db(dataBaseName).collection<BlogViewType>('blogs').find({}).toArray();
        console.log('REPO:', blogs)
        return blogs.map(b => ({
            id: b._id.toString(),
            name: b.name,
            websiteUrl: b.websiteUrl,
            description: b.description,
            createdAt: b.createdAt,
            isMembership: b.isMembership
        }))
    }

    async findBlogById(blogId: string): Promise<BlogViewType | null> {
        let blog = await client.db(dataBaseName).collection<BlogViewType>('blogs').findOne({_id: new ObjectId(blogId)})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            description: blog.description,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }

    async updateBlog(blogId: string, updateModel: blogBodyRequest): Promise<boolean> {
        const resultUpdateModel = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').updateOne({_id: new ObjectId(blogId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async createBlog(createModel: blogsRepositoryType): Promise<string>/*Promise<InsertOneResult>*/ /*Promise<BlogViewType>*/ {

        const resultNewBlog = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs')
            .insertOne(createModel)
        return resultNewBlog.insertedId.toString()
        /* return {id: resultNewBlog.insertedId.toString(), ...createModel, createdAt, isMembership}*/
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const resultDeleteBlog = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').deleteOne({_id: new ObjectId(blogId)})
        return resultDeleteBlog.deletedCount === 1
    }
}