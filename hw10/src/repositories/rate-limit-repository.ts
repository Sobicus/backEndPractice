import {ObjectId, WithId} from "mongodb";

export class RateLimitRepository {
    async createNewRateSession(ip: string, path: string, date: number): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<RateSessionsDBType>('rateSessions')
            .insertOne({_id: new ObjectId(), ip, path, date})
        console.log('repo', result.acknowledged)
        return result.acknowledged
    }

    async getAllRateSessionsTimeRange(ip: string, path: string, requestDate: number): Promise<number> {
        const result = await client.db(dataBaseName)
            .collection<RateSessionsDBType>('rateSessions')
            .countDocuments({date: {$gte: Date.now() - 10000},  ip, path})

        return result
    }
    async deleteRateSessionsTimeRange(): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<RateSessionsDBType>('rateSessions')
            .deleteMany({date: {$lte: Date.now() - 10000}})

        return result.acknowledged
    }
}

export type RateSessionsDBType = {
    _id: ObjectId
    ip: string
    path: string
    date: number
}