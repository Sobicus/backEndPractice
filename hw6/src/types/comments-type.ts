import {ObjectId} from "mongodb";

export type CommentsViewType = {
    id: string
    content: string
    createdAt: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
}
export type CommentsRepositoryType = {
    _id: ObjectId
    createdAt: string
    postId: string
    content: string
    userId: string
    userLogin: string
}
export type newCommentType = {
    createdAt: string
    postId: string
    content: string
    userId: string
    userLogin: string
}
