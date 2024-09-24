import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import request from 'supertest';
import {
  Column,
  CreateDateColumn,
  DataSource,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Blogs } from '../../src/features/blogs/domain/blogs.entity';
import { BlogsQueryRepository } from '../../src/features/blogs/infrastructure/blogs-query.repository';
import { BlogsRepository } from '../../src/features/blogs/infrastructure/blogs.repository';
import { Posts } from '../../src/features/posts/domain/posts.entity';
import { BlogInputModelType } from '../../src/features/blogs/api/models/input/create-blog.input.model';

describe('Blogs flow', () => {
  //start server
  let server: INestApplication;
  let app;
  let dataSource: DataSource;
  let blogsRepository;
  const testBlog = {
    name: 'testBlog',
    description: 'testBlog',
    websiteUrl: 'https://testBlog.com',
  };
  const updateTemplate = {
    name: 'updatedBlog',
    description: 'updatedBlog',
    websiteUrl: 'https://updatedBlog.com',
  };
  let blogsId;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    server = moduleRef.createNestApplication();
    appSettings(server);
    await server.init();
    app = server.getHttpServer();
    await request(app).delete('/testing/all-data').expect(204);
    dataSource = await moduleRef.resolve(DataSource);
    blogsRepository = await dataSource.getRepository(Blogs);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await request(app).delete('/testing/all-data').expect(204);
    await server.close();
  });
  //registration user flow
  describe('Get all blogs', () => {
    it('Returns 200 and all blogs', async () => {
      await request(app).get('/sa/blogs').auth('admin', 'qwerty').expect(200);
    });
    it('Rerurns 200 and all blogs. цу сщьзфку еру щиоусе ерфе сщьу цшер ерщыу ерфе цу учзусе', async () => {
      const allBlogs = await request(app)
        .get('/sa/blogs/')
        .auth('admin', 'qwerty');
      expect(allBlogs.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: expect.any(Array),
      });
    });
    it('Returns 200 and all blogs', async () => {
      const allBlogs = await request(app)
        .get('/sa/blogs?pageNumber=2&pageSize=15')
        .auth('admin', 'qwerty')
        .expect(200);
      expect(allBlogs.body).toEqual({
        pagesCount: 0,
        page: 2,
        pageSize: 15,
        totalCount: 0,
        items: expect.any(Array),
      });
    });
  });
  describe('Create blog', () => {
    it('Returns 200 and new blog', async () => {
      const newBlog = await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send(testBlog)
        .expect(201);
      blogsId = Number(newBlog.body.id);
      console.log('blogsId!!!!!!!!!!!!!!', blogsId);
      expect(newBlog.body).toEqual({
        id: expect.any(String),
        name: testBlog.name,
        description: testBlog.description,
        websiteUrl: testBlog.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('Returns 400 inputModel has incorrect values, name must be more then 0 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: ' ' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, name must be less then 15 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: '1234567890123456' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, name must be string', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: 113 })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, description must be more then 0 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, description: ' ' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, description must be less then 500 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({
          ...testBlog,
          description:
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Return 400 inputModel has incorrect values, websiteUrl mast be more then 0 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, websiteUrl: ' ' })
        .expect(400);
    });
    it('Return 400 inputModel has incorrect values, websiteUrl mast be less then 100 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({
          ...testBlog,
          websiteUrl:
            '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it(
      'Return 400 inputModel has incorrect values, websiteUrl mast be match pattern string ' +
        '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/',
      async () => {
        await request(app)
          .post('/sa/blogs')
          .auth('admin', 'qwerty')
          .send({
            ...testBlog,
            websiteUrl: 'http://testBlog.com',
          })
          .expect(400);
      },
    );
    it(
      'Return 400 inputModel has incorrect values, websiteUrl mast be match pattern string ' +
        '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/',
      async () => {
        await request(app)
          .post('/sa/blogs')
          .auth('admin', 'qwerty')
          .send({
            ...testBlog,
            websiteUrl: 'https:/testBlog.com',
          })
          .expect(400);
      },
    );
  });
  describe('Update blog', () => {
    it('return 204 and updated blog', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send(updateTemplate)
        .expect(204);
    });
    it('updated blog has to be in db the same like updateTemplate', async () => {
      const updatedBlogs = await blogsRepository.findOne({
        where: { id: blogsId },
      });
      expect(updatedBlogs).toEqual({
        id: expect.any(Number),
        name: updateTemplate.name,
        description: updateTemplate.description,
        websiteUrl: updateTemplate.websiteUrl,
        isMembership: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
    it('Returns 400 inputModel has incorrect values, name must be more then 0 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send({ ...updateTemplate, name: ' ' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, name must be less then 16 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send({ ...updateTemplate, name: '1234567890123456' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, description must be more then 0 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send({ ...updateTemplate, description: ' ' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, description must be less then 500 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateTemplate,
          description:
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Return 400 inputModel has incorrect values, websiteUrl mast be less then 100 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateTemplate,
          websiteUrl:
            '12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it(
      'Return 400 inputModel has incorrect values, websiteUrl mast be match pattern string ' +
        '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/',
      async () => {
        await request(app)
          .put(`/sa/blogs/${blogsId}`)
          .auth('admin', 'qwerty')
          .send({
            ...updateTemplate,
            websiteUrl: 'http://testBlog.com',
          })
          .expect(400);
      },
    );
    it(
      'Return 400 inputModel has incorrect values, websiteUrl mast be match pattern string ' +
        '/^https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$/',
      async () => {
        await request(app)
          .post('/sa/blogs')
          .auth('admin', 'qwerty')
          .send({
            ...testBlog,
            websiteUrl: 'https:/testBlog.com',
          })
          .expect(400);
      },
    );
  });
  describe('Delete blog', () => {
    it('Return 401 because user is not authorized', async () => {
      await request(app).delete(`/sa/blogs/${blogsId}`).expect(401);
    });
    it('Return 404 because blog is not found', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogsId + 1}`)
        .auth('admin', 'qwerty')
        .expect(404);
    });
    it('Return 204 and delete blog', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .expect(204);
    });
    it('Return 404 because blog has been deleted', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .expect(404);
    });
  });
});
