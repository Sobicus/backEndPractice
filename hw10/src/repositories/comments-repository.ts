import {CommentsRepositoryType, CommentsViewType} from "../types/comments-type";
import {ObjectId} from "mongodb";
import {CommentsModel} from "./db";

export class CommentsRepository {
    async getCommentById(commentId: string): Promise<CommentsViewType | null> {
        const comment = await CommentsModel
            .findOne({_id: new ObjectId(commentId)})
        if (!comment) {
            return null
        }
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: comment.userLogin
            },
            createdAt: comment.createdAt
        }
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