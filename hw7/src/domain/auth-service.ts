import {userService} from "./user-service";

class AuthService {
    async createUser(login: string, password: string, email: string) {
        await userService.createUser(login, password, email)
    }
}

export const authService = new AuthService()