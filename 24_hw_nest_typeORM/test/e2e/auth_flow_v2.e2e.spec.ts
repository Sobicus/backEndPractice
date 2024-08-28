import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import request from 'supertest';
import { EmailService } from '../../src/base/mail/email-server.service';
import { DataSource } from 'typeorm';
import { EmailConfirmation } from '../../src/features/users/domain/emailConfirmation.entity';
import { Users } from '../../src/features/users/domain/users.entity';
import { add } from 'date-fns';

describe('Auth flow', () => {
  //start server
  let server: INestApplication;
  let app;
  let dataSource: DataSource;
  const user1 = 'test1';
  const user1Email = 'test1@gmail.com';
  let user;

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
    // jest
    //   .spyOn(EmailConfirmation, 'createEmailConfirmation')
    //   .mockImplementation((userId: number) => {
    //     return {
    //       confirmationCode: '1234567',
    //       expirationDate: add(new Date(), { days: -1 }),
    //       isConfirmed: false,
    //       userId,
    //     } as unknown as EmailConfirmation;
    //   });
    //mock email sendUserConfirmationCode
    // jest
    //   .spyOn(EmailService.prototype, 'sendUserConfirmationCode')
    //   .mockImplementation(() => (return{});

    afterAll(async () => {
      jest.clearAllMocks();
      await request(app).delete('/testing/all-data').expect(204);
      await server.close();
    });
    //registration user flow /api/auth/registration
    describe('Registration user flow', () => {
      it('Returns 204 and user data in body', async () => {
        const response = await request(app)
          .post('/auth/registration')
          .send({
            login: user1,
            password: 'test11',
            email: user1Email,
          })
          .expect(204);

        // Get userId from database
        const user = await dataSource
          .getRepository(Users)
          .createQueryBuilder('user')
          .where('user.login = :login', { login: 'test1' })
          .getOne();
        // if (user) {
        //   const userId = user.id;
        //
        //   // Mock createEmailConfirmation with dynamic userId
        //   jest
        //     .spyOn(EmailConfirmation, 'createEmailConfirmation')
        //     .mockImplementation(() => {
        //       const emailConfirmation = new EmailConfirmation();
        //       emailConfirmation.confirmationCode = 'mock-code';
        //       emailConfirmation.expirationDate = new Date();
        //       emailConfirmation.isConfirmed = false;
        //       emailConfirmation.userId = userId;
        //       emailConfirmation.user = user; // Добавляем свойство user
        //       return emailConfirmation;
        //     });
        // }
      });
      it('Returns 400 if user already exists', async () => {
        await request(app)
          .post('/auth/registration')
          .send({
            login: user1,
            password: 'test11',
            email: user1Email,
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
      console.log('user111111111111', user1);
      beforeEach(async () => {
        user = await dataSource
          .getRepository(Users)
          .createQueryBuilder('user')
          .leftJoinAndSelect('user.emailConfirmation', 'emailConfirmation')
          .where('user.login = :login', { login: user1 })
          .getOne();
      });

      it('Returns 204 and user data in body', async () => {
        console.log('user=========', user);
        console.log('mockedUUID2', user?.id);
        await request(app)
          .post('/auth/registration-confirmation')
          .send({ code: user!.emailConfirmation.confirmationCode })
          .expect(204)
          .then((response) => {
            console.log('Response:', response.body);
          });
      });
      console.log('mockedUUID3', user?.id);
      it('Returns 400 if code is not valid', async () => {
        console.log('mockedUUID4', user?.id);
        await request(app)
          .post('/auth/registration-confirmation')
          .send({ code: '123' })
          .expect(400)
          .then((response) => {
            console.log(response.body);
          });
      });
      it('Returns 400 if code is expired', async () => {
        const user2 = {
          login: 'SxkAI9B7x4',
          password: 'string',
          email: 'example@example.com',
          passwordSalt: 'string',
          passwordHash: 'string',
        };
        const user = await dataSource.getRepository(Users).save(user2);
        await dataSource.getRepository(EmailConfirmation).save({
          userId: user.id,
          expirationDate: add(new Date(), {
            days: -1,
          }),
          isConfirmed: false,
          confirmationCode: '1234567',
        });

        await request(app)
          .post('/auth/registration-confirmation')
          .send({ code: '1234567' })
          .expect(400);
      });
    });
  });
});
