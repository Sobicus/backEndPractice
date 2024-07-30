import { IsEnum } from 'class-validator';

export enum LikesStatusPosts {
  None = 'None',
  Like = 'Like',
  Dislike = 'Dislike',
}
export class InputUpdatePostLikesModel {
  @IsEnum(LikesStatusPosts)
  likeStatus: LikesStatusPosts;
}
export class PostLikesInfoInputModel {
  postId: string;
  userId: string;
  login: string;
  createdAt: string;
  myStatus: LikesStatusPosts;
}
