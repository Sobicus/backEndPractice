import { Controller, Delete, HttpCode } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { BlogsRepository } from '../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../posts/infrastructure/posts.repository';
import { CommentsRepository } from '../../comments/infrastructure/comments.repository';
import { CommentsLikesInfoRepository } from '../../likesInfo/comments-likesInfo/infrastructure/comments-likesInfo.repository';
import { PostsLikesInfoRepository } from '../../likesInfo/posts-likeInfo/infrastructure/posts-likesInfo.repository';
import { SessionsRepository } from '../../users/infrastructure/sessionsData/sessions.repository';
import { PasswordRecoveryRepository } from '../../users/infrastructure/accountData/passwordRecoveryRepository';

@Controller('/testing/all-data')
export class TestingAllDataController {
  constructor(
    private userRepository: UsersRepository,
    private blogRepository: BlogsRepository,
    private postRepository: PostsRepository,
    private commentsRepository: CommentsRepository,
    private commentsLikesInfoRepository: CommentsLikesInfoRepository,
    private postsLikesInfoRepository: PostsLikesInfoRepository,
    private sessionsRepository: SessionsRepository,
    private passwordRecoveryRepository: PasswordRecoveryRepository,
  ) {}

  @Delete()
  @HttpCode(204)
  async deleteAllBD() {
    await this.blogRepository.deleteAll();
    await this.userRepository.deleteAll();
    await this.postRepository.deleteALl();
    await this.commentsRepository.deleteALl();
    await this.commentsLikesInfoRepository.deleteALl();
    await this.postsLikesInfoRepository.deleteALl();
    await this.sessionsRepository.deleteALl();
    await this.passwordRecoveryRepository.deleteALl();
  }
}
