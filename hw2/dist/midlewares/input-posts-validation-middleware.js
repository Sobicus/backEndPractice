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
    (0, express_validator_1.body)('title')
        .isString().withMessage('Title not a string')
        .trim().notEmpty().withMessage('Title can`t be empty and cannot consist of only spaces')
        .trim().isLength({ max: 30 }).withMessage('Title cannot be more than 30 characters'),
    (0, express_validator_1.body)('shortDescription')
        .isString().withMessage('ShortDescription not a string')
        .trim().notEmpty().withMessage('ShortDescription can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({ max: 100 }).withMessage('ShortDescription cannot be more than 100 characters'),
    (0, express_validator_1.body)('content')
        .isString().withMessage('Content not a string')
        .trim().notEmpty().withMessage('Content can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({ max: 1000 }).withMessage('Content cannot be more than 1000 characters'),
    (0, express_validator_1.body)('blogId').custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const blogIsExist = yield blogs_repository_1.BlogRepository.findBlogById(value);
        if (!blogIsExist) {
            throw new Error("Blog not exist");
        }
        return true;
    })).withMessage('Blog not exist'),
    errorValidator_1.inputVal
];
