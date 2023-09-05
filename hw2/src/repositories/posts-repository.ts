import {postBodyRequest} from "../routes/posts-router";
import {BlogRepository} from "./blogs-repository";

export type postsRepositoryType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}
export const postDb: Array<postsRepositoryType> = [{
    id: "1dq",
    title: "eve",
    shortDescription: "online",
    content: "pve/pvp",
    blogId: "13",
    blogName: "20yers+"
}, {
    id: "2dq",
    title: "string",
    shortDescription: "string",
    content: "string",
    blogId: "string",
    blogName: "string"
}]

class postsRepository {
    findAllPosts(): Array<postsRepositoryType> {
        return postDb
    }

    findPostById(postId: string): postsRepositoryType | undefined {
        return postDb.find(p => p.id === postId)
    }

    createPost(title: string, shortDescription: string, content: string, blogId: string): postsRepositoryType {
        const blogName = BlogRepository.findBlogById(blogId)?.name
        if (typeof (blogName) === 'string' && typeof (blogName) !== 'undefined') {
            const newPost = {
                id: (+new Date() + ''),
                title,
                shortDescription,
                content,
                blogId,
                blogName
            }
            postDb.push(newPost)
        }
        return postDb[postDb.length - 1]
    }

    updatePost(postId: string, updateModel: postBodyRequest): boolean {
        const post = this.findPostById(postId)
        if (!post) {
            return false
        }
        const postIndex = postDb.findIndex(p => p.id === postId)
        const changePost = {...post, ...updateModel}
        postDb.splice(postIndex, 1, changePost)
        return true
    }

    deletePost(postId: string): boolean {
        const indexToDelete = postDb.findIndex(p => p.id === postId)
        if (indexToDelete === -1) {
            return false
        }
        postDb.splice(indexToDelete,1)
        return true
    }
}

export const postRepository = new postsRepository()