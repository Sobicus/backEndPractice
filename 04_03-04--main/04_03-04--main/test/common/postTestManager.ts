/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BlogCreateModel, PostToBlogCreateModel } from '../../src/features/blogs/types/input';
import { PostCreateModel } from '../../src/features/posts/types/input';

export class PostTestManager {
  public adminData: {
    login: string;
    password: string;
  };

  public basicPostToBlogData: {
    title: string;
    shortDescription: string;
    content: string;
  };

  constructor(protected readonly app: INestApplication) {
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
    this.basicPostToBlogData = {
      title: `titleTest`,
      shortDescription: `shortDescriptionTest`,
      content: `contentTest`,
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
    postData: BlogCreateModel,
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
    postData: PostToBlogCreateModel | null,
    blogId: string,
    status: number = 201,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    const postCreateData = postData ?? this.basicPostToBlogData;
    return request(this.app.getHttpServer())
      .post(`/blogs/${blogId}/posts`)
      .auth(authData.login, authData.password)
      .send(postCreateData)
      .expect(status);
  }
}
