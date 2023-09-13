"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputVal = void 0;
/*
export const errorValidator = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (result.isEmpty()) {
        next()
        return
    }
    const errors = result.array().map(error => ({
        message: error.msg,
        field: error.path
    }));
    res.status(400).send({errorsMessages: errors});
}*/
const express_validator_1 = require("express-validator");
// определяем функцию форматирования ошибок с типами
const inputVal = (req, res, next) => {
    const errorFormatter = ({ path, msg }) => {
        // возвращаем новый объект с нужными полями
        return {
            message: msg,
            field: path // копируем значение из location
        };
    };
    // получаем результат валидации с нашим форматом ошибок и типом
    const result = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
    // проверяем, есть ли ошибки
    if (!result.isEmpty()) {
        // возвращаем ответ с массивом ошибок
        return res.status(400).json({
            errorsMessages: result.array({ onlyFirstError: true })
        });
    }
    return next();
};
exports.inputVal = inputVal;
