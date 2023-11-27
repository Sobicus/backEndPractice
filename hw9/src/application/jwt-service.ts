import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const jwtService = {
    async createAccessJWT(userId: string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '333', {expiresIn: '10s'})
        return {accessToken: token}
    },
    async createRefreshJWT(userId: string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '222', {expiresIn: '20s'})
        return {refreshToken: token}
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '222')
            return result.userId
        } catch (error) {
            console.log('error in verify token:', error)
            return null
        }
    }
}