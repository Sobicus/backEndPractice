import {Schema} from "mongoose";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {LikesPostRepositoryType} from "../types/likes-post-repository-type";

export const likesPostsScheme = new Schema<LikesPostRepositoryType>(
    {
        postId: {type:String,required:true},
        userId:{type:String,required:true},
        login:{type:String,required:true},
        myStatus:{type:String, enum:LikesStatus, required:true},
        createAt:{type:String,required:true}
    }
)