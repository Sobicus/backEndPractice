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
import {container} from "../composition-root";
import {authController} from "./auth-controller";

export const authRouter = Router()
//export const authControllerInstance = new authController(usersService, sessionsService, authService, jwtService)
const authControllerInstance = container.resolve(authController)

authRouter.post('/login', rateLimitMiddleware, validationAuthLoginMiddleware, authControllerInstance.createDeviceSession.bind(authControllerInstance))
authRouter.get('/me', authMiddleware, authControllerInstance.authMe.bind(authControllerInstance))
authRouter.post('/registration', rateLimitMiddleware, validationUsersMiddleware, authControllerInstance.createUser.bind(authControllerInstance))
authRouter.post('/registration-confirmation', rateLimitMiddleware, registrationConfirmationCodeCheck, authControllerInstance.confirmEmail.bind(authControllerInstance))
authRouter.post('/registration-email-resending', rateLimitMiddleware, registrationEmailResending, authControllerInstance.resendingRegistrationEmail.bind(authControllerInstance))
authRouter.post('/refresh-token', authControllerInstance.updateSession.bind(authControllerInstance))
authRouter.post('/logout', authControllerInstance.deleteSessionDevice.bind(authControllerInstance))
authRouter.post('/password-recovery', rateLimitMiddleware, validationEmailPasswordRecoveryMiddleware, authControllerInstance.passwordRecovery.bind(authControllerInstance))
authRouter.post('/new-password', rateLimitMiddleware, validationNewPasswordMiddleware, authControllerInstance.newPassword.bind(authControllerInstance))
