import express, {Request, Response} from 'express'
import {blogsRouter} from './routes/blogs-router'

export const app = express()
app.use(bodyParser())
// app.use(express.json())
app.use('/blogs', blogsRouter)


app.get('/', (req: Request, res: Response) => {
    res.send('This first page if we connect to localhost:3000')
})