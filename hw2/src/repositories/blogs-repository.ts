import {blogBodyRequest} from "../routes/blogs-router";

export type blogsRepositoryType = {
    id: string
    name: string
    description: string
    websiteUrl: string
}
export const blogsDb: Array<blogsRepositoryType> = [{
    id: "1q",
    name: "string",
    description: "string",
    websiteUrl: "string"
}, {
    id: "2q",
    name: "string",
    description: "string",
    websiteUrl: "string"
}]


class blogsRepository {

    findAllBlogs(): blogsRepositoryType[] {
        return blogsDb
    }

    findBlogById(blogId: string): blogsRepositoryType | undefined {
        return blogsDb.find((b) => b.id === blogId)
    }

    updateBlog(blogId: string, updateModel: blogBodyRequest): boolean {
        const blog = this.findBlogById(blogId);

        if (!blog) {
            return false;
        }

        const blogIndex = blogsDb.findIndex((b) => b.id === blogId)

        const changeBlog = {...blog, ...updateModel}

        blogsDb.splice(blogIndex, 1, changeBlog)

        return true
    }

    createBlog(createModel: blogBodyRequest): blogsRepositoryType {
        const newBlog: blogsRepositoryType = {
            id: (+new Date() + ''),
            ...createModel
        }

        blogsDb.push(newBlog)

        return newBlog
    }

    deleteBlog(blogId: string): boolean {
        const indexToDelete = blogsDb.findIndex(b => b.id === blogId)
        if (indexToDelete === -1) {
            return false;
        }
        blogsDb.splice(indexToDelete, 1)
        return true
    }
}

export const BlogRepository = new blogsRepository();