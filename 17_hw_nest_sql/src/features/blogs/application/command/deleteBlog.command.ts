import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { statusType } from '../../../../base/oject-result';

export class DeleteBlogCommand {
  constructor(public readonly blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogHandler implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand) {
    const blog = await this.blogRepository.getBlogByBlogId(command.blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    await this.blogRepository.deleteBlog(command.blogId);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been delete',
      data: null,
    };
  }
}
