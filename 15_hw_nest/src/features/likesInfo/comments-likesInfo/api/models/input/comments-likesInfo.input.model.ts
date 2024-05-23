import { IsEnum } from 'class-validator';

export enum LikesStatus {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}

export class CommentsLikesInfoInputModel {
  postId: string;
  userId: string;
  createdAt: string;
  myStatus: LikesStatus;
}

export class InputUpdtLikesModel {
  @IsEnum(LikesStatus)
  likeStatus: LikesStatus;
}
