import {Request} from "express";

export type RequestWithParamsBlogs<P> = Request<P, {}, {}, {}>
export type RequestWithParamsAmdQueryBlogs<P, Q> = Request<P, {}, {}, Q>
export type postRequestWithBodyBlogs<B> = Request<{}, {}, B, {}>
export  type blogBodyRequest = {
    name: string
    description: string
    websiteUrl: string
}
export type RequestChangeBlogBlogs<P, B> = Request<P, {}, B, {}>
export type postByBlogIdBodyRequestBlogs = {
    title: string
    shortDescription: string
    content: string
}