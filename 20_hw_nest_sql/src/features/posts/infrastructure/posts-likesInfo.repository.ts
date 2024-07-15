import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  PostsLikesInfo,
  PostsLikesInfoDocument,
} from '../domain/posts-likesInfo.entity';
import { Model } from 'mongoose';
import {
  LikesStatusPosts,
  PostLikesInfoInputModel,
} from '../api/models/input/posts-likesInfo.input.model';

@Injectable()
export class PostsLikesInfoRepository {
  constructor(
    @InjectModel(PostsLikesInfo.name)
    private PostsLikesInfoModel: Model<PostsLikesInfo>,
  ) {}
  async findLikeInfoByPostIdUserId(
    postId: string,
    userId: string,
  ): Promise<PostsLikesInfoDocument | null> {
    return this.PostsLikesInfoModel.findOne({ postId, userId }).exec();
  }

  async createLikeInfoPost(postLikesInfoDTO: PostLikesInfoInputModel) {
    await this.PostsLikesInfoModel.create(postLikesInfoDTO);
  }

  async updateLikeInfoPost(
    postId: string,
    userId: string,
    likeStatus: LikesStatusPosts,
  ) {
    await this.PostsLikesInfoModel.updateOne(
      { postId, userId },
      { myStatus: likeStatus },
    );
  }
  async countDocuments(
    postId: string,
    likeStatus: 'Like' | 'Dislike',
  ): Promise<number> {
    return this.PostsLikesInfoModel.countDocuments({
      postId,
      myStatus: likeStatus,
    });
  }
  async findLastThreeLikes(postId: string, likeStatus: LikesStatusPosts.Like) {
    return this.PostsLikesInfoModel.find({
      postId: postId,
      myStatus: likeStatus,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
  }
  async deleteALl() {
    await this.PostsLikesInfoModel.deleteMany();
  }
}
