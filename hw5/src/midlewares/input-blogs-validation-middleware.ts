import {body} from "express-validator";
import {inputVal} from "./errorValidator";


export const validationBlogsMiddleware = [
    body('name')
        .isString().withMessage('Name not a string')
        .trim().notEmpty().withMessage('name can`t be empty and cannot consist of only spaces')
        .trim().isLength({max: 15}).withMessage('Name cannot be more than 15 characters'),
    body('description')
        .isString().withMessage('Description not a string')
        .trim().notEmpty().withMessage('Description can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({max: 500}).withMessage('Description cannot be more than 500 characters'),
    body('websiteUrl')
        .matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').withMessage('websiteUrl must be include type like https://www.webpage.com')
        .isLength({max: 100}).withMessage('WebsiteUrl cannot be more than 100 characters')
        .trim().notEmpty().withMessage('WebsiteUrl can`t be empty and cannot consist of only spaces'),
    inputVal
    // errorValidator
]