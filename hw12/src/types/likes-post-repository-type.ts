import {ObjectId} from "mongodb";
import {LikesStatus} from "./likes-comments-repository-types";

export type LikesPostRepositoryType={
    _id:ObjectId
    postId:string
    userId:string
    myStatus:LikesStatus
    createAt:string
}
export type LikesPostInputDBType={
    postId:string
    userId:string
    myStatus:LikesStatus
    createAt:string
}