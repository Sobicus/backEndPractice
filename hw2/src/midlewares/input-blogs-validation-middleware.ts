import {body} from "express-validator";
import {inputVal} from "./errorValidator";
// import {errorValidator} from "./errorValidator";


export const validationBlogsMidleware = [
    body('name').isString().withMessage('Name not a string').trim().isLength({max: 15}).notEmpty().withMessage('Invalid name'),
    body('description').isString().trim().isLength({max: 500}).notEmpty().withMessage('Invalid description'),
    body('websiteUrl').matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').isLength({max: 100}).notEmpty(),
    inputVal
    // errorValidator
]