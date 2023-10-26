//index.d.ts
import {UsersOutputType} from "../repositories/users-repository";

declare global {
    namespace Express {
        export interface Request {
            userId: string | null
            user: UsersOutputType | null
        }
    }
}