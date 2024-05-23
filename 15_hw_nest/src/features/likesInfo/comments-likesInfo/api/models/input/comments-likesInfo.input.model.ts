import { IsEnum } from 'class-validator';

export enum LikesStatusComments {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class CommentsLikesInfoInputModel {
  postId: string;
  userId: string;
  createdAt: string;
  myStatus: LikesStatusComments;
}

export class InputUpdateCommentLikesModel {
  @IsEnum(LikesStatusComments)
  likeStatus: LikesStatusComments;
}
