import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";

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
    password: string
    email: string
    createdAt: string
}

// in db:
export type UsersDbType = {
    _id: ObjectId
    login: string
    password: string
    email: string
    createdAt: string
}

export type PaginationType<I> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: I
}

export class UsersRepository {
    async findAllUsers(): Promise<PaginationType<UsersOutputType[]>> {
        const users = await client.db(dataBaseName)
            .collection</*UsersOutputType*/ UsersDbType>('users')
            .find({})
            .toArray()
        return {
            pagesCount: 1,
            page: 1,
            pageSize: 1,
            totalCount: 1,
            items: users.map(u => ({
                id: u._id.toString(),
                login: u.login,
                email: u.email,
                createdAt: u.createdAt
            }))
        }
    }

    async createUser(createUserModel: UserServiceType): Promise<string> {

        const resultCreatedUser = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .insertOne({_id: new ObjectId(),...createUserModel})
        return resultCreatedUser.insertedId.toString()
    }

    async deleteUser(userId: string):Promise<boolean> {
        const resultDeleteUser = await client.db(dataBaseName)
            .collection<UsersDbType>('users')
            .deleteOne({_id: new ObjectId(userId)})
        return resultDeleteUser.deletedCount === 1
    }
}