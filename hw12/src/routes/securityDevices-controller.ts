import {JwtService} from "../application/jwt-service";
import {SessionsService} from "../domain/session-service";
import {Request, Response} from "express";
import {RequestParamsSecurityDevicesType} from "../types/securityDevicesRouter-types";
import {jwtService, sessionsService} from "../composition-root";

class securityDevicesController {
    jwtService: JwtService
    sessionsService: SessionsService

    constructor(jwtService: JwtService, sessionsService: SessionsService) {
        this.jwtService = jwtService
        this.sessionsService = sessionsService
    }

    async getAllDeviceSessions(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const expiredOrNot = await this.jwtService.getUserIdByToken(refreshToken)
        if (!expiredOrNot) return res.sendStatus(401)
        const allDeviceSession = await this.sessionsService.getAllDeviceSessions(expiredOrNot)
        return res.status(200).send(allDeviceSession)
    }

    async deleteDevicesExceptThis(req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const expiredOrNot = await this.jwtService.getPayloadByToken(refreshToken)
        if (!expiredOrNot) return res.sendStatus(401)
        const {userId, deviceId} = expiredOrNot
        const result = await this.sessionsService.deleteDevicesExceptThis(userId, deviceId)
        if (!result) return res.sendStatus(401)
        return res.sendStatus(204)
    }

    async deleteSessionDevice(req: RequestParamsSecurityDevicesType<{ deviceId: string }>, res: Response) {
        const deviceIdWithParams = req.params.deviceId
        if (!deviceIdWithParams) return res.sendStatus(404)
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.sendStatus(401)
        const expiredOrNot = await this.jwtService.getPayloadByToken(refreshToken)
        if (!expiredOrNot) return res.sendStatus(401)
        const {userId} = expiredOrNot
        const receiveDeviceByDeviceId = await this.sessionsService.getDeviceByDeviceId(deviceIdWithParams)
        if (!receiveDeviceByDeviceId) return res.sendStatus(404)
        if (userId !== receiveDeviceByDeviceId.userId) return res.sendStatus(403)
        const result = await this.sessionsService.deleteSessionDevice(userId, deviceIdWithParams)
        if (!result) return res.sendStatus(401)
        return res.sendStatus(204)
    }
}

export const securityDevicesControllerInstance = new securityDevicesController(jwtService, sessionsService)