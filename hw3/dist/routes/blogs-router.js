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
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
const input_blogs_validation_middleware_1 = require("../midlewares/input-blogs-validation-middleware");
exports.blogsRouter = (0, express_1.Router)();
exports.blogsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogs_repository_1.BlogRepository.findAllBlogs();
    res.status(200).send(blogs);
}));
exports.blogsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield blogs_repository_1.BlogRepository.findBlogById(req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(blog);
}));
exports.blogsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_blogs_validation_middleware_1.validationBlogsMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, websiteUrl } = req.body;
    const createdBlog = yield blogs_repository_1.BlogRepository.createBlog({ name, description, websiteUrl });
    res.status(201).send(createdBlog);
}));
exports.blogsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_blogs_validation_middleware_1.validationBlogsMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, description, websiteUrl } = req.body;
    const blogIsUpdated = yield blogs_repository_1.BlogRepository.updateBlog(req.params.id, { name, description, websiteUrl });
    if (!blogIsUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.blogsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogIsDeleted = yield blogs_repository_1.BlogRepository.deleteBlog(req.params.id);
    if (!blogIsDeleted) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
