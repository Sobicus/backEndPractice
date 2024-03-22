import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationEmailPasswordRecoveryMiddleware = [
    body('email')
        .isString().withMessage('Email not a string')
        .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
        .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com'),
    inputVal
]
