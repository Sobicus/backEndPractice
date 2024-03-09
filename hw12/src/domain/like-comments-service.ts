import {LikesCommentsRepository} from "../repositories/likes-commets-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {LikesStatus} from "../types/likes-comments-repository-types";

export class LikeCommentsService {
    likesCommentsRepository: LikesCommentsRepository
    commentRepository: CommentsRepository


    constructor(likesCommentsRepository: LikesCommentsRepository, commentRepository: CommentsRepository) {
        this.likesCommentsRepository = likesCommentsRepository
        this.commentRepository = commentRepository
    }

    async likeCommentUpdate(commentId: string, userId: string, likeStatus: LikesStatus) {
        const comment = this.commentRepository.findCommentsById(commentId)
        if (!comment) {
            return '404'
        }
        const existingReaction = await this.likesCommentsRepository.findCommentLikeCommentIdUserId(commentId, userId)
        if (!existingReaction) {
            const commentStatusModel = {
                userId,
                commentId,
                myStatus: likeStatus,
                createdAt: new Date().toISOString()
            }
            return this.likesCommentsRepository.createCommentLike(commentStatusModel)
        }
        if (likeStatus === existingReaction.myStatus) {
            return
        } else {
            return this.likesCommentsRepository.updateCommentLike(commentId, userId, likeStatus)
        }
    }
}