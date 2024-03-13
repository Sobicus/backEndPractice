import {ObjectId} from "mongodb";
import {LikesStatus} from "./likes-comments-repository-types";

export type PostsViewType = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt: string
    extendedLikesInfo: ExtendedLikesInfo
}
type ExtendedLikesInfo={
    likesCount: number
    dislikesCount: number
    myStatus: LikesStatus
    newestLikes: NewestLikes[]

}
type NewestLikes = {
    addedAt: string
    userId: string
    login: string
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