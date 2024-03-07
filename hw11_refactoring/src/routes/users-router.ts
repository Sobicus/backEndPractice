import {Request, Response, Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {IQueryUsers, getPaginationUsersHelpers} from "../helpers/pagination-users-helpers";
import {RequestWithParamsUsers, UsersInputRequestUsers, postRequestWithBodyUsers} from "../types/usersRoter-types";
import {usersQueryRepository, usersService} from "../composition-root";
import {UsersQueryRepository} from "../repositories/users-queryRepository";
import {UsersService} from "../domain/user-service";

export const usersRouter = Router()

class UsersController {
    usersQueryRepository: UsersQueryRepository
    usersService: UsersService

    constructor(usersQueryRepository: UsersQueryRepository, usersService: UsersService) {
        this.usersQueryRepository = usersQueryRepository
        this.usersService = usersService
    }

    async findAllUsers(req: Request<{}, {}, {}, IQueryUsers>, res: Response) {
        const usersPagination = getPaginationUsersHelpers(req.query)
        const users = await this.usersQueryRepository.findAllUsers(usersPagination)
        res.status(200).send(users)
    }

    async createUser(req: postRequestWithBodyUsers<UsersInputRequestUsers>, res: Response) {
        const {login, password, email} = req.body
        const newUser = await this.usersService.createUser(login, password, email)
        res.status(201).send(newUser)
    }

    async deleteUser(req: RequestWithParamsUsers<{ id: string }>, res: Response) {
        const deleteUser = await this.usersService.deleteUser(req.params.id)
        if (!deleteUser) {
            res.sendStatus(404)
            return
        }
        return res.sendStatus(204)
    }
}

const usersControllerInstance = new UsersController(usersQueryRepository, usersService)

usersRouter.get('/', checkAuthorization, usersControllerInstance.findAllUsers)
usersRouter.post('/', checkAuthorization, validationUsersMiddleware, usersControllerInstance.createUser)
usersRouter.delete('/:id', checkAuthorization, usersControllerInstance.deleteUser)