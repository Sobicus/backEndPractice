import {Request, Response, Router} from "express";
import {app} from "../settings";



type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithBodyAndParams<P, B> = Request<P, {}, B, {}>
export enum AvailableResolutions {
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
    minAgeRestriction: number | null
    publicationDate: string
}
export type VideoType = {
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
export const videoDb: VideoType[] = [
    {
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
    }
]
export const videosRouter = Router()
videosRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(videoDb)
});
videosRouter.get('/:id', (req: RequestWithParams<{ id: number }>, res: Response) => {
    const id = +req.params.id

    const video = videoDb.find(video => video.id === id)

    if (!video) {
        res.sendStatus(404)
        return
    }
    res.send(video)
});
videosRouter.post('/', (req: RequestWithBody<{
    title: string,
    author: string,
    availableResolutions: Array<AvailableResolutions>}>, res: Response) => {
    let errors: ErrorType = {
        errorsMessages: []
    }
    let {title, author, availableResolutions} = req.body
    if (!title || !title.length ||  title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({message: 'Invalid  title', field: 'title'})
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({message: 'Invalid author ', field: 'author'})
    }
    //v1
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

    //v.2
    if (!availableResolutions || availableResolutions.length < 1 || !Array.isArray(availableResolutions) || !availableResolutions.every(el => Object.values(AvailableResolutions).includes(el))) {
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
        canBeDownloaded: false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toDateString(),
        "publicationDate": publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    }
    videoDb.push(newVideo)
    res.status(201).send(newVideo)
});
videosRouter.put('/:id', (req: RequestWithBodyAndParams<{id: number}, RequestWithBodyAndParamsBType>, res: Response) => {
    const id = +req.params.id
    const video = videoDb.find(video => video.id === id)
    const videoIndex = videoDb.findIndex((v) => v.id === id)
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
    if (typeof canBeDownloaded === 'undefined') {
        canBeDownloaded = video.canBeDownloaded
    }
    if ((typeof minAgeRestriction !== 'undefined' && typeof minAgeRestriction !== 'number') || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({message: 'Invalid minAgeRestriction ', field: 'minAgeRestriction'})
    }else {
        minAgeRestriction = video.minAgeRestriction
    }
    if (!publicationDate ) {
        publicationDate = video.publicationDate
    }
    if (availableResolutions) {
        if(Array.isArray(availableResolutions)){
            const validResolutions = Object.values(AvailableResolutions);
            for (const resolution of availableResolutions) {
                if (!validResolutions.includes(resolution)) {
                    errors.errorsMessages.push({message: 'Invalid availableResolutions', field: 'availableResolutions'});
                    break
                }
            }
            video.availableResolutions = availableResolutions;
        }else {
            errors.errorsMessages.push({message: 'Invalid availableResolutions ', field: 'availableResolutions'})
        }
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors)
        return
    }
    const newItem = {
        ...video,
        canBeDownloaded,
        title,
        author,
        minAgeRestriction,
        publicationDate,
        availableResolutions
    }
    videoDb.splice(videoIndex, 1, newItem)
    res.sendStatus(204)
});
videosRouter.delete('/:id', (req: RequestWithParams<{ id: number }>, res: Response) => {
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