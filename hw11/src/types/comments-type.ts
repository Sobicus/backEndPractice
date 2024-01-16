import {ObjectId} from "mongodb";
import {LikesStatus} from "../repositories/likes-commets-repository";

export type CommentsViewType = {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: LikesInfoType
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
type LikesInfoType={
    likesCount: number
    dislikesCount: number
    myStatus: LikesStatus
}