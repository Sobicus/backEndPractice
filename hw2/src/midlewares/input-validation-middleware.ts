import {NextFunction, Request, Response} from "express";
import {body, validationResult} from "express-validator";

const errorValidator = (req: Request, res: Response, next: NextFunction) => {
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
}
export const validationMidleware = [
    body('name').isString().trim().isLength({max: 15}).notEmpty(),
    body('description').isString().trim().isLength({max: 500}).notEmpty(),
    body('websiteUrl').custom(value => {
        // проверяем, соответствует ли значение регулярному выражению для URL
        const regex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
        if (regex.test(value)) {
            // если да, то возвращаем true
            return true;
        } else {
            // если нет, то выбрасываем ошибку с сообщением
            throw new Error('Invalid website URL');
        }
    }).isLength({max: 100}).notEmpty(),
    errorValidator
]