import {client, dataBaseName} from "./db";
import {CommentsRepositoryType, CommentsViewType} from "../types/comments-type";
import {ObjectId} from "mongodb";

export class CommentRepository {
    async getCommentById(commentId: string): Promise<CommentsViewType | null> {
        const comment = await client.db(dataBaseName).collection<CommentsRepositoryType>('comments').findOne({_id: new ObjectId(commentId)})
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
        const resultUpdateCommentModel = await client.db(dataBaseName).collection<CommentsRepositoryType>('comments').updateOne({_id: new ObjectId(commentId)}, {content: content})
        return resultUpdateCommentModel.matchedCount === 1
    }

    async deleteComment(commentId: string): Promise<boolean> {
        const resultDeleteComment = await client.db(dataBaseName).collection<CommentsRepositoryType>('comments').deleteOne({_id: new ObjectId(commentId)})
        return resultDeleteComment.deletedCount === 1
    }
}