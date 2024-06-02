import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { Blogs } from '../../domain/blogs.entity';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class CreateBlogCommand {
  constructor(public readonly inputBlogModel: BlogInputModelType) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand) {
    const blog = Blogs.create(command.inputBlogModel);
    const createdBlog = await this.blogRepository.saveBlog(blog);
    return createdBlog._id.toString();
  }
}
