import express, {Request, Response} from 'express'
import {blogsRouter} from './routes/blogs-router'
import {postsRouter} from './routes/posts-router'
import {postsViewType} from "./repositories/posts-repository";
import {blogsRepositoryType} from "./repositories/blogs-repository";
import {usersRouter} from './routes/users-router';
import {authRouter} from "./routes/auth-router";
import {commentsRouter} from './routes/comments-router';
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./routes/securityDevices-router";
import {
    BlogsModel,
    CommentsModel,
    JwtTokenModel, LikesCommentsModel, PasswordRecoveryModel,
    PostsModel,
    RateLimitModel,
    SessionsModel,
    UsersModel
} from "./repositories/db";

export const app = express()
app.use(express.json())
app.use(cookieParser())
app.set('trust proxy', true)

// app.use(express.json())
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/comments', commentsRouter)
app.use('/security/devices', securityDevicesRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('This first page if we connect to localhost:3000')
})
app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await BlogsModel.deleteMany({})
    await PostsModel.deleteMany({})
    await CommentsModel.deleteMany({})
    await JwtTokenModel.deleteMany({})
    await RateLimitModel.deleteMany({})
    await SessionsModel.deleteMany({})
    await UsersModel.deleteMany({})
    await PasswordRecoveryModel.deleteMany({})
    await LikesCommentsModel.deleteMany({})
    res.sendStatus(204)
})