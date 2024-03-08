import {Request} from "express";

export type PostRequestAuthType<B> = Request<{}, {}, B, {}>
export type BodyRegistrationAuthType = {
    loginOrEmail: string
    password: string
}
export type PostRequestRegistrationAuthType = {
    login: string
    password: string
    email: string
}
export type BodyPasswordRecoveryAuthType = {
    email: string
}
export type BodyNewPasswordAuthType = {
    newPassword: string
    recoveryCode: string
}