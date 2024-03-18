import {Router} from "express";
import {validationCommentsContentMiddleware} from "../midlewares/input-comments-content-middleware";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationCommentLikeStatusMiddleware} from "../midlewares/like-status-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {commentsControllerInstance} from "./comments-controller";

export const commentsRouter = Router()

commentsRouter.get('/:id', softAuthMiddleware, commentsControllerInstance.getCommentById.bind(commentsControllerInstance))
commentsRouter.put('/:id', authMiddleware, validationCommentsContentMiddleware, commentsControllerInstance.updateComments.bind(commentsControllerInstance))
commentsRouter.put('/:id/like-status', authMiddleware, validationCommentLikeStatusMiddleware, commentsControllerInstance.likeCommentUpdate.bind(commentsControllerInstance))
commentsRouter.delete('/:id', authMiddleware, commentsControllerInstance.deleteComment.bind(commentsControllerInstance))


