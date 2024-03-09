import {body} from "express-validator";
import {usersService} from "../composition-root";
import {inputVal} from "./errorValidator";

export const registrationConfirmationCodeCheck = [
    body('code')
        .custom(async (code) => {
            const checkUser = await usersService.findUserByConfirmationCode(code)
            if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
            return true
        }),
    inputVal
]