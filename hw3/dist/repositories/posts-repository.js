"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = void 0;
const db_1 = require("./db");
const mongodb_1 = require("mongodb");
class postsRepository {
    findAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield db_1.client.db(db_1.dataBaseName).collection('posts').find({}).toArray();
            return posts.map(p => ({
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }));
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield db_1.client.db(db_1.dataBaseName).collection('posts').findOne({ _id: new mongodb_1.ObjectId(postId) });
            if (!post) {
                return null;
            }
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            };
        });
    }
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.client.db(db_1.dataBaseName).collection('blogs').findOne({ _id: new mongodb_1.ObjectId(blogId) });
            if (!blog)
                return null;
            const newPost = {
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };
            let newPostByDb = yield db_1.client.db(db_1.dataBaseName).collection('posts').insertOne(Object.assign({}, newPost));
            return Object.assign({ id: newPostByDb.insertedId.toString() }, newPost);
        });
    }
    updatePost(postId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateModel = yield db_1.client.db(db_1.dataBaseName).collection('posts').updateOne({ id: postId }, { $set: updateModel });
            return resultUpdateModel.matchedCount === 1;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeletePost = yield db_1.client.db(db_1.dataBaseName).collection('posts').deleteOne({ _id: new mongodb_1.ObjectId(postId) });
            return resultDeletePost.deletedCount === 1;
        });
    }
}
exports.postRepository = new postsRepository();
