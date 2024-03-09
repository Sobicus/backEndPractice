import {ObjectId} from "mongodb";

export type LikesCommentsRepoDbType = {
    _id: ObjectId
    userId: string
    commentId: string
    myStatus:LikesStatus
    createdAt: string
}
export type LikesCommentsRepoInputType = {
    userId: string
    commentId: string
    myStatus: LikesStatus
    createdAt: string
}

export enum LikesStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}