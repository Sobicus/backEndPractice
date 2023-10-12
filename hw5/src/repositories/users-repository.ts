import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";
import {PaginationType} from "../types/paggination-type";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";

//response:
export type UsersOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}
// service:
export type UserServiceType = {
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
}

// in db:
export type UsersDbType = {
    _id: ObjectId
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
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

    async findByLoginOrEmail(loginOrEmail: string): Promise<UsersDbType | null> {
        const user = await client.db(dataBaseName)
            .collection<UsersDbType>('users').findOne({
                $or: [{login: loginOrEmail}, {email: loginOrEmail}]
            })
        return user
    }
}