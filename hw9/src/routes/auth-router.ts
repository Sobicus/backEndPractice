import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {body} from "express-validator";
import {inputVal} from "../midlewares/errorValidator";
import { jwtTokensService } from "../domain/jwt-tokens-service";

export const authRouter = Router()

authRouter.post('/login', validationAuthLoginMiddleware, async (req: PostRequestType<BodyTypeRegistration>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res.sendStatus(401)
        return
    }
    const accessToken = await jwtService.createAccessJWT(user.id!) // Change hardcode
    const refreshToken = await jwtService.createRefreshJWT(user.id!) // Change hardcode
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    res.status(200)
        .cookie('refreshToken', refreshToken.refreshToken, {httpOnly: true, secure: true})
        .send(accessToken)
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
authRouter.post('/registration-confirmation', body('code')
    .custom(async (code) => {
        const checkUser = await userService.findUserByConfirmationCode(code)
        if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
        return true
    }), inputVal, async (req: PostRequestType<{ code: string }>, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
    console.log('result registration-confirmation', result)
    console.log('req.body.code', req.body.code)
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
authRouter.post('/registration-email-resending', body('email')
    .isString().withMessage('Email not a string')
    .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com')
    .custom(async (email) => {
        const checkUser = await userService.findUserByEmailOrLogin(email)
        if (!checkUser) throw new Error(' user not found')
        if (checkUser.emailConfirmation.isConfirmed) throw new Error(' already exist by email')
        return true
    }), inputVal, async (req: PostRequestType<{ email: string }>, res: Response) => {
    const result = await authService.resendingRegistrationEmail(req.body.email)
    return res.sendStatus(204)
})
authRouter.post('/refresh-token', async (req: Request, res: Response) => {
    const refreshToken: string = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const userId = await jwtService.getUserIdByToken(refreshToken)
    console.log("userId in token",userId)
    if(!userId) return res.sendStatus(401)
    const isExpiredToken = await jwtTokensService.isExpiredToken(refreshToken)
    console.log(isExpiredToken)
    if(isExpiredToken) return res.sendStatus(401)// check need i this verification or this redundant

    const newAccessToken = await jwtService.createAccessJWT(userId)
    const newRefreshToken = await jwtService.createRefreshJWT(userId)
    await jwtTokensService.expiredTokens(refreshToken)//do need something check?
    console.log('refresh-token newAccessToken', newAccessToken)
    console.log('refresh-token newRefreshToken', newRefreshToken)
    res.status(200)
        .cookie('refreshToken', newRefreshToken.refreshToken, {httpOnly: true, secure: true})
        .send(newAccessToken)
    return
})
authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    console.log('logout refreshToken', refreshToken)

    const expiredOrNot=await jwtService.getUserIdByToken(refreshToken)
    console.log('logout expiredOrNot', expiredOrNot)
    if(!expiredOrNot)return res.sendStatus(401)

    const isExpiredToken = await jwtTokensService.isExpiredToken(refreshToken)
    console.log('logout isExpiredToken', isExpiredToken)
    if(isExpiredToken) return res.sendStatus(401)// check need i this verification or this redundant

    await jwtTokensService.expiredTokens(refreshToken)
    return res.clearCookie('refreshToken').sendStatus(204)
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