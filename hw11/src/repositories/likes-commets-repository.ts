import {ObjectId} from "mongodb";
import {LikesCommentsModel} from "./db";

export class LikesCommentsRepository {
    async createCommentLike(commentModel: LikesCommentsRepoInputType) {

        const newReaction = await LikesCommentsModel.create({_id: new ObjectId(), ...commentModel})

    }
}

export type LikesCommentsRepoDbType = {
    _id: ObjectId
    userId: string
    commentId: string
    myStatus: /*'Like' | 'Dislike' | 'None'*/LikesStatus
    createdAt: string
}
type LikesCommentsRepoInputType = {
    userId: string
    commentId: string
    myStatus: 'Like' | 'Dislike' | 'None'
    createdAt: string
}

export enum LikesStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}