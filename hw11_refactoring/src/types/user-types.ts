//response:
import {ObjectId} from "mongodb";

export type UsersOutputType = {
    id: string
    login: string
    email: string
    createdAt: string
}
// service:
export type UserServiceType = {
    id?: string
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
    emailConfirmation: EmailConfirmation
}
export type EmailConfirmation = {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: boolean
}
// in db:
export type UsersDbType = {
    _id: ObjectId
    login: string
    passwordSalt: string
    passwordHash: string
    email: string
    createdAt: string
    emailConfirmation: EmailConfirmation
}