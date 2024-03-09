import {Request} from "express";

export type postRequestWithBodyUsers<B> = Request<{}, {}, B, {}>
export type RequestWithParamsUsers<P> = Request<P, {}, {}, {}>
export  type UsersInputRequestUsers = {
    login: string
    password: string
    email: string
}