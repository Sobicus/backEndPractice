import {Request} from "express";
import {UsersViewType} from "./user-types";

export type RequestWithParams<P> = Request<P, {}, {}, {}>
export type postRequestWithBody<B> = Request<{}, {}, B, {}>
export type postBodyRequest = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}
export type postRequestComment<P, B, U extends UsersViewType> = Request<P, {}, B, {}, U>
export type putRequestChangePost<P, B> = Request<P, {}, B, {}>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>