import {body} from "express-validator";
import {inputVal} from "./errorValidator";
import {container} from "../composition-root";
import {UsersService} from "../domain/user-service";

const usersService = container.resolve(UsersService)

export const registrationEmailResending = [
    body('email')
        .isString().withMessage('Email not a string')
        .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com')
        .custom(async (email) => {
            const checkUser = await usersService.findUserByEmailOrLogin(email)
            if (!checkUser) throw new Error(' user not found')
            if (checkUser.emailConfirmation.isConfirmed) throw new Error(' already exist by email')
            return true
        }), inputVal
]