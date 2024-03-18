import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationPostLikesMiddleware = [
    body('likeStatus')
        .isString().withMessage('Title not a string')
        .trim().notEmpty().withMessage('Title can`t be empty and cannot consist of only spaces')
        .isIn(['None', 'Like', 'Dislike']).withMessage('likeStatus must be form like: None, Like, Dislike'),
    inputVal
]