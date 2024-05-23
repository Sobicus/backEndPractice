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
