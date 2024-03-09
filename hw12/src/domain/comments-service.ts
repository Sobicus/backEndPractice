import {CommentsRepository} from "../repositories/comments-repository";

export class CommentsService {
    commentRepo: CommentsRepository

    //commentQueryRepo:CommentsQueryRepository

    constructor(commentRepo: CommentsRepository) {
        this.commentRepo = commentRepo
        //this.commentQueryRepo = new CommentsQueryRepository()
    }

    /*
        async getCommentById(commentId: string,userId?:string): Promise<CommentViewType | null> {
            return await this.commentQueryRepo.getCommentById(commentId,userId)
        }
    */
    async updateComments(commentId: string, content: string, userId: string): Promise<boolean | string> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        if (!resault) {
            return false
        }
        if (resault.userId !== userId) {
            return '403'
        }
        return await this.commentRepo.updateComment(commentId, content)
    }

    async deleteComment(commentId: string, userId: string): Promise<boolean | string> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        if (!resault) {
            return false
        }
        if (resault.userId !== userId) {
            return '403'
        }
        return await this.commentRepo.deleteComment(commentId)
    }

    //check below
    /*async getDbCommentById(commentId: string): Promise<CommentsDbType | null> {
        return await this.commentRepo.getCommentById(commentId)
    }*/
}

//export const commentService = new CommentService()
