import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { LikesStatusPosts } from '../../api/models/input/posts-likesInfo.input.model';
import { PostsLikesInfoRepository } from '../../infrastructure/posts-likesInfo.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';

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
    private postsLikesInfoRepository: PostsLikesInfoRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdatePostLikeCommand) {
    const post = await this.postsRepository.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post does`t exists',
        data: null,
      };
    }
    const user = await this.usersRepository.getUserById(command.userId);
    const existingReaction =
      await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
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
      await this.postsLikesInfoRepository.createLikeInfoPost(newPostLikesInfo);
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
      await this.postsLikesInfoRepository.updateLikeInfoPost(
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
