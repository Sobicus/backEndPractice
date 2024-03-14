import {Response, Router} from "express";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationCommentLikeStatusMiddleware} from "../midlewares/like-status-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {UsersViewType} from "../types/user-types";
import {
    commentsRequestParams,
    commentsRequestParamsAndBodyUser,
    commentsRequestParamsAndUser,
    commentsRequestParamsBody
} from "../types/commentRouter-types";
import {CommentsQueryRepository} from "../repositories/comments-queryRepository";
import {CommentsService} from "../domain/comments-service";
import {commentQueryRepository, commentService, likesCommentsService} from "../composition-root";
import {LikeCommentsService} from "../domain/like-comments-service";
import {LikesStatus} from "../types/likes-comments-repository-types";

export const commentsRouter = Router()

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
        if (!commentIsUpdated) {
            res.sendStatus(404)
            return
        }
        if (commentIsUpdated === '403') {
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
        if (result === '404') {
            res.sendStatus(404)
            return
        }
        return res.sendStatus(204)
    }

    async deleteComment(req: commentsRequestParamsAndUser<{
        id: string
    }, UsersViewType>, res: Response) {
        const commentDelete = await this.commentsService.deleteComment(req.params.id, req.user!._id.toString())
        if (!commentDelete) {
            res.sendStatus(404)
            return
        }
        if (commentDelete === '403') {
            res.sendStatus(403)
            return
        }
        res.sendStatus(204)
    }
}

const commentsControllerInstance = new CommentsController(commentQueryRepository, commentService, likesCommentsService)

commentsRouter.get('/:id', softAuthMiddleware, commentsControllerInstance.getCommentById.bind(commentsControllerInstance))
commentsRouter.put('/:id', authMiddleware, validationCommentsContentMiddleware, commentsControllerInstance.updateComments.bind(commentsControllerInstance))
commentsRouter.put('/:id/like-status', authMiddleware, validationCommentLikeStatusMiddleware, commentsControllerInstance.likeCommentUpdate.bind(commentsControllerInstance))
commentsRouter.delete('/:id', authMiddleware, commentsControllerInstance.deleteComment.bind(commentsControllerInstance))


