import {userService} from "./user-service";
import {emailAdapter} from "../adapters/email-adapter";

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

    async confirmEmail(code: string) {
        const user = await userService.findUserByCode(code)
        if(!user){return false}
        if(user.emailConfirmation.confirmationCode=== code && user.emailConfirmation.expirationDate>new Date()){

        }
        return user
    }
}

export const authService = new AuthService()