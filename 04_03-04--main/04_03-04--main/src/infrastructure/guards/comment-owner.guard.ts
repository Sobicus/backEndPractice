import { CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { CommentsQueryRepository } from '../../features/comments/repositories/comments/comments.query.repository';
// Custom guard
// https://docs.nestjs.com/guards
@Injectable()
export class CommentOwnerGuard implements CanActivate {
  constructor(private commentQueryRepository: CommentsQueryRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const commentId = request.params.commentId;
    const userId = request.user.id;
    const targetComment = await this.commentQueryRepository.getCommentById(commentId);
    if (!targetComment) throw new NotFoundException();
    if (targetComment.commentatorInfo.userId !== userId) throw new ForbiddenException();
    return true;
  }
}
