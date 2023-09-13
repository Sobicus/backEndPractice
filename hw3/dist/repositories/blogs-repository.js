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
exports.BlogRepository = void 0;
const db_1 = require("./db");
class blogsRepository {
    findAllBlogs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.client.db(db_1.dataBaseName).collection('blogs').find({}).toArray();
        });
    }
    // тут был undefined поменял на налл это так работает мангошка?????
    findBlogById(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            let blog = yield db_1.client.db(db_1.dataBaseName).collection('blogs').findOne({ id: blogId });
            return blog;
            // blogsDb.find((b) => b.id === blogId)
        });
    }
    updateBlog(blogId, updateModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultUpdateModel = yield db_1.client.db(db_1.dataBaseName).collection('blogs').updateOne({ id: blogId }, { $set: updateModel });
            return resultUpdateModel.matchedCount === 1;
        });
    }
    createBlog(createModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBlog = Object.assign({ id: (+new Date() + '') }, createModel);
            const resultNewBlog = yield db_1.client.db(db_1.dataBaseName).collection('blogs').insertOne(newBlog);
            return newBlog;
        });
    }
    deleteBlog(blogId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resultDeleteBlog = yield db_1.client.db(db_1.dataBaseName).collection('blogs').deleteOne({ id: blogId });
            return resultDeleteBlog.deletedCount === 1;
        });
    }
}
exports.BlogRepository = new blogsRepository();
