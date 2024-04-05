// noinspection DuplicatedCode

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings/aplly-app-setting';
import { BlogTestManager } from './common/blogTestManager';
import { PostTestManager } from './common/postTestManager';

describe('Posts e2e', () => {
  let app: INestApplication;
  let httpServer;
  let postTestManager: PostTestManager;
  let blogTetsManager: BlogTestManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();

    postTestManager = new PostTestManager(app);
    blogTetsManager = new BlogTestManager(app);
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  const blogData = {
    name: 'test',
    description: 'description_test',
    websiteUrl: 'https://test.com',
  };

  let createdBlog;
  const posts: any = [];
  let postsInDb: any = [];

  it('create blog', async function () {
    const response = await blogTetsManager.createBlog(blogData, 201);
    createdBlog = response.body;

    //Making data blanks to create a post
    for (let i = 1; i < 10; i++) {
      posts.push({
        title: `titleTest${i}`,
        shortDescription: `shortDescriptionTest${i}`,
        content: `contentTest${i}`,
        blogId: `${createdBlog.id}`,
      });
    }
  });

  it("shouldn't create post with wrong data", async function () {
    const incorrectPostData = {
      title: ``,
      shortDescription: ``,
      content: ``,
      blogId: posts[0].blogId,
    };

    const response = await postTestManager.createPost(incorrectPostData, 400);
    expect(response.body.errorsMessages[0].field).toBe('title');
    expect(response.body.errorsMessages[1].field).toBe('shortDescription');
    expect(response.body.errorsMessages[2].field).toBe('content');
  });

  it("shouldn't create post with incorrect blogId", async function () {
    const incorrectPostData = {
      title: `qweqweqweqwe`,
      shortDescription: `qewqweqewqew`,
      content: `qweewqweqeqw`,
      blogId: `123`,
    };

    await postTestManager.createPost(incorrectPostData, 404);
  });

  it("shouldn't create post without authorization", async function () {
    await postTestManager.createPost(posts[0], 401, { login: 'admin', password: '1' });
    await postTestManager.createPost(posts[0], 401, { login: '1', password: 'qwerty' });
  });

  it('create 9 posts', async function () {
    postsInDb = await Promise.all(
      posts.map(async (post) => {
        const response = await postTestManager.createPost(post, 201);
        return response.body;
      }),
    );
    console.log(postsInDb);
  });

  it('get 9 blogs', async function () {
    const postsResponse = await request(httpServer).get('/posts/?sortBy=content&sortDirection=asc').expect(200);
    expect(postsResponse.body.items.length).toBe(9);
    expect(postsResponse.body.totalCount).toBe(9);
    expect(postsResponse.body.items[0]).toEqual(postsInDb[0]);
    expect(postsResponse.body.items[1]).toEqual(postsInDb[1]);
    expect(postsResponse.body.items[2]).toEqual(postsInDb[2]);
    expect(postsResponse.body.items[3]).toEqual(postsInDb[3]);
    expect(postsResponse.body.items[4]).toEqual(postsInDb[4]);
    expect(postsResponse.body.items[5]).toEqual(postsInDb[5]);
    expect(postsResponse.body.items[6]).toEqual(postsInDb[6]);
    expect(postsResponse.body.items[0].extendedLikesInfo).toBeTruthy();
  });

  it('get post 0 by id', async function () {
    const postResponse = await request(httpServer).get(`/posts/${postsInDb[0].id}`).expect(200);
    expect(postResponse.body).toEqual(postsInDb[0]);
  });

  it('get post 1 by id', async function () {
    const postResponse = await request(httpServer).get(`/posts/${postsInDb[1].id}`).expect(200);
    expect(postResponse.body).toEqual(postsInDb[1]);
  });

  it('get post 2 by id', async function () {
    const postResponse = await request(httpServer).get(`/posts/${postsInDb[2].id}`).expect(200);
    expect(postResponse.body).toEqual(postsInDb[2]);
  });

  it('get post by dont exist id', async function () {
    await request(httpServer).get(`/posts/123`).expect(404);
  });

  //update post
  it('update post 9', async function () {
    await postTestManager.updatePost(posts[0], postsInDb[8].id, 204);
  });

  //check that the correct post has been changed
  it('get blog by id', async function () {
    const reposnse = await request(httpServer).get(`/posts/${postsInDb[8].id}`).expect(200);
    expect(reposnse.body.title).toEqual(posts[0].title);
    expect(reposnse.body.shortDescription).toEqual(postsInDb[0].shortDescription);
    expect(reposnse.body.content).toEqual(postsInDb[0].content);
    expect(reposnse.body.id).toEqual(postsInDb[8].id);
  });

  it('update blog without password', async function () {
    await postTestManager.updatePost(posts[0], postsInDb[1].id, 401, {
      login: 'it-incubator',
      password: '123',
    });
  });

  it('post 1 sould do not change', async function () {
    const response = await request(httpServer).get(`/posts/${postsInDb[1].id}`).expect(200);
    expect(response.body.title).toEqual(postsInDb[1].title);
    expect(response.body.shortDescription).toEqual(postsInDb[1].shortDescription);
    expect(response.body.content).toEqual(postsInDb[1].content);
  });

  it('try delete blog without pass', async function () {
    await request(httpServer).delete(`/posts/${postsInDb[1].id}`).auth('admin', 'qwery').expect(401);
  });

  //Check to see what hasn't been deleted.
  it('post 1 sould do not change', async function () {
    const response = await request(httpServer).get(`/posts/${postsInDb[1].id}`).expect(200);
    expect(response.body.title).toEqual(postsInDb[1].title);
    expect(response.body.shortDescription).toEqual(postsInDb[1].shortDescription);
    expect(response.body.content).toEqual(postsInDb[1].content);
  });

  it('delete blog 9', async function () {
    await request(httpServer).delete(`/posts/${postsInDb[8].id}`).auth('admin', 'qwerty').expect(204);
  });

  it('trying to delete a blog that does not exist', async function () {
    await request(httpServer).delete(`/posts/${postsInDb[8].id}`).auth('admin', 'qwerty').expect(404);
  });

  //---------------------pagination tests-------------------------
  //sortBy=content
  //sortDirection=asc
  it('get 8 blogs asc', async function () {
    const postsResponse = await request(httpServer).get('/posts/?sortBy=content&sortDirection=asc').expect(200);
    expect(postsResponse.body.items.length).toBe(8);
    expect(postsResponse.body.totalCount).toBe(8);
    expect(postsResponse.body.items[0]).toEqual(postsInDb[0]);
    expect(postsResponse.body.items[1]).toEqual(postsInDb[1]);
    expect(postsResponse.body.items[2]).toEqual(postsInDb[2]);
    expect(postsResponse.body.items[3]).toEqual(postsInDb[3]);
    expect(postsResponse.body.items[4]).toEqual(postsInDb[4]);
    expect(postsResponse.body.items[5]).toEqual(postsInDb[5]);
    expect(postsResponse.body.items[6]).toEqual(postsInDb[6]);
    expect(postsResponse.body.items[0].extendedLikesInfo).toBeTruthy();
  });

  //sortBy=content
  //sortDirection=desc
  it('get 8 blogs desc', async function () {
    const postsResponse = await request(httpServer).get('/posts/?sortBy=content').expect(200);
    expect(postsResponse.body.items.length).toBe(8);
    expect(postsResponse.body.totalCount).toBe(8);
    expect(postsResponse.body.items[0]).toEqual(postsInDb[7]);
    expect(postsResponse.body.items[1]).toEqual(postsInDb[6]);
    expect(postsResponse.body.items[2]).toEqual(postsInDb[5]);
    expect(postsResponse.body.items[3]).toEqual(postsInDb[4]);
    expect(postsResponse.body.items[4]).toEqual(postsInDb[3]);
    expect(postsResponse.body.items[5]).toEqual(postsInDb[2]);
    expect(postsResponse.body.items[6]).toEqual(postsInDb[1]);
  });

  //sortBy=content
  //sortDirection=asc
  //pageSize=2
  it('get 2 blogs', async function () {
    const postsResponse = await request(httpServer)
      .get('/posts/?sortBy=content&sortDirection=asc&pageSize=2')
      .expect(200);
    expect(postsResponse.body.items.length).toBe(2);
    expect(postsResponse.body.totalCount).toBe(8);
    expect(postsResponse.body.pageSize).toBe(2);
    expect(postsResponse.body.items[0]).toEqual(postsInDb[0]);
    expect(postsResponse.body.items[1]).toEqual(postsInDb[1]);
  });

  //sortBy=content
  //sortDirection=asc
  //pageSize=2
  //pageNumber=2
  it('get 2 blogs', async function () {
    const postsResponse = await request(httpServer)
      .get('/posts/?sortBy=content&sortDirection=asc&pageSize=2&pageNumber=2')
      .expect(200);
    expect(postsResponse.body.items.length).toBe(2);
    expect(postsResponse.body.totalCount).toBe(8);
    expect(postsResponse.body.pageSize).toBe(2);
    expect(postsResponse.body.items[0]).toEqual(postsInDb[2]);
    expect(postsResponse.body.items[1]).toEqual(postsInDb[3]);
  });
});
