"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const authorization_check_middleware_1 = require("../midlewares/authorization-check-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
const input_posts_validation_middleware_1 = require("../midlewares/input-posts-validation-middleware");
exports.postsRouter = (0, express_1.Router)();
exports.postsRouter.get('/', (req, res) => {
    const blogs = posts_repository_1.postRepository.findAllPosts();
    res.status(200).send(blogs);
});
exports.postsRouter.get('/:id', (req, res) => {
    const post = posts_repository_1.postRepository.findPostById(req.params.id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(post);
});
exports.postsRouter.post('/', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMidleware, (req, res) => {
    let { title, shortDescription, content, blogId } = req.body;
    const newPost = posts_repository_1.postRepository.createPost(title, shortDescription, content, blogId);
    res.status(201).send(newPost);
});
exports.postsRouter.put('/:id', authorization_check_middleware_1.checkAuthorization, ...input_posts_validation_middleware_1.validationPostsMidleware, (req, res) => {
    let { title, shortDescription, content, blogId } = req.body;
    const postIsUpdated = posts_repository_1.postRepository.updatePost(req.params.id, { title, shortDescription, content, blogId });
    if (!postIsUpdated) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
exports.postsRouter.delete('/:id', authorization_check_middleware_1.checkAuthorization, (req, res) => {
    const postIsDelete = posts_repository_1.postRepository.deletePost(req.params.id);
    if (!postIsDelete) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);
});
