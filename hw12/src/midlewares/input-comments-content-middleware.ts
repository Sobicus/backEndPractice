import {body} from "express-validator";
import {inputVal} from "./errorValidator";

export const validationCommentsContentMiddleware = [
    body('content').isString().trim().isLength({
        min: 20,
        max: 300
    }).withMessage('Comment cannot be less than 20 and more than 300 characters'), inputVal]