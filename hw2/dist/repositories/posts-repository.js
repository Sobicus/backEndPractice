"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRepository = exports.postDb = void 0;
const blogs_repository_1 = require("./blogs-repository");
exports.postDb = [{
        id: "1dq",
        title: "eve",
        shortDescription: "online",
        content: "pve/pvp",
        blogId: "13",
        blogName: "20yers+"
    }, {
        id: "2dq",
        title: "string",
        shortDescription: "string",
        content: "string",
        blogId: "string",
        blogName: "string"
    }];
class postsRepository {
    findAllPosts() {
        return exports.postDb;
    }
    findPostById(postId) {
        return exports.postDb.find(p => p.id === postId);
    }
    createPost(title, shortDescription, content, blogId) {
        var _a;
        const blogName = (_a = blogs_repository_1.BlogRepository.findBlogById(blogId)) === null || _a === void 0 ? void 0 : _a.name;
        if (typeof (blogName) === 'string' && typeof (blogName) !== 'undefined') {
            const newPost = {
                id: (+new Date() + ''),
                title,
                shortDescription,
                content,
                blogId,
                blogName
            };
            exports.postDb.push(newPost);
        }
        return exports.postDb[exports.postDb.length - 1];
    }
    updatePost(postId, updateModel) {
        const post = this.findPostById(postId);
        if (!post) {
            return false;
        }
        const postIndex = exports.postDb.findIndex(p => p.id === postId);
        const changePost = Object.assign(Object.assign({}, post), updateModel);
        exports.postDb.splice(postIndex, 1, changePost);
        return true;
    }
    deletePost(postId) {
        const indexToDelete = exports.postDb.findIndex(p => p.id === postId);
        if (indexToDelete === -1) {
            return false;
        }
        exports.postDb.splice(indexToDelete, 1);
        return true;
    }
}
exports.postRepository = new postsRepository();
