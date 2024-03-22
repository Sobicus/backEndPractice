import {SessionsRepository} from "../repositories/sessions-repository";
import jwt from "jsonwebtoken";
import { allActiveSessionDbType, allActiveSessionViewType } from "../types/sessions-repository-types";
import {injectable} from "inversify";

@injectable()
export class SessionsService {
    sessionsRepo: SessionsRepository
    constructor(sessionsRepository: SessionsRepository) {
        this.sessionsRepo = sessionsRepository
    }

    async createDeviceSession(refreshToken: string, ip: string, deviceName: string): Promise<boolean> {
        const decodeJwtRefreshToken: any = jwt.decode(refreshToken)

        const userId: string = decodeJwtRefreshToken['userId']
        const deviceId: string = decodeJwtRefreshToken['deviceId'];
        const iat: number = decodeJwtRefreshToken['iat']
        const issuedAt = new Date(iat * 1000).toISOString()
        console.log('issuedAt session-service', issuedAt)
        return this.sessionsRepo.createDeviceSession(issuedAt, deviceId, ip, deviceName, userId)
    }

    async getAllDeviceSessions(userId: string): Promise<allActiveSessionViewType[]> {
        return this.sessionsRepo.getAllActiveSessions(userId)
    }

    async updateSession(refreshToken: string): Promise<boolean> {
        const decodeJwtRefreshToken: any = jwt.decode(refreshToken)
        const deviceId: string = decodeJwtRefreshToken['deviceId'];
        const iat: number = decodeJwtRefreshToken['iat']
        const issuedAt = new Date(iat * 1000).toISOString();
        return await this.sessionsRepo.updateSession(deviceId, issuedAt)

    }

    async deleteSessionDevice(userId: string, deviceId: string): Promise<boolean> {
        return await this.sessionsRepo.deleteSessionDevice(userId, deviceId)
    }

    async deleteDevicesExceptThis(userId: string, deviceId: string): Promise<boolean> {
        return await this.sessionsRepo.deleteDevicesExceptThis(userId, deviceId)
    }

    async getDeviceByDeviceId(deviceId: string): Promise<allActiveSessionDbType | null> {
        return await this.sessionsRepo.getDeviceByDeviceId(deviceId)
    }

    async getSessionByUserIdAndDeviceId(userId: string, deviceId: string) {
        return await this.sessionsRepo.getSessionByUserIdAndDeviceId(userId, deviceId)
    }
}