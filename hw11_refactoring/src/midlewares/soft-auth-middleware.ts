import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {queryCommentsType} from "../helpers/pagination-comments";
import {RequestWithParamsAndQuery} from "../types/postsRouter-types";
import { usersService } from "../composition-root";

export const softAuthMiddleware = async (req: RequestWithParamsAndQuery<{
    id: string
}, queryCommentsType>, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next()
    }
    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.findUserById(userId)
    }
    return next()
}