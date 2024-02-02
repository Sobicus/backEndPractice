import {Request, Response, Router} from "express";
import {commentService} from "../domain/comment-service";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {UsersOutputType} from "../repositories/users-repository";
import {authMiddleware} from "../midlewares/auth-middleware";
import {postService} from "../domain/posts-service";
import {LikesStatus} from "../repositories/likes-commets-repository";
import {validationAuthLoginMiddleware} from "../midlewares/like-status-middleware";
import {likeCommentsService} from "../domain/like-comments-service";

export const commentsRouter = Router()

commentsRouter.get('/:id', async (req: commentsRequestParams<{ id: string }>, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    return res.status(200).send(comment)
})
commentsRouter.put('/:id', authMiddleware, validationCommentsContentMiddleware, async (req: commentsRequestParamsAndBodyUser<{
    id: string
}, { content: string }, UsersOutputType>, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    if (comment.commentatorInfo.userId !== req.user!.id) {
        console.log(comment.commentatorInfo.userId)
        console.log(req.user!.id)
        console.log(comment.commentatorInfo.userId === req.user!.id)
        res.sendStatus(403)
        return
    }
    const commentIsUpdated = await commentService.updatePost(req.params.id, req.body.content)
    if (!commentIsUpdated) {
        res.sendStatus(404)
        return
    }
    res.sendStatus(204)
})
commentsRouter.put(':id/like-status', authMiddleware, validationAuthLoginMiddleware, async (req: commentsRequestParamsBody<{
    id: string
}, {
    likeStatus: LikesStatus
}>, res: Response) => {
    const commentId = req.params.id
    const comentsLikeStatus = req.body.likeStatus
    const userId= req.user!.id
    const comment = await commentService.getCommentById(commentId)
    if (!comment) {
        res.sendStatus(404)
        return
    }
    await likeCommentsService.likeCommentUpdate(commentId, userId, comentsLikeStatus)

})
commentsRouter.delete('/:id', authMiddleware, async (req: commentsRequestParamsAndUser<{
    id: string
}, UsersOutputType>, res: Response) => {
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
type commentsRequestParamsAndUser<P, U extends UsersOutputType> = Request<P, {}, {}, {}, U>
type commentsRequestParamsAndBodyUser<P, B, U extends UsersOutputType> = Request<P, {}, B, {}, U>
type commentsRequestParamsBody<P, B> = Request<P, {}, B, {}, {}>