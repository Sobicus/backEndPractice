import {randomUUID} from "crypto";

class SessionService{

    createSession( ){
       console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('atob jwt', atob(accessToken.accessToken.split('.')[1]))
        console.log('deviceId',randomUUID())
        console.log('encode',Buffer.from(refreshToken.refreshToken.split('.')[1], 'base64').toString('utf-8'))

        console.log('ip', req.socket.remoteAddress)
        console.log('deviceName', req.headers['user-agent'])
        console.log('userId', user.id)
    }
}
export const sessionService = new SessionService()