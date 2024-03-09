import mongoose, {Schema} from "mongoose";

export const jwtTokensSchema = new mongoose.Schema({
    _id: {type: Schema.Types.ObjectId, required:true},
    refreshToken: {type:String, required:true},
})