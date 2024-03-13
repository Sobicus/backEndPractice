//index.d.ts
import {UsersDbType} from "./user-types";

declare global {
    namespace Express {
        export interface Request {
            userId: string | null
            user: UsersDbType | null
        }
    }
}