import {Router} from "express";
import {container} from "../composition-root";
import {securityDevicesController} from "./securityDevices-controller";

export const securityDevicesRouter = Router()

//const securityDevicesControllerInstance = new securityDevicesController(jwtService, sessionsService)
const securityDevicesControllerInstance = container.resolve(securityDevicesController)

securityDevicesRouter.get('/', securityDevicesControllerInstance.getAllDeviceSessions.bind(securityDevicesControllerInstance))
securityDevicesRouter.delete('/', securityDevicesControllerInstance.deleteDevicesExceptThis.bind(securityDevicesControllerInstance))
securityDevicesRouter.delete('/:deviceId', securityDevicesControllerInstance.deleteSessionDevice.bind(securityDevicesControllerInstance))
