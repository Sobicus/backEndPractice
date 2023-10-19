import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const jwtService = {
    async createJWT(userId: string) {
        const token = jwt.sign({userId}, process.env.JWT_SECRET || '123', {expiresIn: '1h'})
        return {
            resultCode: 0,
            data: {
                token
            }
        }
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_Secret || '123')
            return new Object(result.userId)
        } catch (error) {
            return null
        }
    }
}

