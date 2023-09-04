import {NextFunction, Request, Response} from "express";

export const checkAuthorization=(req: Request, res: Response, next: NextFunction)=> {
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
        return;
    }
}