import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";
import {PaginationType} from "../types/paggination-type";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";
import {randomUUID} from "crypto";
import add from "date-fns/add";

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
        /* const createFilter = (searchLoginTerm?: string, searchEmailTerm?: string) => {
             if (searchLoginTerm && searchEmailTerm) {
                 return {
                     $or: [{login: {$regex: pagination.searchLoginTerm ?? '', $options: 'i'}},
                         {email: {$regex: pagination.searchEmailTerm ?? '', $options: 'i'}}]
                 }
             }
             if (searchLoginTerm) return {login: {$regex: searchLoginTerm}}
             if (searchEmailTerm) return {email: {$regex: searchEmailTerm}}
             return {}

         }

         const filter = createFilter()*/

        const users = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .limit(pagination.pageSize)
            .skip(pagination.skip)
            .toArray()
        const allUsers = users.map(u => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt
        }))
        const totalCount = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
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

    async createUser(createUserModel: UserServiceType):
        Promise<string> {
        const resultCreatedUser = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .insertOne({_id: new ObjectId(), ...createUserModel})
        return resultCreatedUser.insertedId.toString()
    }

    async deleteUser(userId: string): Promise<boolean> {
        const resultDeleteUser = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .deleteOne({_id: new ObjectId(userId)})
        return resultDeleteUser.deletedCount === 1
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserServiceType | null> {
        const user = await client.db(dataBaseName)
            .collection<UsersDbType>('users').findOne({
                $or: [{login: loginOrEmail}, {email: loginOrEmail}]
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
        const user = await client.db(dataBaseName)
            .collection<UsersDbType>('users').findOne({_id: new ObjectId(userId)})
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

    async findUserByCode(code: string): Promise<UsersDbType | null> {
        const user = await client.db(dataBaseName)
            .collection<UsersDbType>('users').findOne({'emailConfirmation.confirmationCode': code})
        if (!user) return null
        return user
    }

    async updateConfirmation(id:ObjectId){
        const result = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .updateOne({_id:id}, {'emailConfirmation.isConfirmed': true})
    }
}