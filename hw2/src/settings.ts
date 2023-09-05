import express, {Request, Response} from 'express'
import {blogsRouter} from './routes/blogs-router'
import { postsRouter } from './routes/posts-router'
import {postDb} from "./repositories/posts-repository";
import {blogsDb} from "./repositories/blogs-repository";

export const app = express()
app.use(express.json())

// app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('This first page if we connect to localhost:3000')
})
app.get('/testing/all-data', (req: Request, res: Response) => {
    postDb.length=0
    blogsDb.length=0
    res.sendStatus(204)
})