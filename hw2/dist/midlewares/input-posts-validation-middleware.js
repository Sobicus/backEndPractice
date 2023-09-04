"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationPostsMidleware = void 0;
const express_validator_1 = require("express-validator");
const blogs_repository_1 = require("../repositories/blogs-repository");
const errorValidator_1 = require("./errorValidator");
exports.validationPostsMidleware = [
    (0, express_validator_1.body)('title').isString().trim().isLength({ max: 15 }).notEmpty(),
    (0, express_validator_1.body)('description').isString().trim().isLength({ max: 500 }).notEmpty(),
    (0, express_validator_1.body)('blogId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blogIsExist = yield blogs_repository_1.BlogRepository.findBlog(value);
        if (!blogIsExist) {
            throw new Error("Blog not exist");
        }
        return true;
    })).withMessage('Blog not exist'),
    errorValidator_1.inputVal
];
