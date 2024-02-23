import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsRepositoryType, CommentViewType} from "../types/comment-types";
import {CommentsQueryRepository} from "../repositories/comments-queryRepository";

class CommentService {
    commentRepo: CommentsRepository
    commentQueryRepo:CommentsQueryRepository

    constructor() {
        this.commentRepo = new CommentsRepository()
        this.commentQueryRepo = new CommentsQueryRepository()
    }

    async getCommentById(commentId: string,userId?:string): Promise<CommentViewType | null> {
        return await this.commentQueryRepo.getCommentById(commentId,userId)
    }

    async updatePost(commentId: string, content: string): Promise<boolean> {
        return await this.commentRepo.updateComment(commentId, content)
    }

    async deleteComment(commentId: string): Promise<boolean> {
        return await this.commentRepo.deleteComment(commentId)
    }

    //check below
    async getDbCommentById(commentId: string): Promise<CommentsRepositoryType | null> {
        return await this.commentRepo.getCommentById(commentId)
    }
}

export const commentService = new CommentService()
