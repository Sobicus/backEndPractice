import {LikesPostInputDBType} from "../types/likes-post-repository-type";
import {LikesPostsModel} from "./db";
import {LikesStatus} from "../types/likes-comments-repository-types";

export class LikesPostsRepository {
    async createPostReaction(postReactionModel: LikesPostInputDBType) {
        return await LikesPostsModel.create(postReactionModel)
    }

    async updatePostReaction(postId: string, userId: string, myStatus: LikesStatus) {
        const result = await LikesPostsModel.updateOne({postId, userId}, {$set: {myStatus}})
        return result.modifiedCount === 1
    }

    async findPostLikebyPostIdUserId(postId: string, userId: string) {
        return LikesPostsModel.findOne({postId, userId})
    }
}