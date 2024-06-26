import {BlogsModel} from "./db";
import { BlogsDbType} from "../types/blog-types";
import { blogBodyRequest } from "../types/blogsRouter-types";
import {injectable} from "inversify";
import {ObjectId} from "mongodb";

@injectable()
export class BlogsRepository {
        async createBlog(createModel: BlogsDbType): Promise<string>/*Promise<InsertOneResult>*/ /*Promise<BlogViewType>*/ {
        const resultNewBlog = await BlogsModel
            .create(createModel)
        return resultNewBlog._id.toString()
    }

    async updateBlog(blogId: string, updateModel: blogBodyRequest): Promise<boolean> {
        const resultUpdateModel = await BlogsModel
            .updateOne({_id: new ObjectId(blogId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deleteBlog(blogId: string): Promise<boolean> {
        const resultDeleteBlog = await BlogsModel
            .deleteOne({_id: new ObjectId(blogId)})
        return resultDeleteBlog.deletedCount === 1
    }
}