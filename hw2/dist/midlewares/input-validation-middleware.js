"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMidleware = void 0;
const express_validator_1 = require("express-validator");
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
exports.validationMidleware = [
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
