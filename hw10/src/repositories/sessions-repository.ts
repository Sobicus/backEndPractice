import {ObjectId} from "mongodb";

export class SessionsRepository {
    async createDeviceSession(issuedAt: string, deviceId: string, ip: string, deviceName: string, userId: string): Promise<boolean> {
        const newSession = {issuedAt, deviceId, ip, deviceName, userId}
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .insertOne({_id: new ObjectId(), ...newSession})
        console.log('result.acknowledged', result.acknowledged)
        console.log('newSession', newSession)
        return result.acknowledged
    }

    async getAllActiveSessions(userId:string): Promise<allActiveSessionViewType[]> {
        const sessins = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions').find({userId}).toArray()
        const allActiveSessInDb = sessins.map(s => {
            return {
                ip: s.ip,
                title: s.deviceName,
                lastActiveDate: s.issuedAt,
                deviceId: s.deviceId,
            }
        })
        return allActiveSessInDb
    }

    async updateSession(deviceId: string, issuedAt: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .updateOne({deviceId}, {$set: {issuedAt}})//?????
        return result.acknowledged
    }

    async deleteDevicesExceptThis(userId: string, deviceId: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions').deleteMany({
                userId,
                deviceId: {$ne: deviceId}
            });
        return result.acknowledged
    }

    async deleteSessionDevice(userId: string, deviceId: string): Promise<boolean> {
        const result = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .deleteOne({userId, deviceId})
        return result.acknowledged
    }

    async getDeviceByDeviceId(deviceId: string): Promise<allActiveSessionDbType | null> {
        const deviceByDeviceId = await client.db(dataBaseName)
            .collection<allActiveSessionDbType>('sessions')
            .findOne({deviceId})
        if(!deviceByDeviceId)return null
        return {
            _id: deviceByDeviceId._id,
            issuedAt: deviceByDeviceId.issuedAt,
            deviceId: deviceByDeviceId.deviceId,
            ip: deviceByDeviceId.ip,
            deviceName: deviceByDeviceId.deviceName,
            userId: deviceByDeviceId.userId
        }
    }
    async getSessionByUserIdAndDeviceId(userId:string,deviceId:string){
        const result = client.db(dataBaseName)
            .collection('sessions')
            .findOne({userId, deviceId})
        return result
    }

}

export type allActiveSessionDbType = {
    _id: ObjectId
    issuedAt: string // = iat
    deviceId: string
    ip: string
    deviceName: string
    userId: string
}
export type allActiveSessionViewType = {
    ip: string
    title: string// = deviceName
    lastActiveDate: string // = iat
    deviceId: string
}

// refreshTokenPayload = { deviceId, userId, iat, exp}