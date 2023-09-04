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
const posts_repository_1 = require("../repositories/posts-repository");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => {
    res.status(200).send(posts_repository_1.postsRepository);
});
exports.postsRouter.get('/:id', (req, res) => {
    const post = posts_repository_1.postsRepository.find(el => el.id === req.params.id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(post);
});
exports.postsRouter.post('/', authorization_check_middleware_1.checkAuthorization, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { title, shortDescription, content, blogId } = req.body;
    const blog = yield blogsRepository.find(b => b.id === blogId);
    if (!blog) {
        res.sendStatus(404);
    }
    else {
        const newPost = {
            id: (+new Date() + ''),
            title,
            shortDescription,
            content,
            blogId,
            blogName: blog.description
        };
        posts_repository_1.postsRepository.push(newPost);
        res.status(201).send(newPost);
    }
}));
exports.postsRouter.put('/', authorization_check_middleware_1.checkAuthorization, () => __awaiter(void 0, void 0, void 0, function* () {
}));
