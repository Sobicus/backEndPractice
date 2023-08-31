import {Request, Response, Router} from "express";
import {app} from "../settings";

export const blogsRouter = Router()

blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send('THIS IS YOUR POSTS!!!')
})
