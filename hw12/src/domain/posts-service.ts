import {PostsRepository} from "../repositories/posts-repository";
import {CommentViewType, newCommentType} from "../types/comment-types";
import {UsersDbType, UsersViewType} from "../types/user-types";
import {PostsViewType} from "../types/post-types";
import {postBodyRequest} from "../types/postsRouter-types";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {injectable} from "inversify";

@injectable()
export class PostsService {
    private postRepo: PostsRepository

    constructor(postRepo: PostsRepository) {
        this.postRepo = postRepo
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsViewType | null> {
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            createdAt: new Date().toISOString()
        };
        const extendedLikesInfo = {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikesStatus.None,
            newestLikes: [
            ]
        }
        const mongoResponse = await this.postRepo.createPost(newPost)
        if (!mongoResponse) return null
        return {id: mongoResponse.postId, blogName: mongoResponse.blogName, ...newPost, extendedLikesInfo}
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const post = await this.postRepo.findPostById(postId)
        if (!post) return false
        return await this.postRepo.updatePost(postId, updateModel)
    }

    async deletePost(postId: string): Promise<boolean> {
        const post = await this.postRepo.findPostById(postId)
        if (!post) return false
        return await this.postRepo.deletePost(postId)
    }

    async createCommetByPostId(postId: string, content: string, user: UsersDbType): Promise<CommentViewType | boolean> {
        const post = await this.postRepo.findPostById(postId)
        if (!post) return false
        const comment: newCommentType = {
            createdAt: new Date().toISOString(),
            postId,
            content,
            userId: user._id.toString(),
            userLogin: user.login
        }
        return await this.postRepo.createCommetByPostId(comment);
    }
}
