import mongoose, {Schema} from "mongoose";

export const passwordRecoverySchema = new mongoose.Schema({
    _id: {type:Schema.Types.ObjectId, required:true},
    passwordRecoveryCode: {type:String, required:true},
    codeExpirationDate: {type:Number, required:true},
    userId: {type:String, required:true},
    alreadyChangePassword: {type:Boolean, required:true}
})