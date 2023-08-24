import request from "supertest";
// import {describe} from "node:test";
import {AvailableResolutions, VideoType, app} from "../src/settings";


describe('check videos', () => {
    beforeAll(async ()=>{
        await request(app).delete('/testing/all-data')
    })
    it('should return 200 and empty array', async () => {
        await request(app).get('/videos').expect(200, [])
    })
    it('1111', async ()=>{
        await request(app).get('/videos/0').expect(404)
    })
    it('2222', async ()=>{
        await request(app).post('/videos').send({
            title: "string",
            author: "string",
            availableResolutions: ["P144"]
        }).expect(201, [] as VideoType[])

    })
})


