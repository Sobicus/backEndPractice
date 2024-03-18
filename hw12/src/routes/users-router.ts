import {Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationUsersMiddleware} from "../midlewares/input-user-validation-middleware";

import {usersControllerInstance} from "./users-controller";

export const usersRouter = Router()

usersRouter.get('/', checkAuthorization, usersControllerInstance.findAllUsers.bind(usersControllerInstance))
usersRouter.post('/', checkAuthorization, validationUsersMiddleware, usersControllerInstance.createUser.bind(usersControllerInstance))
usersRouter.delete('/:id', checkAuthorization, usersControllerInstance.deleteUser.bind(usersControllerInstance))