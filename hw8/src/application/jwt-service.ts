import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const jwtService = {
    async createAccessJWT(userId:string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '333', {expiresIn: '10s'})
        return {accessToken:token}
    },
    async createRefreshJWT(userId:string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '123', {expiresIn: '20s'})
        return {refreshToken:token}
    },

    async getUserIdByToken(token: string) {
        try {
            console.log('token', token)
            const result: any = jwt.verify(token, process.env.JWT_SECRET || '123')
            console.log('result', result)
            return result.userId
        } catch (error) {
            return null
        }
    }
}


