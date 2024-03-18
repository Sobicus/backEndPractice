import {Router} from "express";
import {securityDevicesControllerInstance} from "./securityDevices-controller";

export const securityDevicesRouter = Router()

securityDevicesRouter.get('/', securityDevicesControllerInstance.getAllDeviceSessions.bind(securityDevicesControllerInstance))
securityDevicesRouter.delete('/', securityDevicesControllerInstance.deleteDevicesExceptThis.bind(securityDevicesControllerInstance))
securityDevicesRouter.delete('/:deviceId', securityDevicesControllerInstance.deleteSessionDevice.bind(securityDevicesControllerInstance))
