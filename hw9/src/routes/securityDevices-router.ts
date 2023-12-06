import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";
import {sessionService} from "../domain/session-service";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    console.log('WTF WTF WTF WTF WTF')
    const refreshToken = req.cookies.refreshToken
    console.log('securityDevicesRouter req.cookies.refreshToken', refreshToken)
    if (!refreshToken) return res.sendStatus(401)
    console.log('securityDevicesRouter !refreshToken', !refreshToken)
    const expiredOrNot = jwtService.getUserIdByToken(refreshToken)
    console.log('securityDevicesRouter expiredOrNot', expiredOrNot)
    if (!expiredOrNot) return res.sendStatus(401)
    console.log('securityDevicesRouter !expiredOrNot', !expiredOrNot)
    const allDeviceSession= await sessionService.getAllDeviceSessions()
    return res.status(200).send(allDeviceSession)
})