import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {validationAuthMiddleware} from "../midlewares/input-auth-validation-middleware";

export const authRouter = Router()

authRouter.post('/login', validationAuthMiddleware, async (req: PostRequestType<BodyType>, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!checkResult) return res.sendStatus(401)
    return res.sendStatus(204)
})
//----------------------HW 6------------------------------------
authRouter.post('/login', validationAuthMiddleware, async (req: PostRequestType<BodyType>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) return res.sendStatus(401)
    const token = await jwtService.cewateJWT(user)
    return res.status(201).send(token)
})


type PostRequestType<B> = Request<{}, {}, B, {}>
type BodyType = {
    loginOrEmail: string
    password: string
}