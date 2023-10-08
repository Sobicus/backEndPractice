import {UsersRepository, UsersOutputType, UserServiceType} from "../repositories/users-repository";
import {ObjectId} from "mongodb";

export class UsersService {
    userRepo: UsersRepository

    constructor() {
        this.userRepo = new UsersRepository()
    }

    async findAllPosts() {
        return await this.userRepo.findAllUsers()
    }

    async createUser(login: string, passwordOut: string, email: string): Promise<UsersOutputType> {
        const createdAt = new Date().toISOString()
        let createUserModel: UserServiceType = {login, password: passwordOut, email, createdAt}
        const id = await this.userRepo.createUser(createUserModel)
        return {id, login, email, createdAt}
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepo.deleteUser(userId)
    }
}

export const userService = new UsersService()
