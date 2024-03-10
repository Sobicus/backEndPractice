import dotenv from 'dotenv'
import mongoose from 'mongoose'
import {blogSchema} from "../schemaMongoose/blogs-schema";
import {postsSchema} from "../schemaMongoose/posts-schema";
import {commentsSchema} from "../schemaMongoose/comments-schema";
import {jwtTokensSchema} from '../schemaMongoose/jwt-tokens-schema';
import {rateLimitSchema} from "../schemaMongoose/rate-limit-schema";
import {sessionsSchema} from "../schemaMongoose/sessions-schema";
import {IUser, usersSchema} from '../schemaMongoose/users-schema';
import {passwordRecoverySchema} from "../schemaMongoose/passwordRecovery-schema";
import {likesCommentsSchema} from "../schemaMongoose/likes-comments-schema";
import { LikesCommentsDbType } from '../types/likes-comments-repository-types';
import { likesPostsSchemema } from '../schemaMongoose/likes-posts-schema';
dotenv.config()

export const BlogsModel = mongoose.model('Blogs', blogSchema);
export const PostsModel = mongoose.model('Posts', postsSchema)
export const CommentsModel = mongoose.model('Comments', commentsSchema)
export const JwtTokenModel = mongoose.model('JwtTokens', jwtTokensSchema)
export const RateLimitModel = mongoose.model('RateSessions', rateLimitSchema)
export const SessionsModel = mongoose.model('Sessions', sessionsSchema)
export const UsersModel = mongoose.model<IUser>('Users', usersSchema)
export const PasswordRecoveryModel = mongoose.model('PasswordRecovery', passwordRecoverySchema)
export const LikesCommentsModel = mongoose.model<LikesCommentsDbType>('LikesComments', likesCommentsSchema)
export const LikesPostsModel = mongoose.model('LikesPosts', likesPostsSchemema)

const mongoUri = process.env.MONGO_URL || 'mongodb://0.0.0.0:27017'
console.log(process.env.MONGO_URL)

// export const client = new MongoClient(mongoUri) //mongoDB
// export const dataBaseName = 'MyDataBase' //mongoDB
export async function runDb() {
    try {
        await mongoose.connect(mongoUri);
        // Connect the client to the server
        //await client.connect() //mongoDB
        // Establish and verufy connection
        //await client.db(dataBaseName).command({ping: 1}) //mongoDB
        console.log('Connected successfully to mongo server')
    } catch {
        console.log('Can`t connect to db')
        await mongoose.disconnect()
        // Ensures that the client will close when you finish/error
        //await client.close() //mongoDB
    }
}