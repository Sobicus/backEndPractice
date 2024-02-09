import mongoose, {Schema} from "mongoose";

export const commentsSchema = new mongoose.Schema({
    //_id: {type:Schema.Types.ObjectId, required:true},
    createdAt: {type:String, required:true},
    postId: {type:String, required:true},
    content: {type:String, required:true},
    userId: {type:String, required:true},
    userLogin: {type:String, required:true},
})
