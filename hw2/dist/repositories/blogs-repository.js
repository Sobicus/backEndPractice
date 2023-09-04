"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRepository = exports.blogsDb = void 0;
exports.blogsDb = [{
        id: "1q",
        name: "string",
        description: "string",
        websiteUrl: "string"
    }, {
        id: "2q",
        name: "string",
        description: "string",
        websiteUrl: "string"
    }];
class blogsRepository {
    findAllBlogs() {
        return exports.blogsDb;
    }
    findBlogById(blogId) {
        return exports.blogsDb.find((b) => b.id === blogId);
    }
    updateBlog(blogId, updateModel) {
        const blog = this.findBlogById(blogId);
        if (!blog) {
            return false;
        }
        const blogIndex = exports.blogsDb.findIndex((b) => b.id === blogId);
        const changeBlog = Object.assign(Object.assign({}, blog), updateModel);
        exports.blogsDb.splice(blogIndex, 1, changeBlog);
        return true;
    }
    createBlog(createModel) {
        const newBlog = Object.assign({ id: (+new Date() + '') }, createModel);
        exports.blogsDb.push(newBlog);
        return newBlog;
    }
    deleteBlog(blogId) {
        const indexToDelete = exports.blogsDb.findIndex(b => b.id === blogId);
        if (indexToDelete === -1) {
            return false;
        }
        exports.blogsDb.splice(indexToDelete, 1);
        return true;
    }
}
exports.BlogRepository = new blogsRepository();
