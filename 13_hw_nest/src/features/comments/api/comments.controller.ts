import { Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/comments.query-repocitory';

@Injectable()
export class CommentsController {
  constructor(private commentsQueryRepository: CommentsQueryRepository) {}

  @Get(':id')
  async getCommentById(@Param('id') commentId: string) {
    const comment = this.commentsQueryRepository.getCommentsById(commentId);
    if (!comment) {
      throw new NotFoundException();
    }
    return comment;
  }
}
