// noinspection JSUnresolvedReference

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/aplly-app-setting';
import { UserTestManager } from '../common/userTestManager';

describe('Users e2e test', () => {
  let app: INestApplication;
  let httpServer: string;

  let userTestManager: UserTestManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
  const adminAuth = {
    login: 'admin',
    password: 'qwerty',
  };
  const userCreateData = {
    login: 'logTest',
    password: 'qwerty',
    email: 'linesreen@mail.ru',
  };

  const users: any[] = [];
  let usersResp: any[] = [];
  //Making data blanks to create a post
  for (let i = 1; i < 10; i++) {
    users.push({
      ...userCreateData,
      login: `${i}${userCreateData.login}`,
      password: `${i}${userCreateData.password}`,
      email: `${i}${userCreateData.email}`,
    });
  }
  //creating 11 users for further testing
  it('create 9 users', async () => {
    usersResp = await Promise.all(
      users.map(async (user) => {
        const response = await userTestManager.createUser(201, user);
        expect(response.body.login).toEqual(user.login);
        expect(response.body.email).toEqual(user.email);
        return response.body;
      }),
    );
  });

  //-----------------------testing field validation------------------------
  it('shouldn"t create user with not valid login(short)', async () => {
    const response = await userTestManager.createUser(400, { ...userCreateData, login: '' });
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual('login');
  });
  it('shouldn"t create user with not valid login(length)', async () => {
    const response = await userTestManager.createUser(400, { ...userCreateData, login: 'saasdasdsadsadasd' });
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual('login');
  });
  it('shouldn"t create user with not valid password(short)', async () => {
    const response = await userTestManager.createUser(400, { ...userCreateData, password: '' });
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual('password');
  });
  it("shouldn't create user with not valid password(length)", async () => {
    const response = await userTestManager.createUser(400, {
      ...userCreateData,
      password: '123123112312312312312313223123',
    });
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual('password');
  });
  it('shouldnt create user with not valid email', async () => {
    const response = await userTestManager.createUser(400, { ...userCreateData, email: '' });
    expect(response.body.errorsMessages.length).toEqual(1);
    expect(response.body.errorsMessages[0].field).toEqual('email');
  });
  //------------------testing get all users with pagination-----------------
  //sortDirection=asc
  it('should return 9 users asc', async () => {
    const response = await request(httpServer)
      .get('/users/?sortDirection=asc&sortBy=login')
      .auth(adminAuth.login, adminAuth.password)
      .expect(200);

    expect(response.body.items.length).toEqual(9);
    expect(response.body.page).toEqual(1);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.totalCount).toEqual(9);

    expect(response.body.items[0]).toEqual(usersResp[0]);
    expect(response.body.items[1]).toEqual(usersResp[1]);
    expect(response.body.items[2]).toEqual(usersResp[2]);
    expect(response.body.items[3]).toEqual(usersResp[3]);
    expect(response.body.items[4]).toEqual(usersResp[4]);
    expect(response.body.items[5]).toEqual(usersResp[5]);
    expect(response.body.items[8]).toEqual(usersResp[8]);
  });
  //sortDirection=asc
  //pageNumber=2
  it('should"nt return users on blank page', async () => {
    const response = await request(httpServer)
      .get('/users/?sortDirection=asc&pageNumber=2')
      .auth(adminAuth.login, adminAuth.password)
      .expect(200);

    expect(response.body.items.length).toEqual(0);
    expect(response.body.page).toEqual(2);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.totalCount).toEqual(9);
  });
  //sortDirection=asc
  //pageNumber=2
  //pageSize=8
  it('should return 1 users on page number 2  asc', async () => {
    const response = await request(httpServer)
      .get('/users/?sortDirection=asc&pageNumber=2&pageSize=8')
      .auth(adminAuth.login, adminAuth.password)
      .expect(200);

    expect(response.body.items.length).toEqual(1);
    expect(response.body.page).toEqual(2);
    expect(response.body.pageSize).toEqual(8);
    expect(response.body.totalCount).toEqual(9);
  });
});
