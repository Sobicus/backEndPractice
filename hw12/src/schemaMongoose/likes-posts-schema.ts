import {Schema} from "mongoose";
import {LikesStatus} from "../types/likes-comments-repository-types";

export const likesPostsSchemema = new Schema(
    {
        postId: {type:String,required:true},
        userId:{type:String,required:true},
        myStatus:{type:String, enum:LikesStatus, required:true},
        createAt:{type:String,required:true}
    }
)