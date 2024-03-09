import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

// export const jwtService = {
//     async createAccessJWT(userId: string) {
//         const token = jwt.sign({userId}, process.env.JWT_SECRET || '333', {expiresIn: '10m'})
//         return {accessToken: token}
//     },
//     async createRefreshJWT(userId: string, deviceId: string) {
//         const token = jwt.sign({userId, deviceId}, process.env.JWT_SECRET || '222', {expiresIn: '5m'})
//         return {refreshToken: token}
//     },
//
//     async getUserIdByToken(token: string) {
//         try {
//             const result: any = jwt.verify(token, process.env.JWT_SECRET || '222')
//             return result.userId
//         } catch (error) {
//             console.log('error in verify token:', error)
//             return null
//         }
//     },
//     async getPayloadByToken(token: string): Promise<{
//         userId: string,
//         deviceId: string,
//         iat: number,
//         exp: number
//     } | null> {
//         try {
//             const result: any = jwt.verify(token, process.env.JWT_SECRET || '222')
//             return result
//         } catch (error) {
//             console.log('error in verify token:', error)
//             return null
//         }
//     }
// }
export class JwtService  {
    async createAccessJWT(userId: string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '333', {expiresIn: '10m'})
        return {accessToken: token}
    }
    async createRefreshJWT(userId: string, deviceId: string) {
        const token = jwt.sign({userId, deviceId}, process.env.JWT_SECRET || '222', {expiresIn: '5m'})
        return {refreshToken: token}
    }

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '222')
            return result.userId
        } catch (error) {
            console.log('error in verify token:', error)
            return null
        }
    }
    async getPayloadByToken(token: string): Promise<{
        userId: string,
        deviceId: string,
        iat: number,
        exp: number
    } | null> {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '222')
            return result
        } catch (error) {
            console.log('error in verify token:', error)
            return null
        }
    }
}