import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationAuthMiddleware = [
    body('loginOrEmail')
        .isString().withMessage('Password not a string')
        .trim().notEmpty().withMessage('Password can`t be empty and cannot consist of only spaces'),
    body('password')
        .isString().withMessage('Password not a string')
        .trim().notEmpty().withMessage('Password can`t be empty and cannot consist of only spaces'),
    inputVal
]