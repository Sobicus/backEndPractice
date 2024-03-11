import {app} from '../app'
import request from 'supertest'
import mongoose from 'mongoose'
import {runDb} from "../repositories/db";

describe('blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('should return 200 and empty array', async () => {
        await request(app).get('/blogs').expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []
        })
    })
    it('should return 404 blog by id,blog does not exist in database', async () => {
        await request(app).get('/blogs/6516f5a5ec6f53ecf360d7a7').expect(404)
    })
    it('should return 404 post by id,post does not exist in database', async () => {
        await request(app).get('/blogs/6516f5a5ec6f53ecf360d7a7/posts').expect(404)
    })
})


describe('Mongoose integration', () => {
    //mongo.memoryServer---------------------------------------NEED
    const mongoURI = 'mongodb://0.0.0.0:27017/home_works'

    beforeAll(async () => {
        runDb()
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('GET blogs', () => {
        it('+ GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        })
    })
})