import {randomUUID} from "crypto";
import {allActiveSessionViewType, SessionRepository} from "../repositories/session-repository";
import jwt from "jsonwebtoken";

class SessionService {
    sessionsRepo: SessionRepository

    constructor() {
        this.sessionsRepo = new SessionRepository()
    }

    createDeviceSession(refreshToken: string, ip: string, deviceName: string): Promise<boolean> {
        const decodeJwtRefreshToken = jwt.decode(refreshToken)
        const userId = decodeJwtRefreshToken['userId']
        const iat = decodeJwtRefreshToken['iat']
        const deviceId = randomUUID()
        return this.sessionsRepo.createDeviceSession(iat, deviceId, ip, deviceName, userId)
    }

    getAllDeviceSessions(): Promise<allActiveSessionViewType[]> {
        return this.sessionsRepo.getAllActiveSessions()
    }
}

export const sessionService = new SessionService()