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
exports.postsRouter = void 0;
const express_1 = require("express");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
const input_posts_validation_middleware_1 = require("../midlewares/input-posts-validation-middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield posts_repository_1.postRepository.findAllPosts();
    res.status(200).send(blogs);
}));
exports.postsRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield posts_repository_1.postRepository.findPostById(req.params.id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    return res.status(200).send(post);
}));
exports.postsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const newPost = yield posts_repository_1.postRepository.createPost(title, shortDescription, content, blogId);
    if (!newPost)
        return res.sendStatus(404);
    return res.status(201).send(newPost);
}));
exports.postsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMidleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const postIsUpdated = yield posts_repository_1.postRepository.updatePost(req.params.id, { title, shortDescription, content, blogId });
    if (!postIsUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
exports.postsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postIsDelete = yield posts_repository_1.postRepository.deletePost(req.params.id);
    if (!postIsDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
}));
