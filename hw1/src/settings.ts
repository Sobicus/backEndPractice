import express, {Request, Response} from 'express'
import {videoDb, videosRouter} from "./routes/videos-router";

export const app = express()

app.use(express.json())

app.use('/videos', videosRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {
        videoDb.length = 0
        res.sendStatus(204)
    })
