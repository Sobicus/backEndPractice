import {ObjectId} from "mongodb";

export type PasswordRecoveryType = {
    _id: ObjectId
    passwordRecoveryCode: string
    codeExpirationDate: number
    userId: string
    alreadyChangePassword: boolean
}