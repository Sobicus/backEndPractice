import {app} from '../app'
import request from 'supertest'
import mongoose from 'mongoose'

describe('Mongoose integration', () => {
    const mongoURI = 'mongodb://0.0.0.0:27017/home_works'

    beforeAll(async () => {
        /* Connecting to the database. */
        await mongoose.connect(mongoURI)
        await request(app).delete('/testing/all-data')
    })

    afterAll(async () => {
        /* Closing database connection after each test. */
        await mongoose.connection.close()
    })

    describe('GET blogs', () => {
        it('GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        })
    })
    describe('Create blog', () => {
        it('GET blogs', async () => {
            const res_ = await request(app)
                .get('/blogs')
                .expect(200)
            expect(res_.body.items.length).toBe(0)
        })
        it('Create blogs', async () => {
            const res_ = await request(app)
                .post('/blogs')
                .set('Authorization', `Basic YWRtaW46cXdlcnR5`)
                .send({name: 'string', description: 'string', websiteUrl: 'string'})
                .expect(201)
            expect(res_.body.id).toBeDefined();
            expect(res_.body.id).toEqual(expect.any(String));
            expect(res_.body.createdAt).toBeDefined();
            expect(res_.body.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
            expect(res_.body.name).toBe('string')
            expect(res_.body.description).toBe('string')
            expect(res_.body.websiteUrl).toBe('string')
        })
    })
})