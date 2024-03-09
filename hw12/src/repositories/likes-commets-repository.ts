import {ObjectId} from "mongodb";
import {LikesCommentsModel} from "./db";
import {LikesCommentsRepoDbType, LikesCommentsRepoInputType, LikesStatus} from "../types/likes-comments-repository-types";

export class LikesCommentsRepository {
    async createCommentLike(commentModel: LikesCommentsRepoInputType) {
        const newReaction = await LikesCommentsModel.create({_id: new ObjectId(), ...commentModel})
        return newReaction
    }

    async updateCommentLike(commentId: string, userId: string, myStatus: LikesStatus): Promise<boolean> {
        const result = await LikesCommentsModel.updateOne({commentId, userId}, {$set: {myStatus}})
        return result.modifiedCount === 1
    }

    async findCommentLikeCommentIdUserId(commentId: string, userId: string): Promise<LikesCommentsRepoDbType | null> {
        return LikesCommentsModel.findOne({
            commentId,
            userId
        })
    }

}

