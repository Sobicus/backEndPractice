import mongoose, {Schema} from "mongoose";
import {ObjectId} from "mongodb";

export const usersSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    login: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {
        type: {
            confirmationCode: {type: ObjectId, required: true},
            expirationDate: {type: Date, required: true},
            isConfirmed: {type: Boolean, required: true},
        }, required: true
    }
})