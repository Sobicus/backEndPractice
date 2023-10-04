import {client, dataBaseName} from "./db";
import {ObjectId} from "mongodb";


type UsersInputType = {
    login: string
    password: string
    email: string
    createdAt: string
}
export type UsersOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}
export type UsersRepositoryType = {
    _id: string
    login: string
    password: string
    email: string
    createdAt: string
}
type UsersViewModelType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UsersOutputType[]
}

export class UsersRepository {
    async findAllUsers(): Promise<UsersViewModelType> {
        const users = await client.db(dataBaseName).collection<UsersOutputType>('users').find({}).toArray()
        return {
            pagesCount: 1,
            page: 1,
            pageSize: 1,
            totalCount: 1,
            items: users
        }
    }

    async createUser(createUserModel: UsersInputType): Promise<string> {
        const _id = new ObjectId().toString()
        const resultCreatedUser = await client.db(dataBaseName)
            .collection<UsersRepositoryType>('users')
            .insertOne({...createUserModel, _id})
        return resultCreatedUser.insertedId.toString()
    }

    async deleteUser(userId: string) {
        const resultDeleteUser = await client.db(dataBaseName)
            .collection<UsersRepositoryType>('users')
            .deleteOne({_id: new ObjectId(userId)})
        return resultDeleteUser.deletedCount === 1
    }
    }
}