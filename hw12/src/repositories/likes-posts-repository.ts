import {LikesPostInputDBType} from "../types/likes-post-repository-type";
import {LikesPostsModel} from "./db";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class LikesPostsRepository {
    async createPostReaction(postReactionModel: LikesPostInputDBType) {
        console.log('create postReaction')
        return await LikesPostsModel.create(postReactionModel)
    }

    async updatePostReaction(postId: string, userId: string, myStatus: LikesStatus) {
        console.log('update postReaction')

        const result = await LikesPostsModel.updateOne({postId, userId}, {$set: {myStatus}})
        return result.modifiedCount === 1
    }

    async findPostLikebyPostIdUserId(postId: string, userId: string) {
        console.log('find postReaction')

        return LikesPostsModel.findOne({postId, userId})
    }
}