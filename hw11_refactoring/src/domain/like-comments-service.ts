import {LikesCommentsRepository, LikesStatus} from "../repositories/likes-commets-repository";
import {CommentsRepository} from "../repositories/comments-repository";

class LikeCommentsService {
    likesCommentsRepo: LikesCommentsRepository
    commentRepo: CommentsRepository


    constructor() {
        this.likesCommentsRepo = new LikesCommentsRepository()
        this.commentRepo=new CommentsRepository()
    }

    async likeCommentUpdate(commentId: string, userId: string, likeStatus: LikesStatus) {
        const comment = this.commentRepo.findCommentsById(commentId)
        if (!comment) {
            return '404'
        }
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
