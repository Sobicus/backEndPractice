import {randomUUID} from "crypto";
import {SessionRepository} from "../repositories/session-repository";

class SessionService {
    sessionsRepo: SessionRepository

    constructor() {
        this.sessionsRepo = new SessionRepository()
    }

    createSession(refreshToken: string, ip: string, deviceName: string, userId: string) {

        const deviceId = randomUUID()
        const issuedAt = Buffer.from(refreshToken.split('.')[1], 'base64').toString('utf-8')

        console.log('userId', userId)
    }
}

export const sessionService = new SessionService()