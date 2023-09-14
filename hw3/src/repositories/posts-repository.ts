import {postBodyRequest} from "../routes/posts-router";
import {blogsRepositoryType} from "./blogs-repository";
import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";

export type postsRepositoryType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

class postsRepository {
    async findAllPosts(): Promise<Array<postsRepositoryType>> {
        const posts = await client.db(dataBaseName).collection<postsRepositoryType>('posts').find({}).toArray()
        return posts.map(p => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt
        }))
    }

    async findPostById(postId: string): Promise<postsRepositoryType | null> {
        let post = await client.db(dataBaseName).collection<postsRepositoryType>('posts').findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsRepositoryType | null> {
        let blog: blogsRepositoryType | null = await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').findOne({_id: new ObjectId(blogId)})
        if (!blog) return null;
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        };
        let newPostByDb = await client.db(dataBaseName).collection('posts').insertOne({...newPost})

        return {id: newPostByDb.insertedId.toString(), ...newPost};
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const resultUpdateModel = await client.db(dataBaseName).collection<postsRepositoryType>('posts').updateOne({id: postId}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await client.db(dataBaseName).collection<postsRepositoryType>('posts').deleteOne({_id: new ObjectId(postId)})
        return resultDeletePost.deletedCount === 1
    }
}

export const postRepository = new postsRepository()