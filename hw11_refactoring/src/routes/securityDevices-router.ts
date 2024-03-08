import {Request, Response, Router} from "express";
import {jwtService} from "../application/jwt-service";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getUserIdByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const allDeviceSession = await sessionService.getAllDeviceSessions(expiredOrNot)
    return res.status(200).send(allDeviceSession)
})
securityDevicesRouter.delete('/', async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getPayloadByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const {userId, deviceId} = expiredOrNot
    const result = await sessionService.deleteDevicesExceptThis(userId, deviceId)
    if (!result) return res.sendStatus(401)
    return res.sendStatus(204)
})
securityDevicesRouter.delete('/:deviceId', async (req: RequestParamsType<{ deviceId: string }>, res: Response) => {
    const deviceIdWithParams = req.params.deviceId
    if (!deviceIdWithParams) return res.sendStatus(404)
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) return res.sendStatus(401)
    const expiredOrNot = await jwtService.getPayloadByToken(refreshToken)
    if (!expiredOrNot) return res.sendStatus(401)
    const {userId} = expiredOrNot
    const receiveDeviceByDeviceId = await sessionService.getDeviceByDeviceId(deviceIdWithParams)
    if(!receiveDeviceByDeviceId)return res.sendStatus(404)
    if(userId!==receiveDeviceByDeviceId.userId)return res.sendStatus(403)
    const result = await sessionService.deleteSessionDevice(userId, deviceIdWithParams)
    if (!result) return res.sendStatus(401)
    return res.sendStatus(204)
})
type RequestParamsType<P> = Request<P, {}, {}, {}>