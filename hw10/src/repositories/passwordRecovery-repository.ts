import {ObjectId} from "mongodb"
import {PasswordRecoveryModel} from "./db";

export class PasswordRecoveryRepository {
    async createPasswordRecovery(passwordRecoveryModel: PasswordRecoveryType) {
        await PasswordRecoveryModel.create(passwordRecoveryModel)
        return
    }

    async findPasswordRecoveryByCode(passwordRecoveryCode: string): Promise<PasswordRecoveryType | null> {
        const result = await PasswordRecoveryModel
            .findOne({passwordRecoveryCode}).lean()
        if (!result) return null
        return result
    }

    async changePasswordRecoveryStatus(passwordRecoveryCode: string): Promise<boolean> {
        const result = await PasswordRecoveryModel.updateOne({passwordRecoveryCode}, {$set: {alreadyChangePassword: true}})
        return result.matchedCount === 1
    }
}

export type PasswordRecoveryType = {
    _id: ObjectId
    passwordRecoveryCode: string
    codeExpirationDate: number
    userId: string
    alreadyChangePassword: boolean
}