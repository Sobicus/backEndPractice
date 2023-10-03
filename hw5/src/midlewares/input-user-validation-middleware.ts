import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationUsersMidleware = [
    body('login')
        .matches('^[a-zA-Z0-9_-]*$').withMessage('Login should be included only a-z (Uppercase, Lowercase and number)')
        .isString().withMessage('Login not a string')
        .trim().notEmpty().withMessage('Login can`t be empty and cannot consist of only spaces')
        .trim().isLength({min:3, max: 10}).withMessage('Login cannot be less than 3 and more than 10 characters'),
    body('password')
        .isString().withMessage('Password not a string')
        .trim().notEmpty().withMessage('Password can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({min:6,max: 20}).withMessage('Password cannot be less than 6 and more than 200 characters'),
    body('email')
        .isString().withMessage('Email not a string')
        .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com'),
    inputVal
]