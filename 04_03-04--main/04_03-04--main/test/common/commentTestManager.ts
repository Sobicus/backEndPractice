/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { BlogCreateModel } from '../../src/features/blogs/types/input';
import { OutputCommentType } from '../../src/features/comments/types/comments/output';

export class CommentTestManager {
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

  async createCommentToPost(postId: string, comment: string, token: string, status: number = 201) {
    // noinspection JSStringConcatenationToES6Template
    // eslint-disable-next-line prettier/prettier
    return request(this.app.getHttpServer())
      .post(`/posts/${postId}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: comment })
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

  async createNcommentsToPost(
    n: number,
    postId: string,
    token: string,
    optional: string = '',
  ): Promise<OutputCommentType[]> {
    const basicContent = 'userCommentTestTestTest';
    const comments: OutputCommentType[] = [];
    for (let i = 0; i < n; i++) {
      const response = await request(this.app.getHttpServer())
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: `${i}${optional}${basicContent}` })
        .expect(201);
      comments.push(response.body);
    }
    return comments;
  }
}
