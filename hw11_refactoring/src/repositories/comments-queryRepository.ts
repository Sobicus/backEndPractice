import { CommentViewType} from "../types/comment-types";
import {ObjectId} from "mongodb";
import {CommentsModel, LikesCommentsModel} from "./db";
import {LikesStatus} from "./likes-commets-repository";

export class CommentsQueryRepository {
    async getCommentById(commentId: string, userId?: string): Promise<CommentViewType | null> {
        const comment = await CommentsModel
            .findOne({_id: new ObjectId(commentId)})
        if (!comment) {
            return null
        }

        let myStatus = LikesStatus.None

        if (userId) {
            const reaction = await LikesCommentsModel
                .findOne({userId, commentId: comment._id.toString()}).exec()
            myStatus = reaction ? reaction.myStatus : LikesStatus.None
        }

        const result = {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userId: comment.userId,
                userLogin: comment.userLogin
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: await LikesCommentsModel.countDocuments({
                    commentId: comment._id.toString(),
                    myStatus: LikesStatus.Like
                }),
                dislikesCount: await LikesCommentsModel.countDocuments({
                    commentId: comment._id.toString(),
                    myStatus: LikesStatus.Dislike
                }),
                myStatus
            }
        }
        return result
    }


}