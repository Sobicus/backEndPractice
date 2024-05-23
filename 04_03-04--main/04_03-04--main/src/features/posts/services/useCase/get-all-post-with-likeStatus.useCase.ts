/* eslint-disable no-underscore-dangle */
// noinspection JSVoidFunctionReturnValueUsed

import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QueryPaginationResult } from '../../../../infrastructure/types/query-sort.type';
import { LikesToMapperManager } from '../../../../infrastructure/utils/likes-to-map-manager';
import { PaginationWithItems } from '../../../common/types/output';
import { PostLikesQueryRepository } from '../../repositories/likes/post-likes.query.repository';
import { PostsRepository } from '../../repositories/post/posts.repository';
import { OutputPostType } from '../../types/output';

export class GetAllPostsWithLikeStatusCommand {
  constructor(
    public userId: string | null,
    public sortData: QueryPaginationResult,
  ) {}
}

@CommandHandler(GetAllPostsWithLikeStatusCommand)
export class GetAllPostsWithLikeStatusUseCase implements ICommandHandler<GetAllPostsWithLikeStatusCommand> {
  constructor(
    protected postRepository: PostsRepository,
    protected postLikesQueryRepository: PostLikesQueryRepository,
    protected likesToMapperManager: LikesToMapperManager,
  ) {}

  async execute(command: GetAllPostsWithLikeStatusCommand): Promise<PaginationWithItems<OutputPostType>> {
    const { userId, sortData } = command;
    const posts = await this.postRepository.getAll(sortData);

    if (!posts?.items?.length) {
      throw new NotFoundException(`Posts not found`);
    }
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
}
