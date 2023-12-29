import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {body} from "express-validator";
import {inputVal} from "../midlewares/errorValidator";
import {randomUUID} from "crypto";
import jwt from 'jsonwebtoken'
import {sessionService} from "../domain/session-service";
import {rateLimitMiddleware} from "../domain/rate-limit-middleware";
import {
    validationEmailPasswordRecoveryMiddleware
} from "../midlewares/input-emailPasswordRecovery-validation-middleware";
import {authService} from "../domain/auth-service";
import {validationNewPasswordMiddleware} from "../midlewares/newPassword-recoveryCode-middleware";

export const authRouter = Router()

authRouter.post('/login', rateLimitMiddleware, validationAuthLoginMiddleware, async (req: PostRequestType<BodyTypeRegistration>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res.sendStatus(401)
        return
    }
    const deviceId = randomUUID()
    const accessToken = await jwtService.createAccessJWT(user.id!) // Change hardcode
    const refreshToken = await jwtService.createRefreshJWT(user.id!, deviceId) // Change hardcode

    //------------------test------------------
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    console.log('atob jwt', atob(accessToken.accessToken.split('.')[1]))
    console.log('atob jwt', atob(refreshToken.refreshToken.split('.')[1]))
    console.log('encode', Buffer.from(refreshToken.refreshToken.split('.')[1], 'base64').toString('utf-8'))
    console.log('encode', Buffer.from(refreshToken.refreshToken.split('.')[0], 'base64').toString('utf-8'))
    // const {userId, iat, exp} = Buffer.from(refreshToken.refreshToken.split('.')[1], 'base64').toString('utf-8')
    // console.log('test1', userId)
    // console.log('test2', iat)
    // console.log('test3', exp)
    console.log('jwt', jwt.decode(accessToken.accessToken))
    const decodeJwtAccessToken = jwt.decode(accessToken.accessToken)
    console.log('decodeJwtAccessToken', decodeJwtAccessToken)

    console.log('req.baseUrl', req.baseUrl)
    console.log('req.originalUrl', req.originalUrl)
    const decodeJwt = jwt.decode(accessToken.accessToken)

    const {userId, iat}: any = jwt.decode(accessToken.accessToken)
    console.log('userId iat', userId, iat)
    console.log('userId iat', userId, iat)
    console.log('deviceId', randomUUID())
    console.log('ip', req.socket.remoteAddress)
    console.log('ip', req.ip)
    console.log('deviceName', req.headers['user-agent'])
    console.log('userId', user.id)
    //-----------------------------------------
    const ip = req.socket.remoteAddress//what we do with ip becouse ts think that ip can be undefined
    const deviceName = req.headers['user-agent']//what we do with deviceName becouse ts think that deviceName can be undefined
    const addDeviceSession = await sessionService.createDeviceSession(refreshToken.refreshToken, ip!, deviceName!)
    if (!addDeviceSession) return res.sendStatus(401)
    //------------above new logic------------------
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
authRouter.post('/registration', rateLimitMiddleware, validationUsersMiddleware, async (req: PostRequestType<PostRequestRegistrationType>, res: Response) => {
        //await userService.createUser(req.body.login, req.body.password, req.body.email)
        const newUser = await authService.createUser(req.body.login, req.body.password, req.body.email)
        if (!newUser) {
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    }
)
authRouter.post('/registration-confirmation', rateLimitMiddleware, body('code')
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
authRouter.post('/registration-email-resending', rateLimitMiddleware, body('email')
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
    const payload = await jwtService.getPayloadByToken(refreshToken)
    if (!payload) return res.sendStatus(401)
    const {userId, deviceId} = payload;
    const getSessionByUserIdAndDeviceId = await sessionService.getSessionByUserIdAndDeviceId(userId, deviceId)
    if (!getSessionByUserIdAndDeviceId) return res.sendStatus(401)
    if (payload.iat * 1000 !== new Date(getSessionByUserIdAndDeviceId.issuedAt).getTime()) return res.sendStatus(401)

    // const isExpiredToken = await jwtTokensService.isExpiredToken(refreshToken)
    // if (isExpiredToken) return res.sendStatus(401)// check need i this verification or this redundant
    const newAccessToken = await jwtService.createAccessJWT(userId)
    const newRefreshToken = await jwtService.createRefreshJWT(userId, deviceId)
    // await jwtTokensService.expiredTokens(refreshToken)//do need something check?
    const result = await sessionService.updateSession(newRefreshToken.refreshToken)
    if (!result) return res.sendStatus(401)
    res.status(200)
        .cookie('refreshToken', newRefreshToken.refreshToken, {httpOnly: true, secure: true})
        .send(newAccessToken)
    return
})
authRouter.post('/logout', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    console.log('logout refreshToken', refreshToken)
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getPayloadByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const {userId, deviceId} = expiredOrNot;
    const getSessionByUserIdAndDeviceId = await sessionService.getSessionByUserIdAndDeviceId(userId, deviceId)
    if (!getSessionByUserIdAndDeviceId) return res.sendStatus(401)
    //  console.log('expiredOrNot logout',expiredOrNot.iat)
    //  console.log('getSessionByUserIdAndDeviceId.issuedAt logout',getSessionByUserIdAndDeviceId.issuedAt)
    //  const date=new Date(expiredOrNot.iat * 1000).toISOString()
    //  console.log('date logout',date)
    //  console.log('date logout',new Date(date)!==new Date(getSessionByUserIdAndDeviceId.issuedAt))
    //  console.log('new Date(expiredOrNot.iat) == new Date(getSessionByUserIdAndDeviceId.issuedAt)',  expiredOrNot.iat*1000 !== new Date(getSessionByUserIdAndDeviceId.issuedAt).getTime(), expiredOrNot.iat*1000, new Date(getSessionByUserIdAndDeviceId.issuedAt).getTime())
    // console.log('getSessionByUserIdAndDeviceId.issuedAt',getSessionByUserIdAndDeviceId.issuedAt)
    // if (expiredOrNot.iat*1000 !== new Date(getSessionByUserIdAndDeviceId.issuedAt).getTime()) return res.sendStatus(401)
    console.log('new Date(expiredOrNot.iat*1000).toISOString()', new Date(expiredOrNot.iat * 1000).toISOString())
    console.log('getSessionByUserIdAndDeviceId.issuedAt', getSessionByUserIdAndDeviceId.issuedAt)
    console.log('new Date(expiredOrNot.iat*1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt', new Date(expiredOrNot.iat * 1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt)
    if (new Date(expiredOrNot.iat * 1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt) return res.sendStatus(401)
    //const isExpiredToken = await jwtTokensService.isExpiredToken(refreshToken)
    //if (isExpiredToken) return res.sendStatus(401)// check need i this verification or this redundant
    //await jwtTokensService.expiredTokens(refreshToken)
    const result = await sessionService.deleteSessionDevice(userId, deviceId)
    if (!result) return res.sendStatus(401)
    return res.clearCookie('refreshToken').sendStatus(204)
})
authRouter.post('/password-recovery',
    rateLimitMiddleware,
    validationEmailPasswordRecoveryMiddleware,
    async (req: PostRequestType<BodyPasswordRecoveryType>, res: Response) => {
        const email = req.body.email
        const user = await userService.findUserByEmailOrLogin(email)
        if (!user) return res.sendStatus(204)
        await authService.passwordRecovery(user)
        return res.sendStatus(204)
    })
authRouter.post('/new-password', rateLimitMiddleware, validationNewPasswordMiddleware, async (req: PostRequestType<BodyNewPasswordType>, res: Response) => {
    const {newPassword, recoveryCode} = req.body
    await authService.newPassword(newPassword, recoveryCode)
    res.sendStatus(204)
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
type BodyPasswordRecoveryType = {
    email: string
}
type BodyNewPasswordType = {
    newPassword: string
    recoveryCode: string
}