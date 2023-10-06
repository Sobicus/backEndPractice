import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationUsersMidleware} from "../midlewares/input-user-validation-middleware";

export const usersRouter = Router()

usersRouter.get('/', async (req: Request, res: Response) => {
    const users = userService.findAllPosts()
    res.status(200).send(users)
})
usersRouter.post('/', checkAuthorization,validationUsersMidleware,
    async (req: postRequestWithBody<UsersInputRequest>, res: Response) => {
    const {login, password, email} = req.body
    const newUser = await userService.createUser(login, password, email)
    res.status(201).send(newUser)
})


type postRequestWithBody<B> = Request<{}, {}, B, {}>
export  type UsersInputRequest = {
    login: string
    password: string
    email: string
}