import {LikesCommentsRepository} from "../repositories/likes-commets-repository";
import {CommentsRepository} from "../repositories/comments-repository";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {ObjectResult, statusType} from "../commands/object-result";
import {injectable} from "inversify";

@injectable()
export class LikeCommentsService {
    likesCommentsRepository: LikesCommentsRepository
    commentRepository: CommentsRepository


    constructor(likesCommentsRepository: LikesCommentsRepository, commentRepository: CommentsRepository) {
        this.likesCommentsRepository = likesCommentsRepository
        this.commentRepository = commentRepository
    }

    async likeCommentUpdate(commentId: string, userId: string, likeStatus: LikesStatus):Promise<ObjectResult> {
        const comment = this.commentRepository.findCommentsById(commentId)
        if (!comment) {
            return {
                status: statusType.NotFound,
                errorMessages:'comment cannot be found',
                data:null
            }
        }
        const existingReaction = await this.likesCommentsRepository.findCommentLikeCommentIdUserId(commentId, userId)
        if (!existingReaction) {
            const commentStatusModel = {
                userId,
                commentId,
                myStatus: likeStatus,
                createdAt: new Date().toISOString()
            }
             await this.likesCommentsRepository.createCommentLike(commentStatusModel)
            return{
                status:statusType.Success,
                errorMessages:'comment likes has been created',
                data:null
            }
        }
        if (likeStatus === existingReaction.myStatus) {
            return{
                status:statusType.Success,
                errorMessages:'comment likes the same',
                data:null
            }
        } else {
             await this.likesCommentsRepository.updateCommentLike(commentId, userId, likeStatus)
            return{
                status:statusType.Success,
                errorMessages:'comment likes has been updated',
                data:null
            }
        }
    }
}