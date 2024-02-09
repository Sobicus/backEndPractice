import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {userService} from "../domain/user-service";

export const softAuthMiddleware = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next()
    }

    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    console.log('userId authMiddleware 1 ' + userId)
    if (userId) {
        req.user = await userService.findUserById(userId)
        console.log('user authMiddleware ')
        console.log(req.user)
        return next()
    }
    return next()
}