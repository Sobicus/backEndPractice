import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import nodemailer from 'nodemailer'
import {emailAdapter} from "../adapters/email-adapter";
import {authService} from "../domain/auth-service";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";

export const authRouter = Router()

authRouter.post('/login', validationAuthLoginMiddleware, async (req: PostRequestType<BodyTypeRegistration>, res: Response) => {
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
authRouter.post('/registration', validationUsersMiddleware, async (req: PostRequestType<PostRequestRegistrationType>, res: Response) => {
        //await userService.createUser(req.body.login, req.body.password, req.body.email)
        const newUser = await authService.createUser(req.body.login, req.body.password, req.body.email)
        if (!newUser) {
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    }
)
authRouter.post('/registration-confirmation', async (req: PostRequestType<{ code: string }>, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
    if (!result) {
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the confirmation code is incorrect, expired or already been applied",
                    "field": "code"
                }
            ]
        })
    }
    return res.sendStatus(204)
})
authRouter.post('/registration-email-resending', async () => {
})

type PostRequestType<B> = Request<{}, {}, B, {}>
type BodyTypeRegistration = {
    loginOrEmail: string
    password: string
}
type PostRequestRegistrationType = {
    login: string
    password: string
    email: string
}