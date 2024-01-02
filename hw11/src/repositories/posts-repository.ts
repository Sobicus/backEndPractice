import {postBodyRequest} from "../routes/posts-router";
import {blogsRepositoryType} from "./blogs-repository";
import {ObjectId} from "mongodb";
import {IPostPagination, PaginationType} from "../types/paggination-type";
import {CommentsRepositoryType, CommentsViewType, newCommentType} from "../types/comments-type";
import {DefaultCommentsPaginationType, getCommentsPagination, queryCommentsType} from "../helpers/pagination-comments";
import {BlogsModel, CommentsModel, PostsModel} from "./db";
import {create} from "node:domain";

export type postsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type postsDbType = {
    _id: ObjectId
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
        const posts = await PostsModel
            .find({})
            .sort({[postsPagination.sortBy]: postsPagination.sortDirection})
            .limit(postsPagination.pageSize)
            .skip(postsPagination.skip)
            .lean()
        const totalCount = await PostsModel
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
        let post = await PostsModel
            .findOne({_id: new ObjectId(postId)})
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

    async createPost(newPost: createPostType): Promise<{ blogName: string, postId: string } | null> {
        let blog: blogsRepositoryType | null = await BlogsModel
            .findOne({_id: new ObjectId(newPost.blogId)})
        if (!blog) return null;
        let newPostByDb = await PostsModel
            .create({...newPost, blogName: blog.name, _id: new ObjectId()})
        const blogName = blog.name
        const postId = newPostByDb._id.toString()
        return {blogName, postId}
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const resultUpdateModel = await PostsModel
            .updateOne({_id: new ObjectId(postId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await PostsModel
            .deleteOne({_id: new ObjectId(postId)})
        return resultDeletePost.deletedCount === 1
    }

    async findCommentsByPostId(postId: string, paggination: DefaultCommentsPaginationType) {
        // const paggination = getCommentsPagination(query)
        const commets = await CommentsModel
            .find({postId: postId})
            .sort({[paggination.sortBy]: paggination.sortDirection})
            .limit(paggination.pageSize)
            .skip(paggination.skip).lean()
        const comments = commets.map(el => (
            {
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: {
                    userId: el.userId,
                    userLogin: el.userLogin
                },
                createdAt: el.createdAt
            })
        )
        const totalCount = await CommentsModel
            .countDocuments({postId: postId})
        const pageCount = Math.ceil(totalCount / paggination.pageSize)
        return {
            pagesCount: pageCount,
            page: paggination.pageNumber,
            pageSize: paggination.pageSize,
            totalCount: totalCount,
            items: comments
        }
    }

    async createCommetByPostId(comment: newCommentType): Promise<CommentsViewType> {
        const newComment = await CommentsModel
            .create({...comment})//<CommentsRepositoryType> can not
        return {
            id: newComment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userLogin: comment.userLogin,
                userId: comment.userId
            },
            createdAt: comment.createdAt
        }
    }
}
