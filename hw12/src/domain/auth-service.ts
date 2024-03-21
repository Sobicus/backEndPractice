import {emailAdapter} from "../adapters/email-adapter";
import {randomUUID} from "crypto";
import {ObjectId} from "mongodb";
import {emailPasswordRecoveryAdapter} from "../adapters/email-passwordRecoveryAdapter";
import {PasswordRecoveryRepository} from "../repositories/passwordRecovery-repository";
import {UserServiceType} from "../types/user-types";
import {UsersService} from "./user-service";
import { PasswordRecoveryType } from "../types/passwordRecovery-repository-types";
import {injectable} from "inversify";

@injectable()
export class AuthService {
    usersService: UsersService
    passwordRecoveryRepository: PasswordRecoveryRepository

    constructor(usersService: UsersService, passwordRecoveryRepository: PasswordRecoveryRepository) {
        this.usersService = usersService
        this.passwordRecoveryRepository = passwordRecoveryRepository
    }

    async createUser(login: string, password: string, email: string): Promise<boolean | null> {
        /*const checkUser = await userService.findUserByLoginOrEmail(login, email)
        if(checkUser)return null*/
        await this.usersService.createUser(login, password, email)
        const confirmationCode = await this.usersService.findUserByEmailOrLogin(email)
        try {
            await emailAdapter.sendEmail(email, confirmationCode!.emailConfirmation.confirmationCode)
        } catch (error) {
            console.log(error)
            return null
        }
        return true
    }

    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const user = await this.usersService.findUserByConfirmationCode(confirmationCode)
        console.log('user', user)
        console.log('user', user)
        if (!user) return false
        if (!user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== confirmationCode) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await this.usersService.updateConfirmation(user._id)
        return result
    }

    async resendingRegistrationEmail(email: string): Promise<boolean | null> {
        const user = await this.usersService.findUserByEmailOrLogin(email)
        if (!user) return null
        if (user.emailConfirmation.isConfirmed) return null
        const newCode = randomUUID()
        await this.usersService.updateCodeAfterResend(user.id!, newCode)
        try {
            await emailAdapter.sendEmail(email, newCode/*user.emailConfirmation.confirmationCode*/)
        } catch (error) {
            console.log(error)
            return null
        }
        return true
    }

    async passwordRecovery(user: UserServiceType) {
        const idPasswordRecovery = new ObjectId()
        const passwordRecoveryCode = randomUUID()
        const codeExpirationDate = Date.now() + 1000 * 60 * 60 // 60 min
        const userId = user.id!
        const alreadyChangePassword = false
        try {
            await this.passwordRecoveryRepository.createPasswordRecovery({
                _id: idPasswordRecovery,
                passwordRecoveryCode,
                codeExpirationDate,
                userId,
                alreadyChangePassword
            })
            await emailPasswordRecoveryAdapter.sendEmail(user.email, passwordRecoveryCode)
        } catch (error) {
            console.log(error)
            return null
        }
        return
    }

    async findPasswordRecoveryCodeByCode(recoveryCode: string): Promise<PasswordRecoveryType | null> {
        const result = await this.passwordRecoveryRepository.findPasswordRecoveryByCode(recoveryCode)
        return result
    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean | null> {
        const result = await this.passwordRecoveryRepository.findPasswordRecoveryByCode(recoveryCode)
        const changePassword = await this.usersService.changePassword(result!.userId, newPassword)
        if (!changePassword) return null
        return await this.passwordRecoveryRepository.changePasswordRecoveryStatus(recoveryCode)
    }
}

