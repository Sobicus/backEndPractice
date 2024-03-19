import {CommentsQueryRepository} from "../repositories/comments-queryRepository";
import {CommentsService} from "../domain/comments-service";
import {LikeCommentsService} from "../domain/like-comments-service";
import {
    commentsRequestParams,
    commentsRequestParamsAndBodyUser, commentsRequestParamsAndUser,
    commentsRequestParamsBody
} from "../types/commentRouter-types";
import {Response} from "express";
import {UsersViewType} from "../types/user-types";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {commentQueryRepository, commentService, likesCommentsService} from "../composition-root";

class CommentsController {
    commentsQueryRepository: CommentsQueryRepository
    commentsService: CommentsService
    likesCommentsService: LikeCommentsService

    constructor(
        commentsQueryRepository: CommentsQueryRepository,
        commentsService: CommentsService,
        likesCommentsService: LikeCommentsService
    ) {
        this.likesCommentsService = likesCommentsService
        this.commentsQueryRepository = commentsQueryRepository
        this.commentsService = commentsService
    }

    async getCommentById(req: commentsRequestParams<{ id: string }>, res: Response) {
        const userId = req.user?._id.toString()
        const comment = await this.commentsQueryRepository.getCommentById(req.params.id, userId)
        if (!comment) {
            res.sendStatus(404)
            return
        }
        return res.status(200).send(comment)
    }

    async updateComments(req: commentsRequestParamsAndBodyUser<{
        id: string
    }, { content: string }, UsersViewType>, res: Response) {
        const commentIsUpdated = await this.commentsService.updateComments(req.params.id, req.body.content, req.user!._id.toString())
        if (commentIsUpdated.status === 'NotFound') {
            res.sendStatus(404)
            return
        }
        if (commentIsUpdated.status === 'Forbidden') {
            res.sendStatus(403)
            return
        }
        res.sendStatus(204)
    }

    async likeCommentUpdate(req: commentsRequestParamsBody<{
        id: string
    }, {
        likeStatus: LikesStatus
    }>, res: Response) {
        const commentsLikeStatus = req.body.likeStatus
        const userId = req.user!._id.toString()
        const commentId = req.params.id
        const result = await this.likesCommentsService.likeCommentUpdate(commentId, userId, commentsLikeStatus)
        if (result.status === 'NotFound') {
            res.sendStatus(404)
            return
        }
        return res.sendStatus(204)
    }

    async deleteComment(req: commentsRequestParamsAndUser<{
        id: string
    }, UsersViewType>, res: Response) {
        const commentDelete = await this.commentsService.deleteComment(req.params.id, req.user!._id.toString())
        if (commentDelete.status === 'NotFound') {
            res.sendStatus(404)
            return
        }
        if (commentDelete.status === 'Forbidden') {
            res.sendStatus(403)
            return
        }
        res.sendStatus(204)
    }
}

export const commentsControllerInstance = new CommentsController(commentQueryRepository, commentService, likesCommentsService)