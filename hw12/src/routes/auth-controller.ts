import {UsersService} from "../domain/user-service";
import {SessionsService} from "../domain/session-service";
import {AuthService} from "../domain/auth-service";
import {JwtService} from "../application/jwt-service";
import {
    BodyNewPasswordAuthType,
    BodyPasswordRecoveryAuthType,
    BodyRegistrationAuthType,
    PostRequestAuthType,
    PostRequestRegistrationAuthType
} from "../types/authRouter-types";
import {Request, Response} from "express";
import {randomUUID} from "crypto";
import {injectable} from "inversify";

@injectable()
export class authController {
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
        const ip = req.socket.remoteAddress//what we do with ip becouse ts think that ip can be undefined
        const deviceName = req.headers['user-agent']//what we do with deviceName becouse ts think that deviceName can be undefined
        const addDeviceSession = await this.sessionsService.createDeviceSession(refreshToken.refreshToken, ip!, deviceName!)
        if (!addDeviceSession) return res.sendStatus(401)
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
        await this.authService.resendingRegistrationEmail(req.body.email)
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


        const newAccessToken = await this.jwtService.createAccessJWT(userId)
        const newRefreshToken = await this.jwtService.createRefreshJWT(userId, deviceId)
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

        console.log('new Date(expiredOrNot.iat*1000).toISOString()', new Date(expiredOrNot.iat * 1000).toISOString())
        console.log('getSessionByUserIdAndDeviceId.issuedAt', getSessionByUserIdAndDeviceId.issuedAt)
        console.log('new Date(expiredOrNot.iat*1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt', new Date(expiredOrNot.iat * 1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt)
        if (new Date(expiredOrNot.iat * 1000).toISOString() !== getSessionByUserIdAndDeviceId.issuedAt) return res.sendStatus(401)
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

