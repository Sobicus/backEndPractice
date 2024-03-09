import {NextFunction, Request, Response} from "express";
import {jwtService, usersService} from "../composition-root";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    console.log('userId authMiddleware 1 ' + userId)
    if (userId) {
        req.user = await usersService.findUserById(userId)
        console.log('user authMiddleware ')
        console.log(req.user)
        next()
        return
    }
    return res.sendStatus(401)
}