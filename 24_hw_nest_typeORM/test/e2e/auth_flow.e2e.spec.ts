import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import request from 'supertest';
import { EmailService } from '../../src/base/mail/email-server.service';
import crypto from 'crypto';
import dateFns from 'date-fns';
import { UsersRepository } from '../../src/features/users/infrastructure/users.repository';
import { DataSource } from 'typeorm';

describe('Auth flow', () => {
  //start server
  let server: INestApplication;
  let app;
  const mockedUUID = crypto.randomUUID();
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    server = moduleRef.createNestApplication();
    appSettings(server);
    await server.init();
    //we can use this dataSource for manupulating data in db
    dataSource = await moduleRef.resolve(DataSource);
    app = server.getHttpServer();
    await request(app).delete('/testing/all-data').expect(204);

    //mock email sendUserConfirmationCode
    jest
      .spyOn(EmailService.prototype, 'sendUserConfirmationCode')
      .mockImplementation(() => Promise.resolve());
    //mock code
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => mockedUUID);
    //mock sendUserConfirmationCode
    jest
      .spyOn(EmailService.prototype, 'sendUserConfirmationCode')
      .mockImplementation(() => Promise.resolve());
    //mock sendPasswordRecoveryCode
    jest
      .spyOn(EmailService.prototype, 'sendPasswordRecoveryCode')
      .mockImplementation(() => Promise.resolve());
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await request(app).delete('/testing/all-data').expect(204);
    await server.close();
  });
  //registration user flow /api/auth/registration
  describe('Registration user flow', () => {
    it('Returns 204 and user data in body', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'test1',
          password: 'test11',
          email: 'test1@gmail.com',
        })
        .expect(204);
    });
    it('Returns 400 if user already exists', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'test1',
          password: 'test11',
          email: 'test1@gmail.com',
        })
        .expect(400);
    });
    it('Return 400 if login less than 3 symbols', async () => {
      await request(app)
        .post('/auth/registration')
        .send({ login: 't1', password: 'test11', email: 'test2@gmail.com' })
        .expect(400);
    });
    it('Return 400 if password less than 6 symbols', async () => {
      await request(app)
        .post('/auth/registration')
        .send({ login: 'test2', password: 'test1', email: 'test2@gmail.com' })
        .expect(400);
    });
    it('Return 400 if password more than 20 symbols', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'test2',
          password: 'test12345678909876543',
          email: 'test2@gmail.com',
        })
        .expect(400);
    });
    it('Return 400 if login more than 10 symbols', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'test1234567',
          password: 'test11',
          email: 'test2@gmail.com',
        })
        .expect(400);
    });
    it('Return 400 if email is not in correct format ', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'test2',
          password: 'test22',
          email: 'test2gmail.com',
        })
        .expect(400);
    });
  });
  //registration confirmation user flow
  describe('Registration confirmation flow', () => {
    console.log('mockedUUID1', mockedUUID);
    it('Returns 204 and user data in body', async () => {
      console.log('mockedUUID2', mockedUUID);
      await request(app)
        .post('/auth/registration-confirmation')
        .send({ code: mockedUUID })
        .expect(204)
        .then((response) => {
          console.log('Response:', response.body);
        });
    });
    console.log('mockedUUID3', mockedUUID);
    it('Returns 400 if code is not valid', async () => {
      console.log('mockedUUID4', mockedUUID);
      await request(app)
        .post('/auth/registration-confirmation')
        .send({ code: '123' })
        .expect(400)
        .then((response) => {
          console.log(response.body);
        });
    });
    it('Returns 400 if code is expired', async () => {
      jest.mock('date-fns', () => ({
        add: () => new Date() as ReturnType<typeof dateFns.add>,
      }));

      await request(app)
        .post('/auth/registration-confirmation')
        .send(mockedUUID)
        .expect(400);
    });
  });
  //registration email resending flow
  //todo how to check email sending
  describe('Registration email resending flow', () => {
    it('Returns 204 create users', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'resending',
          password: 'test11',
          email: 'resending@gmail.com',
        })
        .expect(204);
    });
    it('Returns 204 registration-email-resending has been send', async () => {
      await request(app)
        .post('/auth/registration-email-resending')
        .send({ email: 'resending@gmail.com' })
        .expect(204);
    });
    it('Returns 400 email doesnt not exist', async () => {
      await request(app)
        .post('/auth/registration-email-resending')
        .send({ email: 'resendin@gmail.com' })
        .expect(400);
    });
    it('Returns 400 If the inputModel has invalid email (for example 222^gmail.com)', async () => {
      await request(app)
        .post('/auth/registration-email-resending')
        .send({ email: 'resending-gmail.com' })
        .expect(400);
    });
  });
  //password recovery flow
  //todo how to check email sending
  describe('Password recovery flow', () => {
    it('Returns 204 create users', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'passrec',
          password: 'test11',
          email: 'passrec@gmail.com',
        })
        .expect(204);
    });
    it('Returns 204 recovery password has been send', async () => {
      await request(app)
        .post('/auth/password-recovery')
        .send({ email: 'passrec@gmail.com' })
        .expect(204);
    });
    it('Returns 400 email has not exist', async () => {
      await request(app)
        .post('/auth/password-recovery')
        .send({ email: 'passre@gmail.com' })
        .expect(400);
    });
    it('Returns 400 if the inputModel has invalid email (for example 222^gmail.com)', async () => {
      await request(app)
        .post('/auth/password-recovery')
        .send({ email: 'passrec$gmail.com' })
        .expect(400);
    });
  });
  //new password flow
  //todo how to check flow new password
  describe('New password flow', () => {
    const email = 'newpass@gmail.com';
    let findUser;
    it('Returns 204 create users', async () => {
      await request(app)
        .post('/auth/registration')
        .send({
          login: 'newpass',
          password: 'test11',
          email: 'newpass@gmail.com',
        })
        .expect(204);
      findUser = await UsersRepository.prototype.findUserByEmail(email);
      console.log('findUser', findUser);
    });
  });
});
