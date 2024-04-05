/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BlogUpdateType, PostToBlogCreateModel } from '../../src/features/blogs/types/input';
import { PostCreateModel } from '../../src/features/posts/types/input';

export class PostTestManager {
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

  async createPost(postData: PostCreateModel, status: number, adminData?: { login: string; password: string }) {
    // noinspection JSStringConcatenationToES6Template
    // eslint-disable-next-line prettier/prettier
    const authData = adminData ?? this.adminData
    return request(this.app.getHttpServer())
      .post(`/posts`)
      .auth(authData.login, authData.password)
      .send(postData)
      .expect(status);
  }

  async updatePost(
    postData: BlogUpdateType,
    postId: string,
    status: number,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    return request(this.app.getHttpServer())
      .put(`/posts/${postId}`)
      .auth(authData.login, authData.password)
      .send(postData)
      .expect(status);
  }
  async createPostToBlog(
    postData: PostToBlogCreateModel,
    blogId: string,
    status: number,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    return request(this.app.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .auth(authData.login, authData.password)
      .send(postData)
      .expect(status);
  }
}
