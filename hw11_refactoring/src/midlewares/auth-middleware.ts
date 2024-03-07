import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {userService, UsersService} from "../domain/user-service";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return res.sendStatus(401)
    }
    const token = req.headers.authorization.split(' ')[1]

    const userId = await jwtService.getUserIdByToken(token)
    console.log('userId authMiddleware 1 ' + userId)
    if (userId) {
        req.user = await userService.findUserById(userId)
        console.log('user authMiddleware ')
        console.log(req.user)
        next()
        return
    }
    return res.sendStatus(401)
}