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
const blogs_repository_1 = require("./blogs-repository");
const db_1 = require("./db");
class postsRepository {
    findAllPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.client.db(db_1.dataBaseName).collection('posts').find({}).toArray();
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield db_1.client.db(db_1.dataBaseName).collection('posts').find({ id: postId });
            return post;
        });
    }
    createPost(title, shortDescription, content, blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const blog = yield blogs_repository_1.BlogRepository.findBlogById(blogId);
            if (!blog)
                return null;
            const newPost = {
                id: (+new Date() + ''),
                title,
                shortDescription,
                content,
                blogId,
                blogName: blog.name
            };
            postDb.push(newPost);
            return newPost;
        });
    }
    updatePost(postId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findPostById(postId);
            if (!post) {
                return false;
            }
            const postIndex = postDb.findIndex(p => p.id === postId);
            const changePost = Object.assign(Object.assign({}, post), updateModel);
            postDb.splice(postIndex, 1, changePost);
            return true;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const indexToDelete = postDb.findIndex(p => p.id === postId);
            if (indexToDelete === -1) {
                return false;
            }
            postDb.splice(indexToDelete, 1);
            return true;
        });
    }
}
exports.postRepository = new postsRepository();
