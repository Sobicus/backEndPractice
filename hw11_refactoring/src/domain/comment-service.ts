import {CommentsRepository} from "../repositories/comments-repository";

export class CommentService {
    commentRepo: CommentsRepository

    //commentQueryRepo:CommentsQueryRepository

    constructor() {
        this.commentRepo = new CommentsRepository()
        //this.commentQueryRepo = new CommentsQueryRepository()
    }

    /*
        async getCommentById(commentId: string,userId?:string): Promise<CommentViewType | null> {
            return await this.commentQueryRepo.getCommentById(commentId,userId)
        }
    */
    async updatePost(commentId: string, content: string, userId: string): Promise<boolean | string> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        if (!resault) {
            return false
        }
        if (resault.userId !== userId) {
            return '403'
        }
        return await this.commentRepo.updateComment(commentId, content)
    }

    async deleteComment(commentId: string, userId:string): Promise<boolean | string> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        if (!resault) {
            return false
        }
        if(resault.userId !== userId){
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
