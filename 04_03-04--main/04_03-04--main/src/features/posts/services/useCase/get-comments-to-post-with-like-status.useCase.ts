/* eslint-disable @typescript-eslint/explicit-function-return-type,no-underscore-dangle */
// Набор необходимых импортов
import { NotFoundException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { QueryPaginationResult } from '../../../../infrastructure/types/query-sort.type';
import { LikesToMapperManager } from '../../../../infrastructure/utils/likes-to-map-manager';
import { CommentsDocument } from '../../../comments/repositories/comments/comment.schema';
import { CommentsRepository } from '../../../comments/repositories/comments/comments.repository';
import { CommentsLikesQueryRepository } from '../../../comments/repositories/likes/comments-likes-query.repository';
import { OutputCommentType } from '../../../comments/types/comments/output';
import { PaginationWithItems } from '../../../common/types/output';
import { PostsRepository } from '../../repositories/post/posts.repository';

export class GetCommentsToPostWithLikeStatusCommand {
  constructor(
    public userId: string | null,
    public postId: string,
    public sortData: QueryPaginationResult,
  ) {}
}

@CommandHandler(GetCommentsToPostWithLikeStatusCommand)
export class GetCommentsToPostWithLikeStatusUseCase implements ICommandHandler<GetCommentsToPostWithLikeStatusCommand> {
  constructor(
    protected postRepository: PostsRepository,
    protected commentRepository: CommentsRepository,
    protected commentsLikesQueryRepository: CommentsLikesQueryRepository,
    protected likesToMapperManager: LikesToMapperManager,
  ) {}

  async execute(command: GetCommentsToPostWithLikeStatusCommand): Promise<PaginationWithItems<OutputCommentType>> {
    const { userId, sortData, postId } = command;

    await this.checkPostExist(postId);

    const comments = await this.findComments(postId, sortData);

    //if the user is not authorized, the like status is none
    let likeStatuses = {};
    if (userId) {
      likeStatuses = await this.likesToMapperManager.getUserLikeStatuses(
        comments,
        this.commentsLikesQueryRepository,
        userId,
        'commentId',
      );
    }

    return this.likesToMapperManager.generateDto(comments, likeStatuses);
  }

  private async checkPostExist(postId: string) {
    const post = await this.postRepository.postIsExist(postId);
    if (!post) throw new NotFoundException(`Post not found`);
  }

  private async findComments(postId: string, sortData: QueryPaginationResult) {
    const comments: PaginationWithItems<CommentsDocument> = await this.commentRepository.getCommentsByPostId(
      sortData,
      postId,
    );
    if (comments.items.length === 0) throw new NotFoundException(`Comments not found`);
    return comments;
  }
}
