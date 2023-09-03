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
    const errors = result.array().map(error => ({
        message: error.msg,
        field: error.path
    }));
    res.status(400).send({ errorsMessages: errors });
};
const validationMidleware = [
    (0, express_validator_1.body)('name').isString().trim().isLength({ max: 15 }).notEmpty(),
    (0, express_validator_1.body)('description').isString().trim().isLength({ max: 500 }).notEmpty(),
    (0, express_validator_1.body)('websiteUrl').custom(value => {
        // проверяем, соответствует ли значение регулярному выражению для URL
        const regex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
        if (regex.test(value)) {
            // если да, то возвращаем true
            return true;
        }
        else {
            // если нет, то выбрасываем ошибку с сообщением
            throw new Error('Invalid website URL');
        }
    }).isLength({ max: 100 }).notEmpty(),
    errorValidator
];
exports.blogsRouter.post('/', checkAuthorization, ...validationMidleware, (req, res) => {
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
exports.blogsRouter.put('/:id', checkAuthorization, ...validationMidleware, (req, res) => {
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
