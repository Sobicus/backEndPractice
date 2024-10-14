import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ObjectClassResult, statusType } from '../../../../base/oject-result';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../users/infrastructure/users.repository';
import { Comments } from '../../domain/comments.entity';
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
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(
    command: CreateCommentCommand,
  ): Promise<ObjectClassResult<number | null>> {
    const post = await this.postsRepository.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post doesn`t exists',
        data: null,
      };
    }
    const newComment = Comments.createComment(
      command.content,
      Number(command.userId),
      post.id,
    );
    const newCommentId =
      await this.commentsRepository.createComment(newComment);
    return {
      status: statusType.Created,
      statusMessages: 'Comment has been created',
      data: newCommentId,
    };
  }
}
