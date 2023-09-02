"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const express_validator_1 = require("express-validator");
exports.blogsRouter = (0, express_1.Router)();
function checkAuthorization(req, res, next) {
    const authorizationHeader = req.header("Authorization");
    if (!authorizationHeader) {
        res.sendStatus(401); // Отсутствие заголовка Authorization в запросе, не авторизовано
        return;
    }
    // Извлечение логина и пароля из заголовка
    const [, base64Credentials] = authorizationHeader.split(" ");
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    // Здесь вы можете выполнить проверку логина и пароля, например, сравнение с ожидаемыми значениями
    if (username === "admin" && password === "qwerty") {
        // Успешная авторизация
        next();
    }
    else {
        // Неверные учетные данные
        res.sendStatus(403); // Запретено
    }
}
exports.blogsRouter.get('/', (req, res) => {
    res.status(200).send(blogs_repository_1.blogsRepository);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const blog = blogs_repository_1.blogsRepository.find(blog => blog.id === req.params.id);
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    res.status(200).send(blog);
});
const errorValidator = (req, res, next) => {
    const result = (0, express_validator_1.validationResult)(req);
    if (result.isEmpty()) {
        next();
        return;
    }
    res.send({ errors: result.array() });
};
const x = [
    (0, express_validator_1.body)('name').isString().is,
    (0, express_validator_1.body)('description').isString(),
    (0, express_validator_1.body)('websiteUrl').isURL(),
    errorValidator
];
exports.blogsRouter.post('/', checkAuthorization, ...x, (req, res) => {
    let { name, description, websiteUrl } = req.body;
    const newBlog = {
        id: (+new Date() + ''),
        name,
        description,
        websiteUrl,
    };
    blogs_repository_1.blogsRepository.push(newBlog);
    res.status(201).send(newBlog);
});
exports.blogsRouter.put('/:id', (req, res) => {
    const blog = blogs_repository_1.blogsRepository.find(b => b.id === req.params.id);
    const blogIndex = blogs_repository_1.blogsRepository.findIndex(b => b.id === req.params.id);
    let { name, description, websiteUrl } = req.body;
    if (!blog) {
        res.sendStatus(404);
        return;
    }
    const changeBlog = Object.assign(Object.assign({}, blog), { name, description, websiteUrl });
    blogs_repository_1.blogsRepository.splice(blogIndex, 1, changeBlog);
    res.sendStatus(204);
});
exports.blogsRouter.delete('/:id', checkAuthorization, (req, res) => {
    const indexToDelete = blogs_repository_1.blogsRepository.findIndex(b => b.id === req.params.id);
    if (indexToDelete !== -1) {
        blogs_repository_1.blogsRepository.splice(indexToDelete, 1);
        res.sendStatus(204);
        return;
    }
    else {
        res.sendStatus(404);
        return;
    }
});
