import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { LikesStatusPosts } from '../../api/models/input/posts-likesInfo.input.model';
import { PostsLikesInfoRepository } from '../../infrastructure/posts-likesInfo.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsLikesInfoRepositorySQL } from '../../infrastructure/posts-likesInfoSQL.repository';
import { PostsRepositorySQL } from '../../infrastructure/postsSQL.repository';
import { UsersRepositorySQL } from '../../../users/infrastructure/usersSQL.repository';

export class UpdatePostLikeCommand {
  constructor(
    public readonly postId: string,
    public readonly likeStatus: LikesStatusPosts,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdatePostLikeCommand)
export class UpdatePostLikeHandler
  implements ICommandHandler<UpdatePostLikeCommand>
{
  constructor(
    private postsLikesInfoRepositorySQL: PostsLikesInfoRepositorySQL,
    private postsRepositorySQL: PostsRepositorySQL,
    private usersRepositorySQL: UsersRepositorySQL,
  ) {}

  async execute(command: UpdatePostLikeCommand) {
    const post = await this.postsRepositorySQL.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post does`t exists',
        data: null,
      };
    }
    const user = await this.usersRepositorySQL.getUserById(command.userId);
    const existingReaction =
      await this.postsLikesInfoRepositorySQL.findLikeInfoByPostIdUserId(
        command.postId,
        command.userId,
      );
    if (!existingReaction) {
      const newPostLikesInfo = {
        postId: command.postId,
        userId: command.userId,
        login: user!.login,
        createdAt: new Date().toISOString(),
        myStatus: command.likeStatus,
      };
      await this.postsLikesInfoRepositorySQL.createLikeInfoPost(
        newPostLikesInfo,
      );
      return {
        status: statusType.Created,
        statusMessages: 'Post likes has been created',
        data: null,
      };
    }
    if (existingReaction.myStatus === command.likeStatus) {
      return {
        status: statusType.Success,
        statusMessages: 'Post likes the same',
        data: null,
      };
    } else {
      await this.postsLikesInfoRepositorySQL.updateLikeInfoPost(
        command.postId,
        command.userId,
        command.likeStatus,
      );
      return {
        status: statusType.Success,
        statusMessages: 'Post likes the same',
        data: null,
      };
    }
  }
}
