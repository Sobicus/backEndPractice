import {ObjectId} from "mongodb";
import {JwtTokenModel} from "./db";
import {injectable} from "inversify";

@injectable()
export class JwtTokensRepository {
    async expiredTokens(_id: ObjectId, refreshToken: string):Promise<string> {
        const result = await JwtTokenModel
            .create({_id, refreshToken})
        return result._id.toString()
    }
    async isExpiredToken(refreshToken: string):Promise<boolean>{
        const result = await JwtTokenModel
            .findOne({refreshToken})
        if (!result) return false
        return true
    }
}

type refreshTokenType = {
    _id: ObjectId
    refreshToken: string
}