import {JwtTokensRepository} from "../repositories/jwt-tokens-repository";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class JwtTokensService {
    jwtTokensRepo: JwtTokensRepository

    constructor() {
        this.jwtTokensRepo = new JwtTokensRepository()
    }

    async expiredTokens(refreshToken: string):Promise<string>{
        const _id = new ObjectId()
        return await this.jwtTokensRepo.expiredTokens(_id, refreshToken)
    }
    async isExpiredToken(refreshToken: string):Promise<boolean>{
        return await this.jwtTokensRepo.isExpiredToken(refreshToken)
    }
}
