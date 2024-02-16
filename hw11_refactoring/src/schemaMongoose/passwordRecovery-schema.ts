import mongoose, {Schema} from "mongoose";
import {PasswordRecoveryType} from "../repositories/passwordRecovery-repository";

export const passwordRecoverySchema = new mongoose.Schema({
    _id: {type:Schema.Types.ObjectId, required:true},
    passwordRecoveryCode: {type:String, required:true},
    codeExpirationDate: {type:Number, required:true},
    userId: {type:String, required:true},
    alreadyChangePassword: {type:Boolean, required:true}
})