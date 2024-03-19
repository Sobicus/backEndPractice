import {LikesPostsRepository} from "../repositories/likes-posts-repository";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {PostsRepository} from "../repositories/posts-repository";
import {LikesPostInputDBType} from "../types/likes-post-repository-type";
import {ObjectResult, statusType} from "../commands/object-result";

export class LikesPostsService {
    likesPostsRepository: LikesPostsRepository
    postRepository: PostsRepository

    constructor(likesPostsRepository: LikesPostsRepository, postRepository: PostsRepository) {
        this.likesPostsRepository = likesPostsRepository
        this.postRepository = postRepository
    }

    async likePostsUpdate(postId: string, userId: string, likeStatus: LikesStatus, login:string):Promise<ObjectResult> {
        const post =await this.postRepository.findPostById(postId)
        if (!post) {
            return {
                status: statusType.NotFound,
                errorMessages:'can not find post',
                data:null
            }
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
            await this.likesPostsRepository.createPostReaction(postReactionModel)
            return{
                status:statusType.Success,
                errorMessages:'post like has been created',
                data: null
            }
            //return this.likesPostsRepository.createPostReaction(postReactionModel)
        }
        if (likeStatus === existingReaction.myStatus) {
            return{
                status:statusType.Success,
                errorMessages:'post like the same',
                data: null
            }
        } else {
            await this.likesPostsRepository.updatePostReaction(postId, userId, likeStatus)
            return{
                status:statusType.Success,
                errorMessages:'post like has been change',
                data: null
            }
        }
    }
}
