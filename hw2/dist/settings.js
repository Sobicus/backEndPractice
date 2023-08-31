"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
exports.app = (0, express_1.default)();
exports.app.use(bodyParser());
// app.use(express.json())
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.get('/', (req, res) => {
    res.send('This first page if we connect to localhost:3000');
});
