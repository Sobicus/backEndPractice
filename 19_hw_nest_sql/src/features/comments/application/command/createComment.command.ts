import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { PostsRepositorySQL } from '../../../posts/infrastructure/postsSQL.repository';
import { UsersRepositorySQL } from '../../../users/infrastructure/usersSQL.repository';
import { CommentsRepositorySQL } from '../../infrastructure/commentsSQL.repository';

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
    private postsRepositorySQL: PostsRepositorySQL,
    private usersRepositorySQL: UsersRepositorySQL,
    private commentsRepositorySQL: CommentsRepositorySQL,
  ) {}

  async execute(command: CreateCommentCommand) {
    const post = await this.postsRepositorySQL.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post doesn`t exists',
        data: null,
      };
    }
    const user = await this.usersRepositorySQL.getUserById(command.userId);
    const newComment = {
      content: command.content,
      userId: command.userId,
      userLogin: user!.login,
      createdAt: new Date().toISOString(),
      postId: post.id,
    };
    const newCommentId =
      await this.commentsRepositorySQL.createComment(newComment);
    return {
      status: statusType.Created,
      statusMessages: 'Comment has been created',
      data: newCommentId,
    };
  }
}
