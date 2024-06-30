import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { Blogs } from '../../domain/blogs.entity';
import { BlogsRepositorySQL } from '../../infrastructure/blogsSQL.repository';

export class CreateBlogCommand {
  constructor(public readonly inputBlogModel: BlogInputModelType) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepositorySQL: BlogsRepositorySQL) {}

  async execute(command: CreateBlogCommand) {
    const blog = Blogs.create(command.inputBlogModel);
    return await this.blogRepositorySQL.createBlog(blog);
  }
}
