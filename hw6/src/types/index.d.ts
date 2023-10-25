//index.d.ts
declare global {
    namespace Express {
        export interface Request {
            userId: string | null
        }
    }
}