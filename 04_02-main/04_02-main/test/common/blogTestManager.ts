/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BlogUpdateType } from '../../src/features/blogs/types/input';

export class BlogTestManager {
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

  async createBlog(blogData: BlogUpdateType, status: number, adminData?: { login: string; password: string }) {
    const authData = adminData ?? this.adminData;
    return request(this.app.getHttpServer())
      .post('/blogs')
      .auth(authData.login, authData.password)
      .send(blogData)
      .expect(status);
  }

  async updateBlog(
    blogData: BlogUpdateType,
    blogId: string,
    status: number,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    return request(this.app.getHttpServer())
      .put(`/blogs/${blogId}`)
      .auth(authData.login, authData.password)
      .send(blogData)
      .expect(status);
  }
}
