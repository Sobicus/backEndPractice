import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../infrastructure/decorators/transform/trim';
import { LikeStatus } from '../../../../infrastructure/decorators/validate/like-status.decorator';

export class CommentUpdateModel {
  @Trim()
  @IsString()
  @Length(30, 300)
  content: string;
}

export class LikeCreateModel {
  @LikeStatus()
  likeStatus: LikeStatusType;
}

export type LikeStatusType = 'None' | 'Like' | 'Dislike';
