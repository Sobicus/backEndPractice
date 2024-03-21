import {ObjectId} from "mongodb";
import {SessionsModel} from "./db";
import { allActiveSessionDbType, allActiveSessionViewType } from "../types/sessions-repository-types";
import {injectable} from "inversify";

@injectable()
export class SessionsRepository {
    async createDeviceSession(issuedAt: string, deviceId: string, ip: string, deviceName: string, userId: string): Promise<boolean> {
        const newSession = {issuedAt, deviceId, ip, deviceName, userId}
        const result = await SessionsModel
            .create({_id: new ObjectId(), ...newSession})
        console.log('newSession', newSession)
        console.log('newSession  result._id !== undefined', result._id !== undefined)
        // return result.acknowledged
        return result._id !== undefined
    }

    async getAllActiveSessions(userId: string): Promise<allActiveSessionViewType[]> {
        const sessins = await SessionsModel
            .find({userId}).lean()
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
        const result = await SessionsModel
            .updateOne({deviceId}, {$set: {issuedAt}})//?????
        return result.acknowledged
    }

    async deleteDevicesExceptThis(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionsModel
            .deleteMany({
                userId,
                deviceId: {$ne: deviceId}
            });
        return result.acknowledged
    }

    async deleteSessionDevice(userId: string, deviceId: string): Promise<boolean> {
        const result = await SessionsModel
            .deleteOne({userId, deviceId})
        return result.acknowledged
    }

    async getDeviceByDeviceId(deviceId: string): Promise<allActiveSessionDbType | null> {
        const deviceByDeviceId = await SessionsModel
            // .findOne({deviceId}).select('_id issuedAt deviceId ip deviceName userId')
            // .findOne({deviceId}, {_id:1, issuedAt:1, deviceId:1, ip:1, deviceName:1, userId:1,}).lean()
            .findOne({deviceId})
        if (!deviceByDeviceId) return null
        return {
            _id: deviceByDeviceId._id,
            issuedAt: deviceByDeviceId.issuedAt,
            deviceId: deviceByDeviceId.deviceId,
            ip: deviceByDeviceId.ip,
            deviceName: deviceByDeviceId.deviceName,
            userId: deviceByDeviceId.userId
        }
        // return deviceByDeviceId
    }

    async getSessionByUserIdAndDeviceId(userId: string, deviceId: string) {
        const result = SessionsModel
            .findOne({userId, deviceId})
        return result
    }

}



// refreshTokenPayload = { deviceId, userId, iat, exp}