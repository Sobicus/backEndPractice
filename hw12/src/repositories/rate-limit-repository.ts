import {ObjectId, WithId} from "mongodb";
import {RateLimitModel} from "./db";
import {injectable} from "inversify";

@injectable()
export class RateLimitRepository {
    async createNewRateSession(ip: string, path: string, date: number): Promise<boolean> {
        const result = await RateLimitModel
            .create({_id: new ObjectId(), ip, path, date})
        console.log('RateLimitRepository createNewRateSession', result._id !== undefined)
        return result._id !== undefined
    }

    async getAllRateSessionsTimeRange(ip: string, path: string, requestDate: number): Promise<number> {
        const result = await RateLimitModel
            .countDocuments({date: {$gte: Date.now() - 10000}, ip, path})
        return result
    }

    async deleteRateSessionsTimeRange(): Promise<boolean> {
        const result = await RateLimitModel
            .deleteMany({date: {$lte: Date.now() - 10000}})
        console.log('deleteRateSessionsTimeRange result.deletedCount>0',result.deletedCount>0)
        console.log('deleteRateSessionsTimeRange', result.acknowledged)
        return result.acknowledged
    }
}

export type RateSessionsDBType = {
    _id: ObjectId
    ip: string
    path: string
    date: number
}