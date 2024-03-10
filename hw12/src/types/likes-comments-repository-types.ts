import {ObjectId} from "mongodb";

export type LikesCommentsDbType = {
    _id: ObjectId
    userId: string
    commentId: string
    myStatus:LikesStatus
    createdAt: string
}
export type LikesCommentsDbInputType = {
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