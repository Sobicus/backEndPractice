import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { UserCreateModel } from '../../src/features/users/types/input';

export class UserTestManager {
  public adminData: { login: string; password: string };
  public userDefaultCreateData: UserCreateModel;
  constructor(protected readonly app: INestApplication) {
    this.userDefaultCreateData = {
      login: 'loginTest',
      password: 'qwerty',
      email: 'linesreen@mail.ru',
    };
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async createUser(
    status: number = 201,
    userData?: UserCreateModel | null,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    const userCreateData = userData ?? this.userDefaultCreateData;
    return request(this.app.getHttpServer())
      .post(`/users`)
      .auth(authData.login, authData.password)
      .send(userCreateData)
      .expect(status);
  }
}
