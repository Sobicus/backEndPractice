import {RateLimitRepository} from "../repositories/rate-limit-repository";

export class RateLimitService {
    rateLimitRepository: RateLimitRepository

    constructor(rateLimitRepository:RateLimitRepository) {
        this.rateLimitRepository = rateLimitRepository
    }

    async createNewRateSession(ip: string, path: string, date: number): Promise<boolean> {
        return await this.rateLimitRepository.createNewRateSession(ip, path, date)
    }

    async getAllRateSessionsTimeRange(ip: string, path: string, requestDate: number): Promise<number>  {
        return await this.rateLimitRepository.getAllRateSessionsTimeRange(ip,path, requestDate)
    }
}