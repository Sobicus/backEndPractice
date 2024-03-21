import {CommentsRepository} from "../repositories/comments-repository";
import {ObjectResult, statusType} from "../commands/object-result";
import {injectable} from "inversify";

@injectable()
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
    async updateComments(commentId: string, content: string, userId: string): Promise<ObjectResult> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        /* if (!resault) {
             return false
         }
         if (resault.userId !== userId) {
             return '403'
         }
         return await this.commentRepo.updateComment(commentId, content)*/
        if (!resault) {
            return {
                status: statusType.NotFound,
                errorMessages: 'comment can not be> yarn add inversify reflect-metadata\n found',
                data: null
            }
        }
        if (resault.userId !== userId) {
            return {
                status: statusType.Forbidden,
                errorMessages: 'its not your comment',
                data: null
            }
        }
        await this.commentRepo.updateComment(commentId, content)
        return {
            status: statusType.Success,
            errorMessages: 'comment has been updated',
            data: null
        }

    }

    async deleteComment(commentId: string, userId: string): Promise<ObjectResult> {
        const resault = await this.commentRepo.findCommentsById(commentId)
        if (!resault) {
            return {
                status:statusType.NotFound,
                errorMessages:'comment can not be found',
                data:null
            }
        }
        if (resault.userId !== userId) {
            return {
                status:statusType.Forbidden,
                errorMessages:'its not your comment',
                data: null
            }
        }
         await this.commentRepo.deleteComment(commentId)
        return {
            status:statusType.Success,
            errorMessages:'comment has been deleted',
            data: null
        }
    }

    //check below
    /*async getDbCommentById(commentId: string): Promise<CommentsDbType | null> {
        return await this.commentRepo.getCommentById(commentId)
    }*/
}

//export const commentService = new CommentService()
