import {ObjectId} from "mongodb";
import {PaginationType} from "../types/paggination-type";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";
import {UsersModel} from "./db";
import { UsersOutputType } from "../types/user-types";

export class UsersQueryRepository {
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
}
export const usersQueryRepository = new UsersQueryRepository()