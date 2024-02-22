import mongoose, {Schema} from "mongoose";
import { blogsRepositoryType } from "../types/blogs-type";

export const blogSchema = new mongoose.Schema<blogsRepositoryType>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: {type: Boolean, required: true},
});