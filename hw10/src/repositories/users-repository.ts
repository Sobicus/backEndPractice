import {ObjectId} from "mongodb";
import {PaginationType} from "../types/paggination-type";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";
import {UsersModel} from "./db";


//response:
export type UsersOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}
// service:
export type UserServiceType = {
    id?: string
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
    emailConfirmation: EmailConfirmation
}
export type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}
// in db:
export type UsersDbType = {
    _id: ObjectId
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
    emailConfirmation: EmailConfirmation
}

export class UsersRepository {
    async findAllUsers(pagination: IQueryUsersPagination): Promise<PaginationType<UsersOutputType>> {
        const filter = {
            $or: [{login: {$regex: pagination.searchLoginTerm ?? '', $options: 'i'}},
                {email: {$regex: pagination.searchEmailTerm ?? '', $options: 'i'}}]
        }

        const users = await UsersModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .limit(pagination.pageSize)
            .skip(pagination.skip)
            .lean()
        const allUsers = users.map(u => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt
        }))
        const totalCount = await UsersModel
            .countDocuments(filter)
        const pageCount = Math.ceil(totalCount / pagination.pageSize)
        return {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: allUsers
        }
    }

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

    async findUserById(userId: string): Promise<UsersOutputType | null> {
        const user = await UsersModel
            .findOne({_id: new ObjectId(userId)})
        if (!user) {
            return null
        }
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }
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
}