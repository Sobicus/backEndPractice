import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { SessionsRepository } from '../../SecurityDevices/infrastructure/sessions.repository';
import { PasswordRecoveryRepository } from '../../auth/infrastructure/passwordRecovery.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostsLikesInfoRepository } from '../../posts/infrastructure/posts-likesInfo.repository';
import { CommentsLikesInfoRepository } from '../../comments/infrastructure/comments-likesInfo.repository';
import { CommentsRepository } from '../../comments/infrastructure/comments.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('/testing/all-data')
export class TestingAllDataController {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    private usersRepositorySQL: UsersRepository,
    private sessionsRepositorySQL: SessionsRepository,
    private passwordRecoveryRepositorySQL: PasswordRecoveryRepository,
    private postsRepositorySQL: PostsRepository,
    private blogsRepositorySQL: BlogsRepository,
    private postsLikesInfoRepositorySQL: PostsLikesInfoRepository,
    private commentsLikesInfoRepositorySQL: CommentsLikesInfoRepository,
    private commentsRepositorySQL: CommentsRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllBD() {
    await this.dataSource.query('DELETE FROM password_recovery');
    await this.dataSource.query('DELETE FROM sessions');
    await this.dataSource.query('DELETE FROM email_confirmation');
    await this.dataSource.query('DELETE FROM users');
    //await this.commentsLikesInfoRepositorySQL.deleteAll();
    //await this.postsLikesInfoRepositorySQL.deleteAll();
    //await this.passwordRecoveryRepositorySQL.deleteAll();
    // await this.commentsRepositorySQL.deleteAll();
    //await this.sessionsRepositorySQL.deleteAll();
    //await this.usersRepositorySQL.deleteAll();
    //  await this.postsRepositorySQL.deleteAll();
    // await this.blogsRepositorySQL.deleteAll();
  }
}
