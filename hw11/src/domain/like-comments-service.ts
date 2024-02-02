import {LikesCommentsRepository, LikesStatus} from "../repositories/likes-commets-repository";

class LikeCommentsService {
    likesCommentsRepo: LikesCommentsRepository

    constructor() {
        this.likesCommentsRepo = new LikesCommentsRepository()
    }

    likeCommentUpdate(commentId:string, userId:string, likeStatus:LikesStatus){

    }
}

export const likeCommentsService = new LikeCommentsService()