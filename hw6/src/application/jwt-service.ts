import {UsersDbType} from "../repositories/users-repository";
import jwt from 'jsonwebtoken'

export const jwtService = {
    async createJWT(user: UsersDbType) {
        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
        return{
            resultCode:0,
            data:{
                token
            }
        }
    }
}

