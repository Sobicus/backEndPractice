import {ObjectId} from "mongodb";

export class JwtTokensRepository {
    async expiredTokens(_id: ObjectId, refreshToken: string):Promise<string> {
        const result = await client.db(dataBaseName)
            .collection<refreshTokenType>('jwtTokens').insertOne({_id, refreshToken})
        return result.insertedId.toString()
    }
    async isExpiredToken(refreshToken: string):Promise<boolean>{
        const result = await client.db(dataBaseName)
            .collection<refreshTokenType>('jwtTokens').findOne({refreshToken})
        if (!result) return false
        return true
    }
}

type refreshTokenType = {
    _id: ObjectId
    refreshToken: string
}