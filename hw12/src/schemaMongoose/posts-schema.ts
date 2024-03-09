import mongoose, {Schema} from 'mongoose'
export const postsSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required:true},
    title: {type: String, required:true},
    shortDescription: {type: String, required:true},
    content: {type: String, required:true},
    blogId: {type: String, required:true},
    blogName: {type: String, required:true},
    createdAt: {type: String, required:true},
})