import request from "supertest";
import {app} from "../app";
import {userService} from "../domain/user-service";

describe('auth', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })
    it('should return 204 create User', async () => {
        await request(app).post('/auth/registration').send({
            login: 'MyTest1',
            password: 'qwerty',
            email: 'simsbury65@gmail.com'
        }).expect(204)
    })
    it('should return 204 user confirmation', async () => {
        const user = await userService.findUserByEmailOrLogin('MyTest1')
        console.log('user111111111',user)
        await request(app).post('/auth/registration-confirmation').send(
            {
                code: user!.emailConfirmation.confirmationCode
            }).expect(204)
        const user2 = await userService.findUserByEmailOrLogin('MyTest1')
        console.log('user2222222222',user2)
    })
    it('reseding code', async () => {
        await request(app).post('/auth/registration').send({
            login: 'MyTest',
            password: 'qwerty',
            email: 'simsbury65@gmail.com'
        }).expect(204)
        const userNotConfirmUser = await userService.findUserByEmailOrLogin('MyTest')
        console.log('code1', userNotConfirmUser!.emailConfirmation.confirmationCode)
        const cod1=userNotConfirmUser!.emailConfirmation.confirmationCode
        await request(app).post('/auth/registration-email-resending').send({
            email: 'simsbury65@gmail.com'
        }).expect(204)
        const userNotConfirmUserAfretEmailResending = await userService.findUserByEmailOrLogin('MyTest')
        console.log('code2', userNotConfirmUserAfretEmailResending!.emailConfirmation.confirmationCode)
        const cod2=userNotConfirmUserAfretEmailResending!.emailConfirmation.confirmationCode
        expect(cod1).not.toEqual(cod2)
    })
})

/*describe('tests for /users', () => {
    beforeAll(async () => {
        connection = await MongoClient.connect (process.env.mongoUrl!,
            {// @ts-ignore
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        db = await connection.db();
        await getRequest()
            .delete('/testing/all-data')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

    })

    afterAll(async () => {
        await connection.close()
    })*/