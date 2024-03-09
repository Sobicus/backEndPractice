import bcrypt from "bcrypt"
import {UsersRepository} from "../repositories/users-repository";
import {randomUUID} from "crypto";
import add from "date-fns/add";
import {ObjectId} from "mongodb";
import {UserServiceType, UsersDbType, UsersViewType} from "../types/user-types";

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
        // return createUserModel.emailConfirmation.confirmationCode
    }

    async deleteUser(userId: string): Promise<boolean> {
        return await this.userRepository.deleteUser(userId)
    }

    async _generateHash(password: string, salt: string): Promise<string> {
        const hash = await bcrypt.hash(password, salt)
        console.log('hashPassword ' + hash)
        return hash
    }

    async checkCredentials(loginOrMail: string, password: string): Promise<null | UserServiceType> {
        const user = await this.userRepository.findByLoginOrEmail(loginOrMail)
        if (!user) return null
        //if (!user.emailConfirmation.isConfirmed) return null
        const passwordHash = await this._generateHash(password, user.passwordSalt)
        //return user.passwordHash === passwordHash; // if this true return users
        // return user._id.toString()
        if (user.passwordHash !== passwordHash) return null
        return user
    }

//
    async findUserById(userId: string): Promise<UsersDbType | null> {
        return await this.userRepository.findUserById(userId)
    }

    async findUserByConfirmationCode(confirmationCode: string): Promise<UsersDbType | null> {
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

    /*async findUserByLoginOrEmail(login:string,email:string):Promise<UsersDbType | null>{
        return await this.userRepo.findUserByLoginOrEmail(login,email)
    }*/
}

