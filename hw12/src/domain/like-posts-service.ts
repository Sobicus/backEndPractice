import {LikesPostsRepository} from "../repositories/likes-posts-repository";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {PostsRepository} from "../repositories/posts-repository";
import {LikesPostInputDBType} from "../types/likes-post-repository-type";

export class LikesPostsService {
    likesPostsRepository: LikesPostsRepository
    postRepository: PostsRepository

    constructor(likesPostsRepository: LikesPostsRepository, postRepository: PostsRepository) {
        this.likesPostsRepository = likesPostsRepository
        this.postRepository = postRepository
    }

    async likePostsUpdate(postId: string, userId: string, likeStatus: LikesStatus, login:string) {
        const post =await this.postRepository.findPostById(postId)
        if (!post) {
            return '404'
        }
        const existingReaction = await this.likesPostsRepository.findPostLikebyPostIdUserId(postId, userId)
        if (!existingReaction) {
            const postReactionModel: LikesPostInputDBType = {
                userId,
                postId,
                login,
                myStatus: likeStatus,
                createAt: new Date().toISOString()
            }
            return this.likesPostsRepository.createPostReaction(postReactionModel)
        }
        if (likeStatus === existingReaction.myStatus) {
            return
        } else {
            return this.likesPostsRepository.updatePostReaction(postId, userId, likeStatus)
        }
    }
}
