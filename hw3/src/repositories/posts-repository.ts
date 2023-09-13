import {postBodyRequest} from "../routes/posts-router";
import {BlogRepository} from "./blogs-repository";
import {client, dataBaseName} from "./db";

export type postsRepositoryType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}

class postsRepository {
    async findAllPosts(): Promise<Array<postsRepositoryType>> {
        return await client.db(dataBaseName).collection<postsRepositoryType>('posts').find({}).toArray()
    }

    async findPostById(postId: string): Promise<postsRepositoryType | undefined> {
        let post : postsRepositoryType | undefined= await client.db(dataBaseName).collection<postsRepositoryType>('posts').find({id: postId})
        return post
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsRepositoryType | null> {
        const blog = await BlogRepository.findBlogById(blogId);
        if (!blog) return null;

        const newPost = {
            id: (+new Date() + ''),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name
        };
        postDb.push(newPost);

        return newPost;
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const post = await this.findPostById(postId)
        if (!post) {
            return false
        }
        const postIndex = postDb.findIndex(p => p.id === postId)
        const changePost = {...post, ...updateModel}
        postDb.splice(postIndex, 1, changePost)
        return true
    }

    async deletePost(postId: string): Promise<boolean> {
        const indexToDelete = postDb.findIndex(p => p.id === postId)
        if (indexToDelete === -1) {
            return false
        }
        postDb.splice(indexToDelete, 1)
        return true
    }
}

export const postRepository = new postsRepository()