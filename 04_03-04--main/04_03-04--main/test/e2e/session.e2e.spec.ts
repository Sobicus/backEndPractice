import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/aplly-app-setting';
import { UserTestManager } from '../common/userTestManager';
import { delay } from '../utils/dealy';

const userLoginData = {
  login: 'test',
  email: 'test@mail.ru',
  password: 'testTest',
};
const user2LoginData = {
  login: '2test',
  email: '2test@mail.ru',
  password: '2testTest',
};
let refreshCode1: string;
let refreshCode2: string;
let refreshCode3: string;
let refreshCode4: string;
let user2refreshCode: string;
let devise2id;
describe('session e2e test', () => {
  let app: INestApplication;
  let httpServer: string;
  let userTestManager: UserTestManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }) //Мокаем ддос защиту для того что бы она не мешала
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();

    //connect managers for testing
    userTestManager = new UserTestManager(app);
    //clean the database before the tests
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
  it('create user', async () => {
    await userTestManager.createUser(201, userLoginData);
    await userTestManager.createUser(201, user2LoginData);
  });
  it('login user2 ', async () => {
    await request(httpServer)
      .post(`/auth/login`)
      .set('User-agent', 'test1')
      .send({
        loginOrEmail: user2LoginData.login,
        password: user2LoginData.password,
      })
      .expect(200)
      .then((response) => {
        user2refreshCode = response.headers['set-cookie'];
        expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
      });
  });
  describe('create 4 session', () => {
    afterEach(async () => {
      await delay(500);
    });
    it('should  login with user-agent1 ', async () => {
      await request(httpServer)
        .post(`/auth/login`)
        .set('User-agent', 'test1')
        .send({
          loginOrEmail: userLoginData.login,
          password: userLoginData.password,
        })
        .expect(200)
        .then((response) => {
          refreshCode1 = response.headers['set-cookie'];
          expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
        });
    });
    it('should  login with user-agent2 ', async () => {
      await request(httpServer)
        .post(`/auth/login`)
        .set('User-agent', 'test2')
        .send({
          loginOrEmail: userLoginData.login,
          password: userLoginData.password,
        })
        .expect(200)
        .then((response) => {
          refreshCode2 = response.headers['set-cookie'];
          expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
        });
    });
    it('should  login with user-agent3 ', async () => {
      await request(httpServer)
        .post(`/auth/login`)
        .set('User-agent', 'test3')
        .send({
          loginOrEmail: userLoginData.login,
          password: userLoginData.password,
        })
        .expect(200)
        .then((response) => {
          refreshCode3 = response.headers['set-cookie'];
          expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
        });
    });
    it('should  login with user-agent4 ', async () => {
      await request(httpServer)
        .post(`/auth/login`)
        .set('User-agent', 'test4')
        .send({
          loginOrEmail: userLoginData.login,
          password: userLoginData.password,
        })
        .expect(200)
        .then((response) => {
          refreshCode4 = response.headers['set-cookie'];
          expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
        });
    });
    it('should get four user session ', async () => {
      await request(httpServer)
        .get('/security/devices')
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(4);
          expect(new Date(response.body[3].lastActiveDate).getTime()).toBeGreaterThan(
            new Date(response.body[0].lastActiveDate).getTime(),
          );
        });
    });
  });
  describe('upadte refresh token', () => {
    //update refToken device1 and wtite old token on this
    let oldRefToken1: string;
    it('should  upate token user-agent1 ', async () => {
      await request(httpServer)
        .post(`/auth/refresh-token`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(200)
        .then((response) => {
          oldRefToken1 = refreshCode1;
          refreshCode1 = response.headers['set-cookie'];
          expect(response.body.accessToken).toMatch(/^([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)\.([a-zA-Z0-9\-_=]+)$/);
        });
    });
    it('should not get a new token pair because the old token is being used ', async () => {
      await request(httpServer)
        .post(`/auth/refresh-token`)
        .set('Cookie', oldRefToken1)
        .set('User-agent', 'test1')
        .expect(401);
    });

    it('should get four user session and test1 session date should be changed ', async () => {
      await request(httpServer)
        .get(`/security/devices`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(200)
        .then((response) => {
          const devise2 = response.body.find((e) => e['title'] === 'test2');
          expect(response.body).toHaveLength(4);
          expect(new Date(response.body[0].lastActiveDate).getTime()).toBeGreaterThan(
            new Date(response.body[1].lastActiveDate).getTime(),
          );
          devise2id = devise2.deviceId;
        });
    });
  });
  describe('delete session', () => {
    it('trying to delete someone else session ', async () => {
      await request(httpServer)
        .delete(`/security/devices/${devise2id}`)
        .set('Cookie', user2refreshCode)
        .set('User-agent', 'test2')
        .expect(403);
    });
    it('trying to delete session without auth ', async () => {
      await request(httpServer)
        .delete(`/security/devices/${devise2id}`)
        .set('Cookie', '123')
        .set('User-agent', 'test2')
        .expect(401);
    });
    it('delete session 2 (title = test2) ', async () => {
      await request(httpServer)
        .delete(`/security/devices/${devise2id}`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(204);
    });
    it('cant delete session 2 bsc his not exist ', async () => {
      await request(httpServer)
        .delete(`/security/devices/${devise2id}`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(404);
    });
    it('should get three session and test2 session should not exist', async () => {
      await request(httpServer)
        .get(`/security/devices`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(3);
          expect(response.body.find((e) => e['title'] === 'test2')).toBeFalsy();
          expect(response.body.find((e) => e['title'] === 'test1')).toBeTruthy();
          expect(response.body.find((e) => e['title'] === 'test3')).toBeTruthy();
          expect(response.body.find((e) => e['title'] === 'test4')).toBeTruthy();
        });
    });
  });
  describe('logout', () => {
    it('deal logout session test3 ', async () => {
      await request(httpServer).post(`/auth/logout`).set('Cookie', refreshCode3).set('User-agent', 'test3').expect(204);
    });
    it('cant get sessions after logout ', async () => {
      await request(httpServer).get(`/security/devices`).set('Cookie', refreshCode3).expect(401);
    });
    it('cant get new tokens pair after logout ', async () => {
      await request(httpServer).post(`/auth/refresh-token`).set('Cookie', refreshCode3).expect(401);
    });
    it(' get two user session and test2,test3 session should be exist ', async () => {
      await request(httpServer)
        .get(`/security/devices`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveLength(2);
          expect(response.body.find((e) => e['title'] === 'test2')).toBeFalsy();
          expect(response.body.find((e) => e['title'] === 'test3')).toBeFalsy();
          expect(response.body.find((e) => e['title'] === 'test1')).toBeTruthy();
          expect(response.body.find((e) => e['title'] === 'test4')).toBeTruthy();
        });
    });
  });
  describe('terminate other session', () => {
    it(' deal logout session test1 ', async () => {
      await request(httpServer).post(`/auth/logout`).set('Cookie', refreshCode1).set('User-agent', 'test1').expect(204);
    });
    it('do not get session list bcs test1 logout ', async () => {
      await request(httpServer)
        .get(`/security/devices`)
        .set('Cookie', refreshCode1)
        .set('User-agent', 'test1')
        .expect(401);
    });
  });
});
