import {Router} from "express";
import {authMiddleware} from "../midlewares/auth-middleware";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {rateLimitMiddleware} from "../midlewares/rate-limit-middleware";
import {
    validationEmailPasswordRecoveryMiddleware
} from "../midlewares/input-emailPasswordRecovery-validation-middleware";
import {validationNewPasswordMiddleware} from "../midlewares/newPassword-recoveryCode-middleware";
import {
    registrationConfirmationCodeCheck
} from "../midlewares/registrationConfirmation-codeCheck";
import {registrationEmailResending} from "../midlewares/registarationEmailResending-emailCheck";
import {authControllerInstance} from "./auth-controller";

export const authRouter = Router()

authRouter.post('/login', rateLimitMiddleware, validationAuthLoginMiddleware, authControllerInstance.createDeviceSession.bind(authControllerInstance))
authRouter.get('/me', authMiddleware, authControllerInstance.authMe.bind(authControllerInstance))
authRouter.post('/registration', rateLimitMiddleware, validationUsersMiddleware, authControllerInstance.createUser.bind(authControllerInstance))
//------------------------------------------------------------------------------------------
authRouter.post('/registration-confirmation', rateLimitMiddleware, /*body('code')
    .custom(async (code) => {
        const checkUser = await usersService.findUserByConfirmationCode(code)
        if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
        return true
    }), inputVal,*/registrationConfirmationCodeCheck, authControllerInstance.confirmEmail.bind(authControllerInstance))
//------------------------------------------------------------------------------------------
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResending,/*body('email')
    .isString().withMessage('Email not a string')
    .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com')
    .custom(async (email) => {
        const checkUser = await usersService.findUserByEmailOrLogin(email)
        if (!checkUser) throw new Error(' user not found')
        if (checkUser.emailConfirmation.isConfirmed) throw new Error(' already exist by email')
        return true
    }), inputVal,*/ authControllerInstance.resendingRegistrationEmail.bind(authControllerInstance))
//---------------------------------------------------------------------------------------------
authRouter.post('/refresh-token', authControllerInstance.updateSession.bind(authControllerInstance))
authRouter.post('/logout', authControllerInstance.deleteSessionDevice.bind(authControllerInstance))
authRouter.post('/password-recovery',
    rateLimitMiddleware,
    validationEmailPasswordRecoveryMiddleware, authControllerInstance.passwordRecovery.bind(authControllerInstance))
authRouter.post('/new-password', rateLimitMiddleware, validationNewPasswordMiddleware, authControllerInstance.newPassword.bind(authControllerInstance))
