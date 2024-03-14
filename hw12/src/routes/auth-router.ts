import {Request, Response, Router} from "express";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {randomUUID} from "crypto";
import jwt from 'jsonwebtoken'
import {rateLimitMiddleware} from "../midlewares/rate-limit-middleware";
import {
    validationEmailPasswordRecoveryMiddleware
} from "../midlewares/input-emailPasswordRecovery-validation-middleware";
import {validationNewPasswordMiddleware} from "../midlewares/newPassword-recoveryCode-middleware";
import {
    BodyNewPasswordAuthType,
    BodyPasswordRecoveryAuthType,
    BodyRegistrationAuthType,
    PostRequestAuthType,
    PostRequestRegistrationAuthType
} from "../types/authRouter-types";
import {UsersService} from "../domain/user-service";
import {authService, jwtService, sessionsService, usersService} from "../composition-root";
import {SessionsService} from "../domain/session-service";
import {AuthService} from "../domain/auth-service";
import {JwtService} from "../application/jwt-service";
import {
    registrationConfirmationCodeCheck
} from "../midlewares/registrationConfirmation-codeCheck";
import {registrationEmailResending} from "../midlewares/registarationEmailResending-emailCheck";

export const authRouter = Router()

class authController {
    usersService: UsersService
    sessionsService: SessionsService
    authService: AuthService
    jwtService: JwtService

    constructor(usersService: UsersService, sessionsService: SessionsService, authService: AuthService, jwtService: JwtService) {
        this.usersService = usersService
        this.sessionsService = sessionsService
        this.authService = authService
        this.jwtService = jwtService
    }

    async createDeviceSession(req: PostRequestAuthType<BodyRegistrationAuthType>, res: Response) {
        const user = await this.usersService.checkCredentials(req.body.loginOrEmail, req.body.password)
        if (!user) {
            res.sendStatus(401)
            return
        }
        const deviceId = randomUUID()
        const accessToken = await this.jwtService.createAccessJWT(user.id!) // Change hardcode
        const refreshToken = await this.jwtService.createRefreshJWT(user.id!, deviceId) // Change hardcode

        const decodeJwtAccessToken = jwt.decode(accessToken.accessToken)

        const decodeJwt = jwt.decode(accessToken.accessToken)

        const ip = req.socket.remoteAddress//what we do with ip becouse ts think that ip can be undefined
        const deviceName = req.headers['user-agent']//what we do with deviceName becouse ts think that deviceName can be undefined
        const addDeviceSession = await this.sessionsService.createDeviceSession(refreshToken.refreshToken, ip!, deviceName!)
        if (!addDeviceSession) return res.sendStatus(401)
//------------above new logic------------------
        res.status(200)
            .cookie('refreshToken', refreshToken.refreshToken, {httpOnly: true, secure: true})
            .send(accessToken)
        return
    }

    async authMe(req: Request, res: Response) {
        const userData = req.user
        console.log(userData)
        if (!userData) return res.sendStatus(401)
        return res.status(200).send({
            email: userData.email,
            login: userData.login,
            userId: userData._id.toString()
        })
    }

    async createUser(req: PostRequestAuthType<PostRequestRegistrationAuthType>, res: Response) {
        //await userService.createUser(req.body.login, req.body.password, req.body.email)
        const newUser = await this.authService.createUser(req.body.login, req.body.password, req.body.email)
        if (!newUser) {
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    }

    async confirmEmail(req: PostRequestAuthType<{ code: string }>, res: Response) {
        const result = await this.authService.confirmEmail(req.body.code)
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
    }

    async resendingRegistrationEmail(req: PostRequestAuthType<{ email: string }>, res: Response) {
        const result = await authService.resendingRegistrationEmail(req.body.email)
        return res.sendStatus(204)
    }

    async updateSession(req: Request, res: Response) {
        const refreshToken: string = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const payload = await this.jwtService.getPayloadByToken(refreshToken)
        if (!payload) return res.sendStatus(401)
        const {userId, deviceId} = payload;
        const getSessionByUserIdAndDeviceId = await this.sessionsService.getSessionByUserIdAndDeviceId(userId, deviceId)
        if (!getSessionByUserIdAndDeviceId) return res.sendStatus(401)
        if (payload.iat * 1000 !== new Date(getSessionByUserIdAndDeviceId.issuedAt).getTime()) return res.sendStatus(401)

// const isExpiredToken = await jwtTokensService.isExpiredToken(refreshToken)
// if (isExpiredToken) return res.sendStatus(401)// check need i this verification or this redundant
        const newAccessToken = await this.jwtService.createAccessJWT(userId)
        const newRefreshToken = await this.jwtService.createRefreshJWT(userId, deviceId)
// await jwtTokensService.expiredTokens(refreshToken)//do need something check?
        const result = await this.sessionsService.updateSession(newRefreshToken.refreshToken)
        if (!result) return res.sendStatus(401)
        res.status(200)
            .cookie('refreshToken', newRefreshToken.refreshToken, {httpOnly: true, secure: true})
            .send(newAccessToken)
        return
    }

    async deleteSessionDevice(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        console.log('logout refreshToken', refreshToken)
        if (!refreshToken) return res.sendStatus(401)
        const expiredOrNot = await this.jwtService.getPayloadByToken(refreshToken)
        if (!expiredOrNot) return res.sendStatus(401)
        const {userId, deviceId} = expiredOrNot;
        const getSessionByUserIdAndDeviceId = await this.sessionsService.getSessionByUserIdAndDeviceId(userId, deviceId)
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
        const result = await this.sessionsService.deleteSessionDevice(userId, deviceId)
        if (!result) return res.sendStatus(401)
        return res.clearCookie('refreshToken').sendStatus(204)
    }

    async passwordRecovery(req: PostRequestAuthType<BodyPasswordRecoveryAuthType>, res: Response) {
        const email = req.body.email
        const user = await this.usersService.findUserByEmailOrLogin(email)
        if (!user) return res.sendStatus(204)
        await this.authService.passwordRecovery(user)
        return res.sendStatus(204)
    }

    async newPassword(req: PostRequestAuthType<BodyNewPasswordAuthType>, res: Response) {
        const {newPassword, recoveryCode} = req.body
        await this.authService.newPassword(newPassword, recoveryCode)
        res.sendStatus(204)
    }
}

const authControllerInstance = new authController(usersService, sessionsService, authService, jwtService)

authRouter.post('/login', rateLimitMiddleware, validationAuthLoginMiddleware, authControllerInstance.createDeviceSession.bind(authControllerInstance))
authRouter.get('/me', authMiddleware, authControllerInstance.authMe.bind(authControllerInstance))
authRouter.post('/registration', rateLimitMiddleware, validationUsersMiddleware, authControllerInstance.createUser.bind(authControllerInstance))
//------------------------------------------------------------------------------------------
authRouter.post('/registration-confirmation', rateLimitMiddleware, /*body('code')
    .custom(async (code) => {
        const checkUser = await usersService.findUserByConfirmationCode(code)
        if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
        return true
    }), inputVal,*/registrationConfirmationCodeCheck, authControllerInstance.confirmEmail.bind(authControllerInstance))
//------------------------------------------------------------------------------------------
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResending,/*body('email')
    .isString().withMessage('Email not a string')
    .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com')
    .custom(async (email) => {
        const checkUser = await usersService.findUserByEmailOrLogin(email)
        if (!checkUser) throw new Error(' user not found')
        if (checkUser.emailConfirmation.isConfirmed) throw new Error(' already exist by email')
        return true
    }), inputVal,*/ authControllerInstance.resendingRegistrationEmail.bind(authControllerInstance))
//---------------------------------------------------------------------------------------------
authRouter.post('/refresh-token', authControllerInstance.updateSession.bind(authControllerInstance))
authRouter.post('/logout', authControllerInstance.deleteSessionDevice.bind(authControllerInstance))
authRouter.post('/password-recovery',
    rateLimitMiddleware,
    validationEmailPasswordRecoveryMiddleware, authControllerInstance.passwordRecovery.bind(authControllerInstance))
authRouter.post('/new-password', rateLimitMiddleware, validationNewPasswordMiddleware, authControllerInstance.newPassword.bind(authControllerInstance))
