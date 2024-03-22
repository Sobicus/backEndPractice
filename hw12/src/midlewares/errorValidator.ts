import {NextFunction, Request, Response} from "express";

import {validationResult} from 'express-validator';

// определяем функцию форматирования ошибок с типами
export const inputVal = (req: Request, res: Response, next: NextFunction) => {
    const errorFormatter = ({path, msg}: any) => {
        // возвращаем новый объект с нужными полями
        return {
            message: msg as string, // копируем значение из value
            field: path as string // копируем значение из location
        };
    };

// получаем результат валидации с нашим форматом ошибок и типом
    const result = validationResult(req).formatWith(errorFormatter);

// проверяем, есть ли ошибки
    if (!result.isEmpty()) {
        // возвращаем ответ с массивом ошибок
        return res.status(400).json({
            errorsMessages: result.array({onlyFirstError: true})
        });

    }
    return next();
}
