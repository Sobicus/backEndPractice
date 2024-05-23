import { CommentsLikesDocument } from '../../../features/comments/repositories/likes/comment-like.schema';

export interface ICommentsLikesQueryRepository {
  getLikeByUserId(commentId: string, userId: string): Promise<CommentsLikesDocument | null>;

  getManyLikesByUserId(ids: string[], userId: string): Promise<CommentsLikesDocument[]>;
}
