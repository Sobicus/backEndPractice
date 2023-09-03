import {Locals, NextFunction, Request, Response, Router} from "express";
import {blogsRepository, blogsRepositoryType} from "../repositories/blogs-repository";
import {body, ErrorFormatter, validationResult} from "express-validator";

export const blogsRouter = Router()

function checkAuthorization(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
        res.sendStatus(401); // Отсутствие заголовка Authorization в запросе, не авторизовано
        return
    }

    // Извлечение логина и пароля из заголовка
    const [, base64Credentials] = authorizationHeader.split(" ");
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    // Здесь вы можете выполнить проверку логина и пароля, например, сравнение с ожидаемыми значениями
    if (username === "admin" && password === "qwerty") {
        // Успешная авторизация
        next();
    } else {
        // Неверные учетные данные
        res.sendStatus(403); // Запретено
    }
}

type UserCredentials = {
    username: string;
    password: string;
}
blogsRouter.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository)
})
blogsRouter.get('/:id', (req: RequestWithParams<{ id: string }>, res: Response) => {
    const blog = blogsRepository.find(blog => blog.id === req.params.id)
    if (!blog) {
        res.sendStatus(404)
        return
    }
    res.status(200).send(blog)
})

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
const validationMidleware = [
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
blogsRouter.post('/', checkAuthorization, ...validationMidleware, (req: postRequestWithBody<blogPostBodyRequest>, res: Response) => {
    let {name, description, websiteUrl} = req.body
    const newBlog: blogsRepositoryType = {
        id: (+new Date() + ''),
        name,
        description,
        websiteUrl,
    }

    blogsRepository.push(newBlog)
    res.status(201).send(newBlog)
})
blogsRouter.put('/:id', checkAuthorization, ...validationMidleware,(req: putRequestChangeBlog<{ id: string }, blogPostBodyRequest>, res: Response) => {
    const blog = blogsRepository.find(b => b.id === req.params.id)
    const blogIndex = blogsRepository.findIndex(b => b.id === req.params.id)
    let {name, description, websiteUrl} = req.body

    if (!blog) {
        res.sendStatus(404)
        return
    }
    const changeBlog = {...blog, name, description, websiteUrl}
    blogsRepository.splice(blogIndex, 1, changeBlog)
    res.sendStatus(204)
})
blogsRouter.delete('/:id', checkAuthorization, (req: RequestWithParams<{ id: string }>, res: Response) => {
    const indexToDelete = blogsRepository.findIndex(b => b.id === req.params.id)
    if (indexToDelete !== -1) {
        blogsRepository.splice(indexToDelete, 1)
        res.sendStatus(204)
        return
    } else {
        res.sendStatus(404)
        return
    }
})

type RequestWithParams<P> = Request<P, {}, {}, {}>
type postRequestWithBody<B> = Request<{}, {}, B, {}>
type blogPostBodyRequest = {
    name: string
    description: string
    websiteUrl: string
}
type putRequestChangeBlog<P, B> = Request<P, {}, B, {}>
type ErrorMessages = {
    message: string
    field: string
}
type ErrorType = {
    errorsMessages: ErrorMessages[]
}
