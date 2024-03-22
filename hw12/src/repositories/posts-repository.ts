import {ObjectId} from "mongodb";
import {CommentViewType, newCommentType} from "../types/comment-types";
import {BlogsModel, CommentsModel, PostsModel} from "./db";
import {CreatePostType, PostsDbType} from "../types/post-types";
import {BlogsDbType} from "../types/blog-types";
import { postBodyRequest } from "../types/postsRouter-types";
import { LikesStatus } from "../types/likes-comments-repository-types";
import {PasswordRecoveryRepository} from "./passwordRecovery-repository";
import {injectable} from "inversify";

@injectable()
export class PostsRepository {

    async findPostById(postId: string): Promise<PostsDbType | null> {
        return PostsModel.findOne({_id: new ObjectId(postId)})
    }

    async createPost(newPost: CreatePostType): Promise<{ blogName: string, postId: string } | null> {
        let blog: BlogsDbType | null = await BlogsModel
            .findOne({_id: new ObjectId(newPost.blogId)})
        if (!blog) return null;
        let newPostByDb = await PostsModel
            .create({...newPost, blogName: blog.name, _id: new ObjectId()})
        const blogName = blog.name
        const postId = newPostByDb._id.toString()
        return {blogName, postId}
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const resultUpdateModel = await PostsModel
            .updateOne({_id: new ObjectId(postId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await PostsModel
            .deleteOne({_id: new ObjectId(postId)})
        return resultDeletePost.deletedCount === 1
    }

    async createCommetByPostId(comment: newCommentType): Promise<CommentViewType> {
        const newComment = await CommentsModel
            .create({...comment})//<CommentsRepositoryType> can not
        return {
            id: newComment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userLogin: comment.userLogin,
                userId: comment.userId
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikesStatus.None
            }
        }
    }
}
