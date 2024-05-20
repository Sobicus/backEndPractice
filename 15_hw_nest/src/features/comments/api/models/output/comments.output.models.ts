import { IsString, Length } from 'class-validator';

export type CommentsOutputModels = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export class InputUpdateCommentModel {
  @IsString()
  @Length(20, 300)
  content: string;
}
