import {body} from "express-validator";
import {inputVal} from "./errorValidator";
import {container} from "../composition-root";
import {UsersService} from "../domain/user-service";

const usersService= container.resolve(UsersService)

export const registrationConfirmationCodeCheck = [
    body('code')
        .custom(async (code) => {
            const checkUser = await usersService.findUserByConfirmationCode(code)
            if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
            return true
        }),
    inputVal
]