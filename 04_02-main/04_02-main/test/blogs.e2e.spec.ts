// noinspection DuplicatedCode

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { appSettings } from '../src/settings/aplly-app-setting';
import { BlogTestManager } from './common/blogTestManager';

describe('Blogs e2e', () => {
  let app: INestApplication;
  let httpServer;
  //let mongoServer: MongoMemoryServer;
  let blogTestManaget: BlogTestManager;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    appSettings(app);

    await app.init();

    httpServer = app.getHttpServer();

    //init blogTestManager
    blogTestManaget = new BlogTestManager(app);
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
    await mongoose.disconnect();
  });

  const adminData = {
    login: 'admin',
    password: 'qwerty',
  };

  const blogData = {
    name: 'test',
    description: 'description_test',
    websiteUrl: 'https://test.com',
  };

  const blogs: any[] = [];
  for (let i = 1; i < 13; i++) {
    blogs.push({
      name: `${blogData.name} ${i}`,
      description: `${blogData.description} ${i}`,
      websiteUrl: `https://google.com`,
    });
  }

  let blogsInDb: any = [];

  it("shouldn't create blog with wrong data", async function () {
    const incorrectBlogData = {
      name: '',
      description: '',
      websiteUrl: '',
    };
    const response = await blogTestManaget.createBlog(incorrectBlogData, 400);
    expect(response.body.errorsMessages[0].field).toBe('name');
    expect(response.body.errorsMessages[1].field).toBe('description');
    expect(response.body.errorsMessages[2].field).toBe('websiteUrl');
  });
  it("shouldn't create blog without authorization", async function () {
    await blogTestManaget.createBlog(blogData, 401, { ...adminData, password: '1' });
    await blogTestManaget.createBlog(blogData, 401, { ...adminData, login: '1' });
  });
  it('create 12 blogs', async function () {
    await blogTestManaget.createBlog(blogData, 401, { ...adminData, password: '1' });
    blogsInDb = await Promise.all(
      blogs.map(async (blog) => {
        const bebra = await blogTestManaget.createBlog(blog, 201);
        return bebra.body;
      }),
    );
  });
  it('get 10( 12 total) blogs', async function () {
    const blogsResponse = await request(httpServer).get('/blogs').expect(200);
    expect(blogsResponse.body.items.length).toBe(10);
    expect(blogsResponse.body.totalCount).toBe(12);
    expect(blogsResponse.body.items[0]).toEqual(blogsInDb[11]);
    expect(blogsResponse.body.items[1]).toEqual(blogsInDb[10]);
  });
  it('get blog by id', async function () {
    const blogsResponse = await request(httpServer).get(`/blogs/${blogsInDb[0].id}`).expect(200);
    expect(blogsResponse.body).toEqual(blogsInDb[0]);
  });
  it('get blog by id2', async function () {
    const blogsResponse = await request(httpServer).get(`/blogs/${blogsInDb[1].id}`).expect(200);
    expect(blogsResponse.body).toEqual(blogsInDb[1]);
  });
  it('get blog by id (dont exist)', async function () {
    await request(httpServer).get(`/blogs/123}`).expect(404);
  });
  it('update blog 12', async function () {
    await blogTestManaget.updateBlog(blogs[0], blogsInDb[11].id, 204, adminData);
  });
  it('get blog by id', async function () {
    const blogsResponse = await request(httpServer).get(`/blogs/${blogsInDb[11].id}`).expect(200);
    expect(blogsResponse.body.description).toEqual(blogsInDb[0].description);
    expect(blogsResponse.body.isMembership).toEqual(blogsInDb[0].isMembership);
    expect(blogsResponse.body.name).toEqual(blogsInDb[0].name);
  });
  it('update blog without password', async function () {
    await blogTestManaget.updateBlog(blogs[0], blogsInDb[11].id, 401, {
      ...adminData,
      password: '123',
    });
  });
  it('blog 12 sould do not change', async function () {
    const blogsResponse = await request(httpServer).get(`/blogs/${blogsInDb[11].id}`).expect(200);
    expect(blogsResponse.body.description).toEqual(blogsInDb[0].description);
    expect(blogsResponse.body.isMembership).toEqual(blogsInDb[0].isMembership);
    expect(blogsResponse.body.name).toEqual(blogsInDb[0].name);
  });
  it('try delete blog without pass', async function () {
    await request(httpServer).delete(`/blogs/${blogsInDb[5].id}`).auth('admin', 'qwery').expect(401);
  });
  it('check that the blog is still in place', async function () {
    const blogsResponse = await request(httpServer).get(`/blogs/${blogsInDb[5].id}`).expect(200);
    expect(blogsResponse.body.description).toEqual(blogsInDb[5].description);
    expect(blogsResponse.body.isMembership).toEqual(blogsInDb[5].isMembership);
    expect(blogsResponse.body.name).toEqual(blogsInDb[5].name);
  });
  it('delete blog 12', async function () {
    await request(httpServer).delete(`/blogs/${blogsInDb[11].id}`).auth('admin', 'qwerty').expect(204);
  });
  it('trying to delete a blog that does not exist', async function () {
    await request(httpServer).delete(`/blogs/${blogsInDb[11].id}`).auth('admin', 'qwerty').expect(404);
  });

  //--------------------Pagination tests ------------------
  it('get 10( 12 total) blogs', async function () {
    // sortDirection=asc
    // pageSize=5
    const blogsResponse = await request(httpServer).get('/blogs?sortDirection=asc&pageSize=5').expect(200);
    expect(blogsResponse.body.items.length).toBe(5);
    expect(blogsResponse.body.totalCount).toBe(11);
    expect(blogsResponse.body.pageSize).toBe(5);
    expect(blogsResponse.body.pagesCount).toBe(3);
    expect(blogsResponse.body.items[0]).toEqual(blogsInDb[0]);
    expect(blogsResponse.body.items[1]).toEqual(blogsInDb[1]);
    expect(blogsResponse.body.items[2]).toEqual(blogsInDb[2]);
    expect(blogsResponse.body.items[3]).toEqual(blogsInDb[3]);
    expect(blogsResponse.body.items[4]).toEqual(blogsInDb[4]);
  });
  it('get 10( 12 total) blogs', async function () {
    // sortDirection=desc
    // pageSize=5
    const blogsResponse = await request(httpServer).get('/blogs?pageSize=5').expect(200);
    expect(blogsResponse.body.items.length).toBe(5);
    expect(blogsResponse.body.totalCount).toBe(11);
    expect(blogsResponse.body.pageSize).toBe(5);
    expect(blogsResponse.body.pagesCount).toBe(3);
    expect(blogsResponse.body.items[0]).toEqual(blogsInDb[10]);
    expect(blogsResponse.body.items[1]).toEqual(blogsInDb[9]);
    expect(blogsResponse.body.items[2]).toEqual(blogsInDb[8]);
    expect(blogsResponse.body.items[3]).toEqual(blogsInDb[7]);
    expect(blogsResponse.body.items[4]).toEqual(blogsInDb[6]);
  });
  it('get 10( 12 total) blogs', async function () {
    // sortDirection=asc
    // pageSize=5
    //pageNumber=2
    const blogsResponse = await request(httpServer).get('/blogs?sortDirection=asc&pageNumber=2&pageSize=5').expect(200);
    expect(blogsResponse.body.items.length).toBe(5);
    expect(blogsResponse.body.totalCount).toBe(11);
    expect(blogsResponse.body.pageSize).toBe(5);
    expect(blogsResponse.body.pagesCount).toBe(3);
    expect(blogsResponse.body.items[0]).toEqual(blogsInDb[5]);
    expect(blogsResponse.body.items[1]).toEqual(blogsInDb[6]);
    expect(blogsResponse.body.items[2]).toEqual(blogsInDb[7]);
    expect(blogsResponse.body.items[3]).toEqual(blogsInDb[8]);
    expect(blogsResponse.body.items[4]).toEqual(blogsInDb[9]);
  });
  it('get 10( 12 total) blogs', async function () {
    // sortDirection=asc
    // searchNameTerm=1
    const blogsResponse = await request(httpServer).get('/blogs?searchNameTerm=1&sortDirection=asc').expect(200);
    expect(blogsResponse.body.items.length).toBe(3);
    expect(blogsResponse.body.totalCount).toBe(3);
    expect(blogsResponse.body.pageSize).toBe(10);
    expect(blogsResponse.body.pagesCount).toBe(1);
    expect(blogsResponse.body.items[0]).toEqual(blogsInDb[0]);
    expect(blogsResponse.body.items[1]).toEqual(blogsInDb[9]);
    expect(blogsResponse.body.items[2]).toEqual(blogsInDb[10]);
  });

  //--------------------POST TO BLOG TEST----------------
  it('create post', async function () {
    const postToResponse = await request(httpServer)
      .post(`/blogs/${blogsInDb[0].id}/posts`)
      .auth(adminData.login, adminData.password)
      .send({
        title: 'teste1',
        shortDescription: 'about bee',
        content: 'bebebebebe',
      })
      .expect(201);
    expect(postToResponse.body.title).toBe('teste1');
    expect(postToResponse.body.shortDescription).toBe('about bee');
    expect(postToResponse.body.content).toBe('bebebebebe');
  });
  it('create post 2', async function () {
    const postToResponse = await request(httpServer)
      .post(`/blogs/${blogsInDb[0].id}/posts`)
      .auth(adminData.login, adminData.password)
      .send({
        title: 'teste2',
        shortDescription: 'about bee2',
        content: 'bebebebebe2',
      })
      .expect(201);
    expect(postToResponse.body.title).toBe('teste2');
    expect(postToResponse.body.shortDescription).toBe('about bee2');
    expect(postToResponse.body.content).toBe('bebebebebe2');
  });
  it('try create post with not valid body', async function () {
    const postToResponse = await request(httpServer)
      .post(`/blogs/${blogsInDb[0].id}/posts`)
      .auth(adminData.login, adminData.password)
      .send({
        title: '',
        shortDescription: '',
        content: '',
      })
      .expect(400);
    expect(postToResponse.body.errorsMessages.length).toBe(3);
  });
  it('try create post without authorization', async function () {
    await request(httpServer)
      .post(`/blogs/${blogsInDb[0].id}/posts`)
      .auth('123', adminData.password)
      .send({
        title: '',
        shortDescription: '',
        content: '',
      })
      .expect(401);
  });
  it('get posts in blog', async function () {
    const postInBlogResponse = await request(httpServer).get(`/blogs/${blogsInDb[0].id}/posts`).expect(200);
    expect(postInBlogResponse.body.items.length).toBe(2);
  });
});
