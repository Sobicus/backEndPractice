import {Request, Response, Router} from "express";
import {commentService} from "../domain/comment-service";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {authMiddleware} from "../midlewares/auth-middleware";
import {LikesStatus} from "../repositories/likes-commets-repository";
import {validationComentLikeStatusMiddleware} from "../midlewares/like-status-middleware";
import {likeCommentsService} from "../domain/like-comments-service";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {UsersViewType} from "../types/user-types";
import {commentsQueryRepository} from "../repositories/comments-queryRepository";

export const commentsRouter = Router()

commentsRouter.get('/:id', softAuthMiddleware, async (req: commentsRequestParams<{ id: string }>, res: Response) => {
    const userId = req.user?.id
    const comment = await commentsQueryRepository.getCommentById(req.params.id, userId)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    return res.status(200).send(comment)
})
commentsRouter.put('/:id', authMiddleware, validationCommentsContentMiddleware, async (req: commentsRequestParamsAndBodyUser<{
    id: string
}, { content: string }, UsersViewType>, res: Response) => {
    /*const comment = await commentService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }*/
    /*if (comment.commentatorInfo.userId !== req.user!.id) {
        console.log(comment.commentatorInfo.userId)
        console.log(req.user!.id)
        console.log(comment.commentatorInfo.userId === req.user!.id)
        res.sendStatus(403)
        return
    }*/
    const commentIsUpdated = await commentService.updatePost(req.params.id, req.body.content, req.user!.id)
    if (!commentIsUpdated) {
        res.sendStatus(404)
        return
    }
    if (commentIsUpdated === '403') {
        res.sendStatus(403)
        return
    }
    res.sendStatus(204)
})
commentsRouter.put('/:id/like-status', authMiddleware, validationComentLikeStatusMiddleware,
    async (req: commentsRequestParamsBody<{
        id: string
    }, {
        likeStatus: LikesStatus
    }>, res: Response) => {
        const comentsLikeStatus = req.body.likeStatus
        const userId = req.user!.id
        const commentId = req.params.id
        /*const comment = await commentService.getCommentById(commentId)
        if (!comment) {
            res.sendStatus(404)
            return
        }*/
        const result = await likeCommentsService.likeCommentUpdate(commentId, userId, comentsLikeStatus)
        if (result === '404') {
            res.sendStatus(404)
            return
        }
        return res.sendStatus(204)
    })
commentsRouter.delete('/:id', authMiddleware, async (req: commentsRequestParamsAndUser<{
    id: string
}, UsersViewType>, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    if (comment.commentatorInfo.userId !== req.user!.id) {
        res.sendStatus(403)
        return
    }
    const commentDelete = await commentService.deleteComment(req.params.id)
    if (!commentDelete) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})

type commentsRequestParams<P> = Request<P, {}, {}, {}>
type commentsRequestParamsAndUser<P, U extends UsersViewType> = Request<P, {}, {}, {}, U>
type commentsRequestParamsAndBodyUser<P, B, U extends UsersViewType> = Request<P, {}, B, {}, U>
type commentsRequestParamsBody<P, B> = Request<P, {}, B, {}, {}>