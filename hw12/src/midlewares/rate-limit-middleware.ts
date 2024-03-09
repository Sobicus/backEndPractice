import {NextFunction, Request, Response} from "express";
import {rateLimitService} from "../composition-root";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // console.log('baseUrl', req.baseUrl)
    // console.log('url', req.url)
    // console.log('originalUrl', req.originalUrl)

    const path = req.originalUrl.split('?')[0]
    console.log('path', path)
    const createDate = new Date().getTime()
    const ip = req.socket.remoteAddress || 'Anonimus'
    await rateLimitService.createNewRateSession(ip, path, createDate)
    const requestDate = new Date().getTime()
    const requestDateTenSecBefore = requestDate - 10000
    const checkRateLimit = await rateLimitService.getAllRateSessionsTimeRange(ip, path, requestDateTenSecBefore)
console.log('count', checkRateLimit)
    if (checkRateLimit > 5) return res.sendStatus(429)
    return next()
}

