import {body} from "express-validator";
import {inputVal} from "./errorValidator";
import {authService} from "../composition-root";

export const validationNewPasswordMiddleware = [
    body('newPassword')
        .isString().withMessage('New password not a string')
        .trim().notEmpty().withMessage('New Password can`t be empty and cannot consist of only spaces')
        .isLength({
            min: 6,
            max: 20
        }).withMessage('New Password must be at least 6 characters long or maximum 20 characters'),
    body('recoveryCode')
        .isString().withMessage('Recovery code not a string')
        .trim().notEmpty().withMessage('Recovery code can`t be empty and cannot consist of only spaces')
        .custom(async (recoveryCode) => {
            const result = await authService.findPasswordRecoveryCodeByCode(recoveryCode)
            if (!result) throw new Error('Recovery code not found')
        }),
    inputVal
]
// ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
