import {LikesCommentsRepository, LikesStatus} from "../repositories/likes-commets-repository";

class LikeCommentsService {
    likesCommentsRepo: LikesCommentsRepository

    constructor() {
        this.likesCommentsRepo = new LikesCommentsRepository()
    }

    async likeCommentUpdate(commentId: string, userId: string, likeStatus: LikesStatus) {
        const existingReaction = await this.likesCommentsRepo.findCommentLikeCommentIdUserId(commentId, userId)
        if (!existingReaction) {
            const commentStatusModel = {
                userId,
                commentId,
                myStatus: likeStatus,
                createdAt: new Date().toISOString()
            }
            return this.likesCommentsRepo.createCommentLike(commentStatusModel)
        }
        if (likeStatus === existingReaction.myStatus) {
            return
        } else {
            return this.likesCommentsRepo.updateCommentLike(commentId, userId, likeStatus)
        }
    }
}

export const likeCommentsService = new LikeCommentsService()
