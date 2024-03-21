import {Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";
import {container} from "../composition-root";
import {UsersController} from "./users-controller";

export const usersRouter = Router()

//const usersControllerInstance = new UsersController(usersQueryRepository, usersService)
const usersControllerInstance = container.resolve(UsersController)

usersRouter.get('/', checkAuthorization, usersControllerInstance.findAllUsers.bind(usersControllerInstance))
usersRouter.post('/', checkAuthorization, validationUsersMiddleware, usersControllerInstance.createUser.bind(usersControllerInstance))
usersRouter.delete('/:id', checkAuthorization, usersControllerInstance.deleteUser.bind(usersControllerInstance))