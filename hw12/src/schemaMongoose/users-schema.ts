import mongoose, {HydratedDocument, Model, Schema, Types} from "mongoose";
import {UsersDbType} from "../types/user-types";

export interface IUser {
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

//extension of mangun methods
//after
export type UserAccountDBMethodsType = {
    canBeConfirmed: (confirmationCode:string) => boolean
}
export type UserModelType = Model<IUser, {}, UserAccountDBMethodsType>

export const usersSchema = new mongoose.Schema<IUser, UserModelType, UserAccountDBMethodsType>({
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
usersSchema.method('canBeConfirmed', function canBeConfirmed(confirmationCode:string){
    const that = this as IUser
        return that.emailConfirmation.confirmationCode !== confirmationCode
})
export type UserHydrationSchema=HydratedDocument<UsersDbType,UserAccountDBMethodsType>
// before
// export const usersSchema = new mongoose.Schema<IUser>({
//     _id: {type: Schema.Types.ObjectId, required: true},
//     login: {type: String, required: true},
//     passwordSalt: {type: String, required: true},
//     passwordHash: {type: String, required: true},
//     email: {type: String, required: true},
//     createdAt: {type: String, required: true},
//     emailConfirmation: {
//         type: {
//             confirmationCode: {type: String, required: true},
//             expirationDate: {type: Date, required: true},
//             isConfirmed: {type: Boolean, required: true},
//         }, required: true
//     }
// })