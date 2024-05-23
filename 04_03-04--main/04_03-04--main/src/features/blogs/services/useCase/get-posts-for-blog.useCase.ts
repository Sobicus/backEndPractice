/* eslint-disable no-underscore-dangle,@typescript-eslint/explicit-function-return-type */

import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QueryPaginationResult } from '../../../../infrastructure/types/query-sort.type';
import { LikesToMapperManager } from '../../../../infrastructure/utils/likes-to-map-manager';
import { PaginationWithItems } from '../../../common/types/output';
import { PostLikesQueryRepository } from '../../../posts/repositories/likes/post-likes.query.repository';
import { PostsRepository } from '../../../posts/repositories/post/posts.repository';
import { OutputPostType } from '../../../posts/types/output';
import { BlogsRepository } from '../../repositories/blogs.repository';

export class GetPostForBlogCommand {
  constructor(
    public userId: string | null,
    public blogId: string,
    public sortData: QueryPaginationResult,
  ) {}
}

@CommandHandler(GetPostForBlogCommand)
export class GetPostForBlogUseCase implements ICommandHandler<GetPostForBlogCommand> {
  constructor(
    protected postLikesQueryRepository: PostLikesQueryRepository,
    protected postRepository: PostsRepository,
    protected blogRepository: BlogsRepository,
    protected likesToMapperManager: LikesToMapperManager,
  ) {}

  async execute(command: GetPostForBlogCommand): Promise<PaginationWithItems<OutputPostType>> {
    const { userId, sortData, blogId } = command;

    await this.checkBlogExist(blogId);

    const posts = await this.findPostsForBlog(blogId, sortData);

    //if the user is not authorized, the like status is none
    let likeStatuses = {};
    if (userId) {
      likeStatuses = await this.likesToMapperManager.getUserLikeStatuses(
        posts,
        this.postLikesQueryRepository,
        userId,
        'postId',
      );
    }
    return this.likesToMapperManager.generateDto(posts, likeStatuses);
  }

  private async checkBlogExist(blogId: string) {
    const post = await this.blogRepository.getBlogById(blogId);
    if (!post) throw new NotFoundException(`Post not found`);
  }

  private async findPostsForBlog(blogId: string, sortData: QueryPaginationResult) {
    const posts = await this.postRepository.findByBlogId(blogId, sortData);
    if (!posts?.items?.length) {
      throw new NotFoundException(`Posts not found`);
    }
    return posts;
  }
}
