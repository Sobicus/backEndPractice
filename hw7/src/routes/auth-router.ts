import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import nodemailer from 'nodemailer'
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";

export const authRouter = Router()

authRouter.post('/login', async (req: PostRequestType<BodyType>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res.sendStatus(401)
        return
    }
    const token = await jwtService.createJWT(user.id!) // Change hardcode
    res.status(200).send(token)
    return
})
authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const userData = req.user
    console.log(userData)
    if (!userData) return res.sendStatus(401)
    return res.status(200).send({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})
authRouter.post('/registration', async (req: PostRequestType<PostRequestRegistrationType>, res: Response) => {
        //await userService.createUser(req.body.login, req.body.password, req.body.email)
        await authService.createUser(req.body.login, req.body.password, req.body.email)
        res.sendStatus(204)
    }
)
authRouter.post('/registration-confirmation', async () => {
})
authRouter.post('/registration-email-resending', async () => {
})

type PostRequestType<B> = Request<{}, {}, B, {}>
type BodyType = {
    loginOrEmail: string
    password: string
}
type PostRequestRegistrationType = {
    login: string
    password: string
    email: string
}