import {ObjectId} from "mongodb"
import {PasswordRecoveryModel} from "./db";

export class PasswordRecoveryRepository {
    async createPasswordRecovery(passwordRecoveryModel: PasswordRecoveryType):Promise<string|null>{
        const res = await PasswordRecoveryModel.create(passwordRecoveryModel)
        return res._id.toString()//need or not?
    }
}

export type PasswordRecoveryType = {
    _id: ObjectId
    passwordRecoveryCode: string
    codeExpirationDate: number
    email: string
    alreadyChangePassword: boolean
}