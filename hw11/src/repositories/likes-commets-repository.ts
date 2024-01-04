import {ObjectId} from "mongodb";

export class LikesCommentsRepo {
    async createCommentLike(commentModel: LikesCommentsRepoInputType) {

    }
}

type LikesCommentsRepoDbType = {
    _id: ObjectId
    userId: string
    commentId: string
    myStatus: /*'Like' | 'Dislike' | 'None'*/likesStatus
    createdAt: string
}
type LikesCommentsRepoInputType = {
    userId: string
    commentId: string
    myStatus: 'Like' | 'Dislike' | 'None'
    createdAt: string
}

export enum likesStatus {
    'none',
    'like',
    'dislike'
}