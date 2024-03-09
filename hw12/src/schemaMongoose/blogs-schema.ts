import mongoose, {Schema} from "mongoose";
import { blogsDbType } from "../types/blog-types";

export const blogSchema = new mongoose.Schema<blogsDbType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
});