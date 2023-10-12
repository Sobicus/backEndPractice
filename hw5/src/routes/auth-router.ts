import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {validationAuthMiddleware} from "../midlewares/input-auth-validation-middleware";

export const authRouter = Router()

authRouter.post('/login', validationAuthMiddleware, async (req: PostRequestType<BOdyType>, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!checkResult) return res.sendStatus(401)
    return res.sendStatus(204)
})


type PostRequestType<B> = Request<{}, {}, B, {}>
type BOdyType = {
    loginOrEmail: string
    password: string
}