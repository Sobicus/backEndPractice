import mongoose, {Schema, Types} from "mongoose";

export interface IUser{
    _id: Types.ObjectId,
    login: string,
    passwordSalt: string,
    passwordHash: string,
    email: string,
    createdAt: string,
    emailConfirmation: {
        confirmationCode: string,
        expirationDate: Date,
        isConfirmed: boolean,
    }
}
export const usersSchema = new mongoose.Schema<IUser>({
    _id: {type: Schema.Types.ObjectId, required: true},
    login: {type: String, required: true},
    passwordSalt: {type: String, required: true},
    passwordHash: {type: String, required: true},
    email: {type: String, required: true},
    createdAt: {type: String, required: true},
    emailConfirmation: {
        type: {
            confirmationCode: {type: String, required: true},
            expirationDate: {type: Date, required: true},
            isConfirmed: {type: Boolean, required: true},
        }, required: true
    }
})