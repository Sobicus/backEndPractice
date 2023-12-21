import mongoose, { Schema } from "mongoose";
import {ObjectId} from "mongodb";

export const sessionsSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    issuedAt: {type: String, required: true},
    deviceId: {type: String, required: true},
    ip: {type: String, required: true},
    deviceName: {type: String, required: true},
    userId: {type: String, required: true},
})