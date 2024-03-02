import {ObjectId} from "mongodb";
import {UsersModel} from "./db";
import {UserServiceType, UsersDbType, UsersViewType } from "../types/user-types";




export class UsersRepository {
    async createUser(createUserModel: UserServiceType): Promise<string> {
        const resultCreatedUser = await UsersModel
            .create({_id: new ObjectId(), ...createUserModel})
        return resultCreatedUser._id.toString()
    }

    async deleteUser(userId: string): Promise<boolean> {
        const resultDeleteUser = await UsersModel
            .deleteOne({_id: new ObjectId(userId)})
        return resultDeleteUser.deletedCount === 1
    }

    async findByLoginOrEmail(loginOrMail: string): Promise<UserServiceType | null> {
        const user = await UsersModel
            .findOne({
                $or: [{login: loginOrMail}, {email: loginOrMail}]
            })
        return (user ? {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
            passwordHash: user.passwordHash,
            passwordSalt: user.passwordSalt,
            emailConfirmation: {
                confirmationCode: user.emailConfirmation.confirmationCode,
                expirationDate: user.emailConfirmation.expirationDate,
                isConfirmed: user.emailConfirmation.isConfirmed
            }
        } : null)
    }


    async findUserById(userId: string): Promise<UsersDbType | null> {
        const user = await UsersModel
            .findOne({_id: new ObjectId(userId)})
        if (!user) {
            return null
        }
        return user
       /* {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }*/
    }


    async findUserByConfirmationCode(confirmationCode: string): Promise<UsersDbType | null> {
        const user = await UsersModel
            .findOne({'emailConfirmation.confirmationCode': confirmationCode})
        if (!user) return null
        return user
    }

    async updateConfirmation(id: ObjectId): Promise<boolean> {
        const result = await UsersModel
            .updateOne({_id: id}, {$set: {'emailConfirmation.isConfirmed': true}})
        return result.matchedCount === 1
    }

    async updateCodeAfterResend(id: string, newCode: string) {
        const result = await UsersModel
            .updateOne({_id: new ObjectId(id)}, {$set: {'emailConfirmation.confirmationCode': newCode}})
        return result.matchedCount === 1
    }
    async changePassword(userId:string, passwordSalt:string,passwordHash:string):Promise<boolean>{
        const result = await UsersModel
            .updateOne({_id: new ObjectId(userId)}, {$set: {passwordSalt,passwordHash}})
        return result.matchedCount === 1
    }
}