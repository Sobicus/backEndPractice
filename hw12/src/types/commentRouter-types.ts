import {Request} from "express";
import {UsersViewType} from "./user-types";

export type commentsRequestParams<P> = Request<P, {}, {}, {}>
export type commentsRequestParamsAndUser<P, U extends UsersViewType> = Request<P, {}, {}, {}, U>
export type commentsRequestParamsAndBodyUser<P, B, U extends UsersViewType> = Request<P, {}, B, {}, U>
export type commentsRequestParamsBody<P, B> = Request<P, {}, B, {}, {}>