import {PostsRepository, postsViewType} from "../repositories/posts-repository";
import {postBodyRequest} from "../routes/posts-router";
import {IDefaultPagination, PaginationType, SortPostsByEnum} from "../types/paggination-type";

export class PostsService {
    postRepo: PostsRepository

    constructor() {
        this.postRepo = new PostsRepository()
    }

    async findAllPosts(postsPagination: IDefaultPagination<SortPostsByEnum>): Promise<PaginationType<postsViewType>> {
        return await this.postRepo.findAllPosts(postsPagination)
    }

    async findPostById(postId: string): Promise<postsViewType | null> {
        return await this.postRepo.findPostById(postId)
    }

    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<postsViewType | null> {
        const newPost = {
            title,
            shortDescription,
            content,
            blogId,
            createdAt: new Date().toISOString()
        };
        const mongoResponse = await this.postRepo.createPost(newPost)
        if (!mongoResponse) return null
        return {id: mongoResponse.blogId, blogName: mongoResponse.blogName, ...newPost};
    }
    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        return await this.postRepo.updatePost(postId, updateModel)
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await this.postRepo.deletePost(postId)
        return resultDeletePost
    }
}

export const postService = new PostsService()