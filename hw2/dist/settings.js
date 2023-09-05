"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const posts_repository_1 = require("./repositories/posts-repository");
const blogs_repository_1 = require("./repositories/blogs-repository");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
// app.use(express.json())
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.get('/', (req, res) => {
    res.send('This first page if we connect to localhost:3000');
});
exports.app.get('/testing/all-data', (req, res) => {
    posts_repository_1.postDb.length = 0;
    blogs_repository_1.blogsDb.length = 0;
    res.sendStatus(204);
});
