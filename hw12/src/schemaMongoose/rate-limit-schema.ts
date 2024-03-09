import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const rateLimitSchema = new mongoose.Schema({
    _id: {type: ObjectId, required: true},
    ip: {type: String, required: true},
    path: {type: String, required: true},
    date: {type: Number, required: true}
})