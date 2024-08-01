import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';

export class CreateCommentCommand {
  constructor(
    public readonly postId: string,
    public readonly content: string,
    public readonly userId: string,
  ) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand) {
    const post = await this.postsRepository.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post doesn`t exists',
        data: null,
      };
    }
    const user = await this.usersRepository.getUserById(Number(command.userId));
    const newComment = {
      content: command.content,
      userId: command.userId,
      userLogin: user!.login,
      createdAt: new Date().toISOString(),
      postId: post.id,
    };
    // const newCommentId =
    //   await this.commentsRepository.createComment(newComment);
    // return {
    //   status: statusType.Created,
    //   statusMessages: 'Comment has been created',
    //   data: newCommentId,
    // };
  }
}
