import {CommentsRepositoryType, CommentsViewType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {CommentsModel} from "./db";

export class CommentsRepository {
    async getCommentById(commentId: string): Promise<CommentsRepositoryType | null> {
       return CommentsModel
            .findOne({_id: new ObjectId(commentId)})

    }

    async updateComment(commentId: string, content: string): Promise<boolean> {
        const resultUpdateCommentModel = await CommentsModel
            .updateOne({_id: new ObjectId(commentId)}, {$set:{content: content}})
        return resultUpdateCommentModel.matchedCount === 1
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const resultDeleteComment = await CommentsModel
            .deleteOne({_id: new ObjectId(commentId)})
        return resultDeleteComment.deletedCount === 1
    }
}