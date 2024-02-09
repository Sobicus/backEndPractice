import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationComentLikeStatusMiddleware = [
    body('likeStatus')
        .isString().withMessage('likeStatus not a string')
        .trim().notEmpty().withMessage('likeStatus can`t be empty')
        .isIn(['None','Like','Dislike']).withMessage('likeStatus have to equals None || Like || Dislike'),
    inputVal
]