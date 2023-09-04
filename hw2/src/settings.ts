import express, {Request, Response} from 'express'
import {blogsRouter} from './routes/blogs-router'
import { postsRouter } from './routes/posts-router'

export const app = express()
app.use(express.json())

// app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('This first page if we connect to localhost:3000')
})