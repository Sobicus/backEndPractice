import {RateLimitRepository, RateSessionsDBType} from "../repositories/rate-limit-repository";

class RateLimitService {
    reteLimitRepo: RateLimitRepository

    constructor() {
        this.reteLimitRepo = new RateLimitRepository
    }

    async createNewRateSession(ip: string, path: string, date: number): Promise<boolean> {
        return await this.reteLimitRepo.createNewRateSession(ip, path, date)
    }

    async getAllRateSessionsTimeRange(ip: string, path: string, requestDate: number): Promise<number>  {
        return await this.reteLimitRepo.getAllRateSessionsTimeRange(ip,path, requestDate)
    }

}

export const rateLimitService = new RateLimitService()