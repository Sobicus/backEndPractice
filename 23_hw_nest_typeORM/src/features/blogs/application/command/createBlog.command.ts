import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { Blogs } from '../../domain/blogs.entity';

export class CreateBlogCommand {
  constructor(public readonly inputBlogModel: BlogInputModelType) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<number> {
    const blog = Blogs.create(command.inputBlogModel);
    return await this.blogRepository.createBlog(blog);
  }
}
