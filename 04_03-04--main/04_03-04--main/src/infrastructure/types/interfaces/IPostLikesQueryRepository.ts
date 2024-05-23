import { PostLikesDocument } from '../../../features/posts/repositories/likes/post-likes.schema';
import { NewestLikeType } from '../../../features/posts/types/likes/output';

export interface IPostLikesQueryRepository {
  getLikeByUserId(postId: string, userId: string): Promise<PostLikesDocument | null>;

  getLastThreeLikes(postId: string): Promise<NewestLikeType[]>;

  getManyLikesByUserId(ids: string[], userId: string): Promise<PostLikesDocument[]>;
}
