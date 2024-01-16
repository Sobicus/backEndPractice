import mongoose, {Schema} from "mongoose";
import {LikesStatus} from "../repositories/likes-commets-repository";

export const likesCommentsSchema = new Schema({
    _id: {type: Schema.Types.ObjectId, required: true},
    userId: {type: String, required: true},
    commentId: {type: String, required: true},
    // myStatus: {type: String, required: true},
    // myStatus1: {type: String, enum: likesStatus, required: true},
    // myStatus2: {type: mongoose.Schema.Types.String, enum: ['none', 'like', 'dislike'], required: true},
    // myStatus3: {type: String, enum: ['none', 'like', 'dislike'], required: true},
    myStatus4: {type: mongoose.Schema.Types.String, enum: Object.values(LikesStatus), required: true},
    createdAt: {type: String, required: true}
})