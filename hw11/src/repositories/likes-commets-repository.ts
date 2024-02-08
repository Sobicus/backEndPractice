import {ObjectId} from "mongodb";
import {LikesCommentsModel} from "./db";

export class LikesCommentsRepository {
    async createCommentLike(commentModel: LikesCommentsRepoInputType) {
        const newReaction = await LikesCommentsModel.create({_id: new ObjectId(), ...commentModel})
        return newReaction
    }

    async updateCommentLike(commentId: string, myStatus: string): Promise<boolean> {
        const result = await LikesCommentsModel.updateOne({commentId}, {$set: {myStatus}})
        return result.modifiedCount === 1
    }

    async findCommentLikeById(commentId: string): Promise<LikesCommentsRepoDbType | null> {
        return (await LikesCommentsModel.findOne({_id: new ObjectId(commentId)}))
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
    myStatus: /*'Like' | 'Dislike' | 'None'*/LikesStatus
    createdAt: string
}

export enum LikesStatus {
    None = 'None',
    Like = 'Like',
    Dislike = 'Dislike'
}