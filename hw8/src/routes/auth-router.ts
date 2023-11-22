import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {authMiddleware} from "../midlewares/auth-middleware";
import {authService} from "../domain/auth-service";
import {validationAuthLoginMiddleware} from "../midlewares/input-auth-validation-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {body} from "express-validator";
import {inputVal} from "../midlewares/errorValidator";

export const authRouter = Router()

authRouter.post('/login', validationAuthLoginMiddleware, async (req: PostRequestType<BodyTypeRegistration>, res: Response) => {
    const user = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (!user) {
        res.sendStatus(401)
        return
    }
    const accessToken = await jwtService.createAccessJWT(user.id!) // Change hardcode
    const refreshToken = await jwtService.createRefreshJWT(user.id!) // Change hardcode
    console.log('accessToken', accessToken)
    console.log('refreshToken', refreshToken)
    res.status(200).cookie('refreshToken', refreshToken, {httpOnly: true, secure: true}).send(accessToken)
    return
})
authRouter.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const userData = req.user
    console.log(userData)
    if (!userData) return res.sendStatus(401)
    return res.status(200).send({
        email: userData.email,
        login: userData.login,
        userId: userData.id
    })
})
authRouter.post('/registration', validationUsersMiddleware, async (req: PostRequestType<PostRequestRegistrationType>, res: Response) => {
        //await userService.createUser(req.body.login, req.body.password, req.body.email)
        const newUser = await authService.createUser(req.body.login, req.body.password, req.body.email)
        if (!newUser) {
            return res.sendStatus(400)
        }
        return res.sendStatus(204)
    }
)
authRouter.post('/registration-confirmation', body('code')
    .custom(async (code) => {
        const checkUser = await userService.findUserByConfirmationCode(code)
        if (checkUser?.emailConfirmation.isConfirmed === true) throw new Error(' already exist by email')
        return true
    }), inputVal, async (req: PostRequestType<{ code: string }>, res: Response) => {
    const result = await authService.confirmEmail(req.body.code)
    console.log('result registration-confirmation', result)
    console.log('req.body.code', req.body.code)
    if (!result) {
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the confirmation code is incorrect, expired or already been applied",
                    "field": "code"
                }
            ]
        })
    }
    return res.sendStatus(204)
})
authRouter.post('/registration-email-resending', body('email')
    .isString().withMessage('Email not a string')
    .trim().notEmpty().withMessage('Email can`t be empty and cannot consist of only spaces')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').withMessage('Email must be include type like forexample@gmail.com')
    .custom(async (email) => {
        const checkUser = await userService.findUserByEmailOrLogin(email)
        if (!checkUser) throw new Error(' user not found')
        if (checkUser.emailConfirmation.isConfirmed) throw new Error(' already exist by email')
        return true
    }), inputVal, async (req: PostRequestType<{ email: string }>, res: Response) => {
    const result = await authService.resendingRegistrationEmail(req.body.email)
    /*if (!result) {
        return res.status(400).send({
            "errorsMessages": [
                {
                    "message": "If the inputModel has incorrect values or if email is already confirmed",
                    "field": "email"
                }
            ]
        })
    }*/
    return res.sendStatus(204)
})

type PostRequestType<B> = Request<{}, {}, B, {}>
type BodyTypeRegistration = {
    loginOrEmail: string
    password: string
}
type PostRequestRegistrationType = {
    login: string
    password: string
    email: string
}