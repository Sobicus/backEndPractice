import {NextFunction, Request, Response} from "express";
import {container} from "../composition-root";
import {JwtService} from "../application/jwt-service";
import {UsersService} from "../domain/user-service";

const jwtService = container.resolve(JwtService)
const usersService = container.resolve(UsersService)
export const softAuthMiddleware = async (req: Request<any, any, any, any>, res: Response, next: NextFunction) => {
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