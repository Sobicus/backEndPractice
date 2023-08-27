import request from "supertest";
// import {describe} from "node:test";
import {AvailableResolutions, VideoType, app} from "../src/settings";


describe('check videos', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('should return 200 and empty array', async () => {
        await request(app).get('/videos').expect(200, [])
    })
    it('should return 404', async () => {
        await request(app).get('/videos/0').expect(404)
    })
    it('should`t create course with incorect title data return error message and 400', async () => {
        await request(app).post('/videos').send({
            title: "",
            author: "With out title",
            availableResolutions: ["P144"]
        }).expect(400, {errorsMessages: [{message: 'Invalid  title', field: 'title'}]})
        await request(app).get('/videos').expect(200, [])

    })
    it('should`t create course with incorect author data return error message and 400', async () => {
        await request(app).post('/videos').send({
            title: "With out author",
            author: "",
            availableResolutions: ["P144"]
        }).expect(400, {errorsMessages: [{message: 'Invalid author ', field: 'author'}]})
        await request(app).get('/videos').expect(200, [])
    })
    it('should`t create course with incorect availableResolutions data return error message and 400', async () => {
        await request(app).post('/videos').send({
            title: "With out availableResolutions",
            author: "availableResolutions",
            availableResolutions: []
        }).expect(400, {
            errorsMessages: [{
                message: 'Invalid availableResolutions',
                field: 'availableResolutions'
            }]
        })
        await request(app).get('/videos').expect(200, [])
    })
    it('should create course with correct input date', async () => {
        const createResponse = await request(app).post('/videos').send(
            {
                title: "Test Object",
                author: "Test Object",
                availableResolutions: ["P144"]
            }
        ).expect(201)
        const createdCourse = createResponse.body
        expect(createdCourse).toEqual({
            id: expect.any(Number),
            "canBeDownloaded": false,
            "minAgeRestriction": null,
            "createdAt": expect.any(String),
            "publicationDate": expect.any(String),
            title: "Test Object",
            author: "Test Object",
            availableResolutions: ["P144"]
        } as VideoType)

        await request(app).get('/videos').expect(200, [createdCourse])
    })
})


