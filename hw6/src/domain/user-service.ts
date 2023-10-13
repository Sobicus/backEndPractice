import bcrypt from "bcrypt"
import {UsersRepository, UsersOutputType, UserServiceType} from "../repositories/users-repository";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";

export class UsersService {
    userRepo: UsersRepository

    constructor() {
        this.userRepo = new UsersRepository()
    }

    async findAllPosts(pagination: IQueryUsersPagination) {
        return await this.userRepo.findAllUsers(pagination)
    }

    async createUser(login: string, password: string, email: string): Promise<UsersOutputType> {

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const createdAt = new Date().toISOString()
        let createUserModel: UserServiceType = {
            login,
            passwordSalt,
            passwordHash,
            email,
            createdAt
        }
        const id = await this.userRepo.createUser(createUserModel)
        return {id, login, email, createdAt}
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepo.deleteUser(userId)

    }

    async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        console.log('hashPassword ' + hash)
        return hash
    }

    async checkCredentials(loginOrMail: string, password: string): Promise<boolean> {
        const user = await this.userRepo.findByLoginOrEmail(loginOrMail)
        if (!user) return false
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        return user.passwordHash === passwordHash;
    }
}

export const userService = new UsersService()
