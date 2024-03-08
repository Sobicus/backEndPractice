import {ObjectId} from "mongodb";

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