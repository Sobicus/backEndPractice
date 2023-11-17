import {userService} from "./user-service";
import {emailAdapter} from "../adapters/email-adapter";
import {UserServiceType} from "../repositories/users-repository";

class AuthService {
    async createUser(login: string, password: string, email: string): Promise<string | null> {
        const confirmationCode = await userService.createUser(login, password, email)
        try {
            await emailAdapter.sendEmail(email, confirmationCode)
        } catch (error) {
            console.log(error)
            //await userService.deleteUser(newUser.id)
            return null
        }
        return confirmationCode
    }

    async confirmEmail(confirmationCode: string):Promise<boolean> {
        const user = await userService.findUserByConfirmationCode(confirmationCode)
        if (!user) return false
        if (user.emailConfirmation.confirmationCode) return false
        if (user.emailConfirmation.confirmationCode !== confirmationCode) return false
        if (user.emailConfirmation.expirationDate < new Date()) return false
        let result = await userService.updateConfirmation(user._id)
        return result
    }
    async resendingRegistrationEmail(email:string): Promise<boolean | null>{
        const result = await userService.findUserByEmail(email)
        if(!result) return null
        if(result.emailConfirmation.isConfirmed) return null
        try{
            await emailAdapter.sendEmail(email, result.emailConfirmation.confirmationCode)
        }catch (error){
            console.log(error)
            return null
        }
        return true
    }
}

export const authService = new AuthService()