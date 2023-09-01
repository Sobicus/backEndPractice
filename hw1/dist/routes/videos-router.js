"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = exports.videoDb = exports.AvailableResolutions = void 0;
const express_1 = require("express");
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
})(AvailableResolutions || (exports.AvailableResolutions = AvailableResolutions = {}));
exports.videoDb = [
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
];
exports.videosRouter = (0, express_1.Router)();
exports.videosRouter.get('/', (req, res) => {
    res.status(200).send(exports.videoDb);
});
exports.videosRouter.get('/:id', (req, res) => {
    const id = +req.params.id;
    const video = exports.videoDb.find(video => video.id === id);
    if (!video) {
        res.sendStatus(404);
        return;
    }
    res.send(video);
});
exports.videosRouter.post('/', (req, res) => {
    let errors = {
        errorsMessages: []
    };
    let { title, author, availableResolutions } = req.body;
    if (!title || !title.length || title.trim().length < 1 || title.trim().length > 40) {
        errors.errorsMessages.push({ message: 'Invalid  title', field: 'title' });
    }
    if (!author || !author.length || author.trim().length > 20) {
        errors.errorsMessages.push({ message: 'Invalid author ', field: 'author' });
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
        canBeDownloaded: false,
        "minAgeRestriction": null,
        "createdAt": createdAt.toDateString(),
        "publicationDate": publicationDate.toISOString(),
        title,
        author,
        availableResolutions
    };
    exports.videoDb.push(newVideo);
    res.status(201).send(newVideo);
});
exports.videosRouter.put('/:id', (req, res) => {
    const id = +req.params.id;
    const video = exports.videoDb.find(video => video.id === id);
    const videoIndex = exports.videoDb.findIndex((v) => v.id === id);
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
    if (typeof canBeDownloaded === 'undefined') {
        canBeDownloaded = video.canBeDownloaded;
    }
    if ((typeof minAgeRestriction !== 'undefined' && typeof minAgeRestriction !== 'number') || minAgeRestriction < 1 || minAgeRestriction > 18) {
        errors.errorsMessages.push({ message: 'Invalid minAgeRestriction ', field: 'minAgeRestriction' });
    }
    else {
        minAgeRestriction = video.minAgeRestriction;
    }
    if (!publicationDate) {
        publicationDate = video.publicationDate;
    }
    if (availableResolutions) {
        if (Array.isArray(availableResolutions)) {
            const validResolutions = Object.values(AvailableResolutions);
            for (const resolution of availableResolutions) {
                if (!validResolutions.includes(resolution)) {
                    errors.errorsMessages.push({ message: 'Invalid availableResolutions', field: 'availableResolutions' });
                    break;
                }
            }
            video.availableResolutions = availableResolutions;
        }
        else {
            errors.errorsMessages.push({ message: 'Invalid availableResolutions ', field: 'availableResolutions' });
        }
    }
    if (errors.errorsMessages.length) {
        res.status(400).send(errors);
        return;
    }
    const newItem = Object.assign(Object.assign({}, video), { canBeDownloaded,
        title,
        author,
        minAgeRestriction,
        publicationDate,
        availableResolutions });
    exports.videoDb.splice(videoIndex, 1, newItem);
    res.sendStatus(204);
});
exports.videosRouter.delete('/:id', (req, res) => {
    const id = +req.params.id;
    const indexToDelete = exports.videoDb.findIndex(video => video.id === id);
    if (indexToDelete !== -1) {
        exports.videoDb.splice(indexToDelete, 1);
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
