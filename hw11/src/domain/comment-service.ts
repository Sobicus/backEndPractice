import {CommentsRepository} from "../repositories/comments-repository";
import {CommentsRepositoryType, CommentsViewType} from "../types/comments-type";

class CommentService {
    commentRepo: CommentsRepository

    constructor() {
        this.commentRepo = new CommentsRepository()
    }

    async getCommentById(commentId: string): Promise<CommentsViewType | null> {
        return await this.commentRepo.getCommentById(commentId)
    }

    async updatePost(commentId: string, content: string): Promise<boolean> {
        return await this.commentRepo.updateComment(commentId, content)
    }
    async deleteComment(commentId:string):Promise<boolean>{
        return await this.commentRepo.deleteComment(commentId)
    }
    async getDbCommentById(commentId: string): Promise<CommentsRepositoryType|null> {
    return await this.commentRepo.getCommentById(commentId)
}
}

export const commentService = new CommentService()