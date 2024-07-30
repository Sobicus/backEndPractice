import { LikesStatusComments } from '../api/models/input/comments-likesInfo.input.model';

export class CommentsLikesInfo {
  commentId: string;
  userId: string;
  createdAt: string;
  myStatus: LikesStatusComments;
}
