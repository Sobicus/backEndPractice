import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { LikesStatusPosts } from '../../api/models/input/posts-likesInfo.input.model';
import { PostsLikesInfoRepository } from '../../infrastructure/posts-likesInfo.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsLikesInfo } from '../../domain/posts-likesInfo.entity';

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
    console.log('UpdatePostLikeHandler post ', post);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post does`t exists',
        data: null,
      };
    }
    //todo why i try find user by id if i have userId
    const user = await this.usersRepository.getUserById(Number(command.userId));
    console.log('UpdatePostLikeHandler user ', user);
    const existingReaction =
      await this.postsLikesInfoRepository.findLikeInfoByPostIdUserId(
        Number(command.postId),
        Number(command.userId),
      );
    console.log('UpdatePostLikeHandler existingReaction', existingReaction);
    if (!existingReaction) {
      const newPostLikeInfo = PostsLikesInfo.createPostLikesinfo(
        Number(command.userId),
        Number(command.postId),
        command.likeStatus,
      );
      // const newPostLikesInfo = {
      //   postId: command.postId,
      //   userId: command.userId,
      //   login: user!.login,
      //   createdAt: new Date().toISOString(),
      //   myStatus: command.likeStatus,
      // };
      await this.postsLikesInfoRepository.createLikeInfoPost(newPostLikeInfo);
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
      const updatePostReaction = {
        ...existingReaction,
        myStatus: command.likeStatus,
      };
      await this.postsLikesInfoRepository.createLikeInfoPost(
        updatePostReaction,
      );
      // await this.postsLikesInfoRepository.updateLikeInfoPost(
      //   command.postId,
      //   command.userId,
      //   command.likeStatus,
      // );
      return {
        status: statusType.Success,
        statusMessages: 'Post likes the same',
        data: null,
      };
    }
  }
}
