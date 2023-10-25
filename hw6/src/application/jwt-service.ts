import jwt from 'jsonwebtoken'

import dotenv from 'dotenv'
import {UsersDbType} from "../repositories/users-repository";

dotenv.config()

export const jwtService = {
    async createJWT(user: UsersDbType) {
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET || '333', {expiresIn: '1h'})
        return token
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_Secret || '333')
            console.log(result)
            /*
{
  userId: '65391c681f2a5579ecadb7e0',
  iat: 1698266163,
  exp: 1698269763
}

            */
            console.log(new Object(result.userId))
//[String: '65391c681f2a5579ecadb7e0']
            return new Object(result.userId)
        } catch (error) {
            return null
        }
    }
}

