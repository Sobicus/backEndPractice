import {CommentRepository} from "../repositories/comment-repository";
import {CommentsViewType} from "../types/comments-type";

class CommentService {
    commentRepo: CommentRepository

    constructor() {
        this.commentRepo = new CommentRepository()
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
}

export const commentService = new CommentService()