"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuthorization = void 0;
const checkAuthorization = (req, res, next) => {
    const authorizationHeader = req.header("Authorization"); //'Basic fhdlkglgljf"
    if (!authorizationHeader) {
        res.sendStatus(401); // Отсутствие заголовка Authorization в запросе, не авторизовано
        return;
    }
    const token = authorizationHeader.split(" ")[0]; //"Basic"
    if (token !== "Basic")
        return res.sendStatus(401);
    // Извлечение логина и пароля из заголовка
    const base64Credentials = authorizationHeader.split(" ")[1]; //'Basic fljglfjldjgfj' -> ['Basic', 'gfrhuhgufh']
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    // Здесь вы можете выполнить проверку логина и пароля, например, сравнение с ожидаемыми значениями
    if (username === "admin" && password === "qwerty") {
        // Успешная авторизация
        return next();
    }
    else {
        // Неверные учетные данные
        res.sendStatus(401); // Запретено
        return;
    }
};
exports.checkAuthorization = checkAuthorization;
