import {Request, Response, Router} from "express";
import {userService} from "../domain/user-service";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {IQueryUsers, getPaginationUsersHelpers} from "../helpers/pagination-users-helpers";

export const usersRouter = Router()

usersRouter.get('/', checkAuthorization, async (req: Request<{}, {}, {}, IQueryUsers>, res: Response) => {
    const usersPagination = getPaginationUsersHelpers(req.query)
    const users = await userService.findAllUsers(usersPagination)
    res.status(200).send(users)
})
usersRouter.post('/', checkAuthorization, validationUsersMiddleware,
    async (req: postRequestWithBody<UsersInputRequest>, res: Response) => {
        const {login, password, email} = req.body
        const newUser = await userService.createUser(login, password, email)


        res.status(201).send(newUser)
    })
usersRouter.delete('/:id', checkAuthorization, async (req: RequestWithParams<{ id: string }>, res: Response) => {
        const deleteUser = await userService.deleteUser(req.params.id)
        if (!deleteUser) {
            res.sendStatus(404)
            return
        }
        return res.sendStatus(204)
    }
)


type postRequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
export  type UsersInputRequest = {
    login: string
    password: string
    email: string
}