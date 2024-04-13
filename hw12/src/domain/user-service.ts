import bcrypt from "bcrypt"
import {UsersRepository} from "../repositories/users-repository";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {ObjectId} from "mongodb";
import {UserServiceType, UsersDbType, UsersViewType} from "../types/user-types";
import {injectable} from "inversify";
import {UserAccountDBMethodsType, UserHydrationSchema, UserModelType} from "../schemaMongoose/users-schema";
import {HydratedDocument} from "mongoose";

@injectable()
export class UsersService {
    userRepository: UsersRepository

    constructor(userRepository: UsersRepository) {
        this.userRepository = userRepository
    }

    async createUser(login: string, password: string, email: string): Promise<UsersViewType>/*: Promise<UsersOutputType>*/ {
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
        const id = await this.userRepository.createUser(createUserModel)
        return {id, login, email, createdAt}
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepository.deleteUser(userId)
    }

    async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    async checkCredentials(loginOrMail: string, password: string): Promise<null | UserServiceType> {
        const user = await this.userRepository.findByLoginOrEmail(loginOrMail)
        if (!user) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        if (user.passwordHash !== passwordHash) return null
        return user
    }


    async findUserById(userId: string): Promise<UsersDbType | null> {
        return await this.userRepository.findUserById(userId)
    }

    async findUserByConfirmationCode(confirmationCode: string): Promise<UserHydrationSchema | null> {
        return await this.userRepository.findUserByConfirmationCode(confirmationCode)
    }

    async updateConfirmation(id: ObjectId): Promise<boolean> {
        return await this.userRepository.updateConfirmation(id)
    }

    async updateCodeAfterResend(id: string, newCode: string) {
        return await this.userRepository.updateCodeAfterResend(id, newCode)
    }

    async findUserByEmailOrLogin(emailOrLogin: string): Promise<UserServiceType | null> {
        return await this.userRepository.findByLoginOrEmail(emailOrLogin)
    }

    async changePassword(userId: string, newPassword: string): Promise<boolean> {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await this._generateHash(newPassword, passwordSalt)
        return await this.userRepository.changePassword(userId, passwordSalt, passwordHash)
    }
}

