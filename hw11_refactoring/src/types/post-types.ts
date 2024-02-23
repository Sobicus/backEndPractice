import {ObjectId} from "mongodb";

export type PostsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}

export type PostsDbType = {
    _id: ObjectId
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
}
export type CreatePostType = {
    title: string
    shortDescription: string
    content: string
    blogId: string
    createdAt: string
}