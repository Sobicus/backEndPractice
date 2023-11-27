import express, {Request, Response} from 'express'
import {blogsRouter} from './routes/blogs-router'
import {postsRouter} from './routes/posts-router'
import {client, dataBaseName} from "./repositories/db";
import {postsViewType} from "./repositories/posts-repository";
import {blogsRepositoryType} from "./repositories/blogs-repository";
import { usersRouter } from './routes/users-router';
import {authRouter} from "./routes/auth-router";
import { commentsRouter } from './routes/comments-router';
import cookieParser from "cookie-parser";

export const app = express()
app.use(express.json())
app.use(cookieParser())

// app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('This first page if we connect to localhost:3000')
})
app.delete('/testing/all-data', async (req: Request, res: Response) => {
   await client.db(dataBaseName).collection<postsViewType>('posts').deleteMany({})
   await client.db(dataBaseName).collection<blogsRepositoryType>('blogs').deleteMany({})
   await client.db(dataBaseName).collection<blogsRepositoryType>('users').deleteMany({})
    res.sendStatus(204)
})