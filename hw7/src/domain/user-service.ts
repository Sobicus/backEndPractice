import bcrypt from "bcrypt"
import {UsersRepository, UsersOutputType, UserServiceType, UsersDbType} from "../repositories/users-repository";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {ObjectId} from "mongodb";

class UsersService {
    userRepo: UsersRepository

    constructor() {
        this.userRepo = new UsersRepository()
    }

    async findAllUsers(pagination: IQueryUsersPagination) {
        return await this.userRepo.findAllUsers(pagination)
    }

    async createUser(login: string, password: string, email: string): Promise<string>/*: Promise<UsersOutputType>*/ {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(password, passwordSalt)

        const createdAt = new Date().toISOString()
        let createUserModel: UserServiceType = {
            login,
            passwordSalt,
            passwordHash,
            email,
            createdAt,
            emailConfirmation: {
                confirmationCode: randomUUID(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 1,
                    seconds: 1
                }),
                isConfirmed: false
            }
        }
        const id = await this.userRepo.createUser(createUserModel)
        // return {id, login, email, createdAt}
        return createUserModel.emailConfirmation.confirmationCode
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepo.deleteUser(userId)
    }

    async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        console.log('hashPassword ' + hash)
        return hash
    }

    async checkCredentials(loginOrMail: string, password: string): Promise<null | UserServiceType> {
        const user = await this.userRepo.findByLoginOrEmail(loginOrMail)
        if (!user) return null
        if (!user.emailConfirmation.isConfirmed) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        //return user.passwordHash === passwordHash; // if this true return users
        // return user._id.toString()
        if (user.passwordHash !== passwordHash) return null
        return user
    }

    async findUserById(userId: string): Promise<UsersOutputType | null> {
        return await this.userRepo.findUserById(userId)
    }

    async findUserByConfirmationCode(confirmationCode: string): Promise<UsersDbType | null> {
        return await this.userRepo.findUserByConfirmationCode(confirmationCode)
    }

    async updateConfirmation(id: ObjectId): Promise<boolean> {
        return await this.userRepo.updateConfirmation(id)
    }

    async findUserByEmail(email: string): Promise<UserServiceType | null> {
       return  await this.userRepo.findByLoginOrEmail(email)
    }
}

export const userService = new UsersService()
