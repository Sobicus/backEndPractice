import request from "supertest";
import {app} from "../app";

describe('rate limit test', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    // it('should return 204 create User', async () => {
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(400)
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(400)
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(400)
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(400)
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(400)
    //     await request(app).post('/auth/registration').send({
    //         login: '',
    //         password: 'qwerty',
    //         email: 'simsbury652@gmail.com'
    //     }).expect(429)
    // })

    it('login', async () => {
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(400)
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(400)
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(400)
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(400)
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(400)
        await request(app).post('/auth/login').send(
            {
                "password": "",
                "loginOrEmail": "test2email@gmail.com"
            }
        ).expect(429)
    })
})