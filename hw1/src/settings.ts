import express, {Request, Response} from 'express'

export const app = express()

app.use(express.json())

type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>

enum AvailableResolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160'
}

type RequestWithBodyAndParamsBType = {
    title: string
    author: string
    availableResolutions: AvailableResolutions[]
    canBeDownloaded: boolean
    minAgeRestriction: number
    publicationDate: string
}
type VideoType = {
    "id": number
    "title": string
    "author": string
    "canBeDownloaded": boolean
    "minAgeRestriction": null | number
    "createdAt": string
    "publicationDate": string
    "availableResolutions": AvailableResolutions[]
}
type ErrorMessages = {
    message: string
    field: string
}
type ErrorType = {
    errorsMessages: ErrorMessages[]
}

const videoDb: VideoType[] = [{
    "id": 0,
    "title": "string",
    "author": "string",
    "canBeDownloaded": true,
    "minAgeRestriction": null,
    "createdAt": "2023-08-14T16:16:48.040Z",
    "publicationDate": "2023-08-14T16:16:48.040Z",
    "availableResolutions": [
        AvailableResolutions.P144
    ]
}, {
    "id": 1,
    "title": "Scary",
    "author": "Movie",
    "canBeDownloaded": true,
    "minAgeRestriction": null,
    "createdAt": "2023-08-14T16:16:48.040Z",
    "publicationDate": "2023-08-14T16:16:48.040Z",
    "availableResolutions": [
        AvailableResolutions.P240
    ]
}]

app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videoDb)
})

app.get('/videos/:id', (req: RequestWithParams<{ id: number }>, res: Response) => {
    const id = +req.params.id

    const video = videoDb.find(video => video.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    }
    res.send(video)
})

app.post('/videos', (req: RequestWithBody<{
    title: string,
    author: string,
    availableResolutions: Array<AvailableResolutions>
}>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid  title', field: 'title'})
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author ', field: 'author'})
    }
    // if (Array.isArray(availableResolutions) && availableResolutions.length) {
    //     availableResolutions.map((r: AvailableResolutions) => {
    //         !AvailableResolutions[r] && errors.errorsMessages.push({
    //             message: 'Invalid availableResolutions',
    //             field: 'availableResolutions'
    //         })
    //     })
    // }
    // else {
    //     availableResolutions = []

    // }
    if (!availableResolutions || !Array.isArray(availableResolutions) || !availableResolutions.every(el => Object.values(AvailableResolutions).includes(el))) {
        errors.errorsMessages.push({
            message: 'Invalid availableResolutions',
            field: 'availableResolutions'
        })
    }

    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }
    const createdAt = new Date()
    const publicationDate = new Date()
    publicationDate.setDate(createdAt.getDate() + 1)
    const newVideo: VideoType = {
        id: +(new Date()),
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toDateString(),
        "publicationDate": publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }
    videoDb.push(newVideo)
    res.status(201).send(newVideo)
})
app.put('/videos/:id', (req: RequestWithBodyAndParams<{
    id: number
}, RequestWithBodyAndParamsBType>, res: Response) => {
    const id = +req.params.id

    const video = videoDb.find(video => video.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    }
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate} = req.body
    if (!title || !title.trim().length || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid  title', field: 'title'})
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author ', field: 'author'})
    }
    if (typeof canBeDownloaded === 'undefined' || typeof canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({message: 'Invalid canBeDownloaded ', field: 'canBeDownloaded'})
    }
    if (typeof minAgeRestriction === 'undefined' || typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({message: 'Invalid minAgeRestriction ', field: 'minAgeRestriction'})
    }
    if (!publicationDate || !publicationDate.trim().length || publicationDate.trim().length > 30) {
        errors.errorsMessages.push({message: 'Invalid  publicationDate', field: 'publicationDate'})
    }
    if (availableResolutions) {
        const validResolutions = Object.values(AvailableResolutions);
        for (const resolution of availableResolutions) {
            if (!validResolutions.includes(resolution)) {
                errors.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'});
                break;
            }
        }
        video.availableResolutions = availableResolutions;
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }
    video.title = title
    video.author = author
    video.canBeDownloaded = canBeDownloaded
    video.minAgeRestriction = minAgeRestriction
    video.publicationDate = publicationDate

    res.sendStatus(204)
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
        videoDb.length = 0
        res.sendStatus(204)
        // res.status(204).send(videoDb)
    }
)
app.delete('/videos/:id', (req: RequestWithParams<{ id: number }>, res: Response) => {
    const id = +req.params.id
    const indexToDelete = videoDb.findIndex(video => video.id === id);

    if (indexToDelete !== -1) {
        videoDb.splice(indexToDelete, 1);
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})