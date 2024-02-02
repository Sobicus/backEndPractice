import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationAuthLoginMiddleware = [
    body('likeStatus')
        .isString().withMessage('likeStatus not a string')
        .trim().notEmpty().withMessage('likeStatus can`t be empty')
        .equals('None'||'Like'||'Dislike').withMessage('likeStatus have to equals None || Like || Dislike'),
    inputVal
]