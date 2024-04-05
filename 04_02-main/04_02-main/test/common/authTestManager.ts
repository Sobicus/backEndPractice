/* eslint-disable @typescript-eslint/explicit-function-return-type,@typescript-eslint/ban-ts-comment */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserRegistrationModel } from '../../src/features/auth/types/input';

export class AuthTestManager {
  public adminData: {
    login: string;
    password: string;
  };
  constructor(protected readonly app: INestApplication) {
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
  }

  async registration(userData: UserRegistrationModel, status: number = 204) {
    return request(this.app.getHttpServer()).post('/auth/registration').send(userData).expect(status);
  }
  async login(loginOrEmail: string, password: string, status: number = 201) {
    return request(this.app.getHttpServer()).post('/auth/login').send({ loginOrEmail, password }).expect(status);
  }
  async getTokens(loginOrEmail: string, password: string) {
    const response = await this.login(loginOrEmail, password);
    const token = response.body.accessToken;

    //need ts ignore bcs ts type shit
    // @ts-ignore
    const cookiesArray: string[] = response.header['set-cookie'];
    const refreshToken = cookiesArray.find((cookie) => cookie.startsWith('refreshToken='));
    return { token, refreshToken };
  }
}
