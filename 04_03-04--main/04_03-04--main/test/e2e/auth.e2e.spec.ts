import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { MailerService } from '@nestjs-modules/mailer';
import * as mockdate from 'mockdate';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/aplly-app-setting';
import { AuthTestManager } from '../common/authTestManager';

const userLoginData = {
  login: 'test',
  email: 'test@mail.ru',
  password: 'testTest',
};

describe('Auth e2e test', () => {
  let app: INestApplication;
  let httpServer: string;
  let authTestManager: AuthTestManager;
  let jestSpyEmail;

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
    authTestManager = new AuthTestManager(app);
    //clean the database before the tests
    await request(httpServer).delete('/testing/all-data').expect(204);
  });
  beforeEach(async () => {
    //disable email sending
    jestSpyEmail = jest.spyOn(MailerService.prototype, 'sendMail').mockImplementation(() => Promise.resolve(true));
  });

  afterAll(async () => {
    await app.close();
  });

  describe('registration flow', () => {
    it('registration user', async () => {
      await authTestManager.registration(userLoginData, 204);
      //check that there was a call to the Email Service
      expect(jestSpyEmail).toBeCalled();
      //clear the call counter for the following tests
      jest.clearAllMocks();
    });

    it('should not be able to register a user with the same username and email address.', async () => {
      await authTestManager.registration(userLoginData, 400);
      expect(jestSpyEmail).not.toBeCalled();
    });

    it('should not be able to register a user with the same username and email address.', async () => {
      const response = await authTestManager.registration(
        { ...userLoginData, login: '', password: '', email: '' },
        400,
      );
      expect(response.body.errorsMessages.length).toEqual(3);
      expect(response.body.errorsMessages[0].field).toEqual('login');
      expect(response.body.errorsMessages[1].field).toEqual('password');
      expect(response.body.errorsMessages[2].field).toEqual('email');

      expect(jestSpyEmail).not.toBeCalled();
    });

    it('clear bd', async () => {
      await request(httpServer).delete('/testing/all-data').expect(204);
    });
  });

  describe('registration confirmation', () => {
    afterAll(async () => {
      await request(httpServer).delete('/testing/all-data').expect(204);
      jest.clearAllMocks();
      mockdate.reset();
    });
    it('registration user with mocked code', async () => {
      //Mock code
      jest.spyOn(crypto, 'randomUUID').mockImplementation(() => '11-11-11-11-11');
      expect.setState({ code: '11-11-11-11-11' });
      await authTestManager.registration(userLoginData, 204);
      //check that there was a call to the Email Service
      expect(jestSpyEmail).toBeCalled();
      //clear the call counter for the following tests
      jest.clearAllMocks();
    });

    it('confirm account using the code', async () => {
      const { code } = expect.getState();
      await request(httpServer).post('/auth/registration-confirmation').send({ code }).expect(204);
    });
    it('shouldn"t confirm already confirm account', async () => {
      const { code } = expect.getState();
      const repspone = await request(httpServer).post('/auth/registration-confirmation').send({ code }).expect(400);
      expect(repspone.body.errorsMessages[0].field).toEqual('code');

      await request(httpServer).delete('/testing/all-data').expect(204);
    });

    it('registration user with mocked old date', async () => {
      //Mock date
      mockdate.set(new Date(Date.now() - 9999999999));
      //Moc code
      jest.spyOn(crypto, 'randomUUID').mockImplementation(() => '11-11-11-11-11');

      await authTestManager.registration(userLoginData, 204);
      //clear the call counter for the following tests
      jest.clearAllMocks();
      mockdate.reset();
    });

    it('shouldn"t confirm old confirm code', async () => {
      const { code } = expect.getState();
      const repspone = await request(httpServer).post('/auth/registration-confirmation').send({ code }).expect(400);
      expect(repspone.body.errorsMessages[0].field).toEqual('code');
    });
  });

  describe('registration-email-resending', () => {
    beforeAll(async () => {
      await request(httpServer).delete('/testing/all-data').expect(204);
      jest.clearAllMocks();
      mockdate.reset();
    });

    it('registration user', async () => {
      await authTestManager.registration(userLoginData, 204);
      //check that there was a call to the Email Service
      expect(jestSpyEmail).toBeCalled();
      //clear the call counter for the following tests
      mockdate.reset();
    });
    it('email resending', async () => {
      //const { code } = expect.getState();
      //Moc code
      jest.spyOn(crypto, 'randomUUID').mockImplementation(() => '11-11-11-11-11');

      await request(httpServer)
        .post('/auth/registration-email-resending')
        .send({ email: userLoginData.email })
        .expect(204);
      expect(jestSpyEmail).toBeCalled();
    });
    it('confirm account using the code', async () => {
      const { code } = expect.getState();
      await request(httpServer).post('/auth/registration-confirmation').send({ code }).expect(204);
    });
    it("shouldn't send an email to an already confirmed account", async () => {
      //const { code } = expect.getState();
      //Moc code
      jest.spyOn(crypto, 'randomUUID').mockImplementation(() => '11-11-11-11-11');

      const response = await request(httpServer)
        .post('/auth/registration-email-resending')
        .send({ email: userLoginData.email })
        .expect(400);

      expect(response.body.errorsMessages[0].field).toBe('email');
      expect(jestSpyEmail).toBeCalled();
    });
  });

  describe('login', () => {
    beforeAll(async () => {
      jest.clearAllMocks();
      mockdate.reset();
    });
    it('login user with good data', async () => {
      const repspone = await authTestManager.login(userLoginData.email, userLoginData.password, 200);
      //regEx for JWT token [\w-]*\.[\w-]*\.[\w-]*/g
      expect(repspone.body.accessToken).toMatch(/^[\w-]*\.[\w-]*\.[\w-]*/);
    });
    it('cant login user with incorrect pass | email', async () => {
      await authTestManager.login(userLoginData.email, '123456', 401);
      await authTestManager.login('ugaChagaUga@bebe.com', userLoginData.password, 401);
    });
  });
});
