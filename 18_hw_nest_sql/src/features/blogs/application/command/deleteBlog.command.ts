import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { BlogsRepositorySQL } from '../../infrastructure/blogsSQL.repository';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepositorySQL: BlogsRepositorySQL) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepositorySQL.getBlogByBlogId(command.blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    await this.blogRepositorySQL.deleteBlog(command.blogId);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been delete',
      data: null,
    };
  }
}
