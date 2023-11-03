import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const jwtService = {
    async createJWT(userId:string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '333', {expiresIn: '1h'})
        return {accessToken:token}
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_Secret || '333')
            return result.userId
        } catch (error) {
            return null
        }
    }
}