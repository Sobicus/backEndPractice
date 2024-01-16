import {LikesCommentsRepository} from "../repositories/likes-commets-repository";

class LikeCommentsService {
    likesCommentsRepo: LikesCommentsRepository

    constructor() {
        this.likesCommentsRepo = new LikesCommentsRepository()
    }

    likeCommentUpdate(commentId:string, userId:string){

    }
}

export const likeCommentsService = new LikeCommentsService()