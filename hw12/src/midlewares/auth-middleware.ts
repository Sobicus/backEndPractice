import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../domain/user-service";

const jwtService = container.resolve(JwtService)
const usersService = container.resolve(UsersService)
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