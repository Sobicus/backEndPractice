import {Locals, NextFunction, Request, Response, Router} from "express";
import {app} from "../settings";
import {blogsRepository, blogsRepositoryType} from "../repositories/blogs-repository";

export const blogsRouter = Router()

function checkAuthorization(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.header("Authorization");

    if (!authorizationHeader) {
        return res.sendStatus(401); // Отсутствие заголовка Authorization в запросе, не авторизовано
    }

    // Извлечение логина и пароля из заголовка
    const [, base64Credentials] = authorizationHeader.split(" ");
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");

    // Здесь вы можете выполнить проверку логина и пароля, например, сравнение с ожидаемыми значениями
    if (username === "admin" && password === "qwerty") {
        // Успешная авторизация
        return next();
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
blogsRouter.post('/', (req: postRequestWithBody<blogPostBodyRequest>, res: Response) => {
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
blogsRouter.put('/:id', (req: putRequestChangeBlog<{ id: string }, blogPostBodyRequest>, res: Response) => {
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

