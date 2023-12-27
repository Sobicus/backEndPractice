import {body} from "express-validator";
import {inputVal} from "./errorValidator";
import {userService} from "../domain/user-service";

export const validationEmailPasswordRecoveryMiddleware = [
    body('email')
        .isString().withMessage('Email not a string')
        .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com'),
    /*body('email')
        .custom(async(email) => {
            const checkUser = await userService.findUserByEmailOrLogin(email)
                    if(!checkUser) throw new Error('Does`t have email')
            return true
        }),*/
    inputVal
]
    // ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
