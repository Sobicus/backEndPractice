import {PostsRepository} from "../repositories/posts-repository";
import {postBodyRequest} from "../routes/posts-router";
import {IDefaultPagination, PaginationType, SortPostsByEnum} from "../types/paggination-type";
import {newCommentType} from "../types/comment-types";
import {UsersViewType} from "../types/user-types";
import {PostsDbType, PostsViewType} from "../types/post-types";

class PostsService {
    postRepo: PostsRepository

    constructor() {
        this.postRepo = new PostsRepository()
    }

    /* async findAllPosts(postsPagination: IDefaultPagination<SortPostsByEnum>): Promise<PaginationType<postsViewType>> {
         return await this.postRepo.findAllPosts(postsPagination)
     }
 */
    async findPostById(postId: string): Promise<PostsDbType | null> {
        return await this.postRepo.findPostById(postId)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostsViewType | null> {
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            createdAt: new Date().toISOString()
        };

        const mongoResponse = await this.postRepo.createPost(newPost)
        if (!mongoResponse) return null
        return {id: mongoResponse.postId, blogName: mongoResponse.blogName, ...newPost};
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        return await this.postRepo.updatePost(postId, updateModel)
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await this.postRepo.deletePost(postId)
        return resultDeletePost
    }

    async createCommetByPostId(postId: string, content: string, user: UsersViewType) {
        const comment: newCommentType = {
            createdAt: new Date().toISOString(),
            postId,
            content,
            userId: user.id,
            userLogin: user.login
        }
        return await this.postRepo.createCommetByPostId(comment);
    }

    /*  async findCommentsByPostId(postId: string, paggination: DefaultCommentsPaginationType,userId?: string) {
          return await this.postRepo.findCommentsByPostId(postId, paggination,userId)
      }*/
}

export const postService = new PostsService()
