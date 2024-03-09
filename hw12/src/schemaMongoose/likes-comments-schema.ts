import mongoose, {Schema} from "mongoose";
import {LikesCommentsRepoDbType, LikesStatus} from "../types/likes-comments-repository-types";

export const likesCommentsSchema = new Schema<LikesCommentsRepoDbType>({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    // myStatus: {type: String, required: true},
    myStatus: {type: String, enum: LikesStatus, required: true},
    //  myStatus2: {type: mongoose.Schema.Types.String, enum: ['none', 'like', 'dislike'], required: true},
    // myStatus3: {type: String, enum: ['none', 'like', 'dislike'], required: true},
    // myStatus: {type: mongoose.Schema.Types.String, enum: Object.values(LikesStatus), required: true},
    createdAt: {type: String, required: true}
})