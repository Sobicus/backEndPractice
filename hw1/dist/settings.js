"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
var AvailableResolutions;
(function (AvailableResolutions) {
    AvailableResolutions["P144"] = "P144";
    AvailableResolutions["P240"] = "P240";
    AvailableResolutions["P360"] = "P360";
    AvailableResolutions["P480"] = "P480";
    AvailableResolutions["P720"] = "P720";
    AvailableResolutions["P1080"] = "P1080";
    AvailableResolutions["P1440"] = "P1440";
    AvailableResolutions["P2160"] = "P2160";
})(AvailableResolutions || (AvailableResolutions = {}));
const videoDb = [{
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
    }];
exports.app.get('/videos', (req, res) => {
    res.status(200).send(videoDb);
});
exports.app.get('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videoDb.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(video);
});
exports.app.post('/videos', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid  title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author ', field: 'author' });
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
        });
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);
    const newVideo = {
        id: +(new Date()),
        "canBeDownloaded": false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toDateString(),
        "publicationDate": publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    videoDb.push(newVideo);
    res.status(201).send(newVideo);
});
exports.app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const video = videoDb.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions, canBeDownloaded, minAgeRestriction, publicationDate } = req.body;
    if (!title || !title.trim().length || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid  title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author ', field: 'author' });
    }
    if (typeof canBeDownloaded === 'undefined' || typeof canBeDownloaded !== 'boolean') {
        errors.errorsMessages.push({ message: 'Invalid canBeDownloaded ', field: 'canBeDownloaded' });
    }
    if (typeof minAgeRestriction === 'undefined' || typeof minAgeRestriction !== 'number' || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({ message: 'Invalid minAgeRestriction ', field: 'minAgeRestriction' });
    }
    if (!publicationDate || !publicationDate.trim().length || publicationDate.trim().length > 30) {
        errors.errorsMessages.push({ message: 'Invalid  publicationDate', field: 'publicationDate' });
    }
    if (availableResolutions) {
        const validResolutions = Object.values(AvailableResolutions);
        for (const resolution of availableResolutions) {
            if (!validResolutions.includes(resolution)) {
                errors.errorsMessages.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });
                break;
            }
        }
        video.availableResolutions = availableResolutions;
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    video.title = title;
    video.author = author;
    video.canBeDownloaded = canBeDownloaded;
    video.minAgeRestriction = minAgeRestriction;
    video.publicationDate = publicationDate;
    res.sendStatus(204);
});
exports.app.delete('/testing/all-data', (req, res) => {
    videoDb.length = 0;
    res.sendStatus(204);
});
exports.app.delete('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const indexToDelete = videoDb.findIndex(video => video.id === id);
    if (indexToDelete !== -1) {
        videoDb.splice(indexToDelete, 1);
        res.sendStatus(204);
    }
    else {
        res.sendStatus(404);
    }
});
