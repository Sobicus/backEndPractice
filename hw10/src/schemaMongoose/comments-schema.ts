import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const commentsSchema = new mongoose.Schema({
    _id: {type:ObjectId, required:true},
    createdAt: {type:String, required:true},
    postId: {type:String, required:true},
    content: {type:String, required:true},
    userId: {type:String, required:true},
    userLogin: {type:String, required:true},
})