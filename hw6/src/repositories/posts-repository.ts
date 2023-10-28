import {postBodyRequest} from "../routes/posts-router";
import {blogsRepositoryType} from "./blogs-repository";
import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";
import {IPostPagination, PaginationType} from "../types/paggination-type";
import {CommentsRepositoryType} from "./comments-repository";

export type postsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type createPostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    createdAt: string
}

export class PostsRepository {
    async findAllPosts(postsPagination: IPostPagination): Promise<PaginationType<postsViewType>> {
        const posts = await client.db(dataBaseName)
            .collection<postsViewType>('posts')
            .find({})
            .sort({[postsPagination.sortBy]: postsPagination.sortDirection})
            .limit(postsPagination.pageSize)
            .skip(postsPagination.skip)
            .toArray()
        const totalCount = await client.db(dataBaseName)
            .collection<postsViewType>('posts')
            .countDocuments()
        const pagesCount = Math.ceil(totalCount / postsPagination.pageSize)
        const allPosts = posts.map(p => (
            {
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }))
        return {
            pagesCount: pagesCount,
            page: postsPagination.pageNumber,
            pageSize: postsPagination.pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }

    async findPostById(postId: string): Promise<postsViewType | null> {
        let post = await client.db(dataBaseName).collection<postsViewType>('posts').findOne({_id: new ObjectId(postId)})
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

    async createPost(newPost: createPostType): Promise<{ blogName: string, blogId: string } | null> {
        let blog: blogsRepositoryType | null = await client.db(dataBaseName)
            .collection<blogsRepositoryType>('blogs')
            .findOne({_id: new ObjectId(newPost.blogId)})
        if (!blog) return null;
        let newPostByDb = await client.db(dataBaseName)
            .collection('posts')
            .insertOne({...newPost, blogName: blog.name})
        const blogName = blog.name
        const blogId = newPostByDb.insertedId.toString()
        return {blogName, blogId}
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const resultUpdateModel = await client.db(dataBaseName)
            .collection<postsViewType>('posts')
            .updateOne({_id: new ObjectId(postId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await client.db(dataBaseName)
            .collection<postsViewType>('posts')
            .deleteOne({_id: new ObjectId(postId)})
        return resultDeletePost.deletedCount === 1
    }

    async findCommentsByPostId(postId: string) {
        const allCommetsByPostId = await client.db(dataBaseName)
            .collection<commentsViewType>('comments').find({_id: new ObjectId(postId)})
        return allCommetsByPostId
    }

    async createCommetByPostId(postId: string, content: string, createdAt: string) {
        const post = await client.db(dataBaseName)
            .collection<postsViewType>('posts')
            .findOne({_id: new ObjectId(postId)})
        if (!post) return null
        const newComment = await client.db(dataBaseName)
            .collection<CommentsRepositoryType>('comments').insertOne(newCommentData)
        return newComment
    }
}