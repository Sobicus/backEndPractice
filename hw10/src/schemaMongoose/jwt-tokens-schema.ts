import mongoose from "mongoose";
import {ObjectId} from "mongodb";

export const jwtTokensSchema = new mongoose.Schema({
    _id: {type:ObjectId, required:true},
    refreshToken: {type:String, required:true},
})