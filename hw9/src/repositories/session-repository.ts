import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";

export class SessionRepository {
    async getAllActiveSessions() {
        const sessins = await client.db(dataBaseName)
            .collection<allActiveSessinDbType>('sessions').find({}).toArray()
        const allActiveSessinDb = sessins.map(s => {
            return {
                ip: s.ip,
                title: s.deviceName,
                lastActiveDate: s.issuedAt,
                deviceId: s.deviceId,
            }
        })
        return allActiveSessinDb
    }

}

type allActiveSessinDbType = {
    _id: ObjectId
    issuedAt: string
    deviceId: string
    ip: string
    deviceName: string
    userId: string
}