import {userService} from "./user-service";
import {emailAdapter} from "../adapters/email-adapter";
import {randomUUID} from "crypto";
import {UserServiceType} from "../repositories/users-repository";
import {ObjectId} from "mongodb";
import {emailPasswordRecoveryAdapter} from "../adapters/email-passwordRecoveryAdapter";
import {PasswordRecoveryRepository, PasswordRecoveryType} from "../repositories/passwordRecovery-repository";
import bcrypt from "bcrypt";

class AuthService {
    passwordRecoveryRepo: PasswordRecoveryRepository

    constructor() {
        this.passwordRecoveryRepo = new PasswordRecoveryRepository()
    }

    async createUser(login: string, password: string, email: string): Promise<boolean | null> {
        /*const checkUser = await userService.findUserByLoginOrEmail(login, email)
        if(checkUser)return null*/
        await userService.createUser(login, password, email)
        const confirmationCode = await userService.findUserByEmailOrLogin(email)
        try {
            await emailAdapter.sendEmail(email, confirmationCode!.emailConfirmation.confirmationCode)
        } catch (error) {
            console.log(error)
            //await userService.deleteUser(newUser.id)
            return null
        }
        return true
    }

    async confirmEmail(confirmationCode: string): Promise<boolean> {
        const user = await userService.findUserByConfirmationCode(confirmationCode)
        console.log('user', user)
        console.log('user', user)
        if (!user) return false
        if (!user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== confirmationCode) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await userService.updateConfirmation(user._id)
        return result
    }

    async resendingRegistrationEmail(email: string): Promise<boolean | null> {
        const user = await userService.findUserByEmailOrLogin(email)
        if (!user) return null
        if (user.emailConfirmation.isConfirmed) return null
        const newCode = randomUUID()
        await userService.updateCodeAfterResend(user.id!, newCode)
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
            await this.passwordRecoveryRepo.createPasswordRecovery({
                _id: idPasswordRecovery,
                passwordRecoveryCode,
                codeExpirationDate,
                userId,
                alreadyChangePassword
            })
            await emailPasswordRecoveryAdapter.sendEmail(user.email, passwordRecoveryCode)
        } catch (error) {
            console.log(error)
            //await userService.deleteUser(newUser.id)
            return null
        }
        return
    }

    async findPasswordRecoveryCodeByCode(recoveryCode: string): Promise<PasswordRecoveryType | null> {
        const result = await this.passwordRecoveryRepo.findPasswordRecoveryByCode(recoveryCode)
        return result
    }

    async newPassword(newPassword: string, recoveryCode: string): Promise<boolean | null> {
        const result = await this.passwordRecoveryRepo.findPasswordRecoveryByCode(recoveryCode)
        const changePassword = await userService.changePassword(result!.userId, newPassword)
        if (!changePassword) return null
        return await this.passwordRecoveryRepo.changePasswordRecoveryStatus(recoveryCode)
    }
}

export const authService = new AuthService()