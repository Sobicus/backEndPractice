import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";

export const authRouter = Router()

/*authRouter.post('/login', validationAuthMiddleware, async (req: PostRequestType<BodyType>, res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!checkResult) return res.sendStatus(401)
    return res.sendStatus(204)
})*/
//----------------------HW 6------------------------------------
authRouter.post('/login', async (req: PostRequestType<BodyType>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    /*
    if (user) {
        const token = await jwtService.createJWT(user.id!) // Change hardcode
        res.status(200).send(token)
        return
    } else {

    }
    */
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


type PostRequestType<B> = Request<{}, {}, B, {}>
type BodyType = {
    loginOrEmail: string
    password: string
}
