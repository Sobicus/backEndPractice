"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationBlogsMidleware = void 0;
const express_validator_1 = require("express-validator");
const errorValidator_1 = require("./errorValidator");
// import {errorValidator} from "./errorValidator";
exports.validationBlogsMidleware = [
    (0, express_validator_1.body)('name').isString().withMessage('Name not a string').trim().isLength({ max: 15 }).notEmpty().withMessage('Invalid name'),
    (0, express_validator_1.body)('description').isString().trim().isLength({ max: 500 }).notEmpty().withMessage('Invalid description'),
    (0, express_validator_1.body)('websiteUrl').matches('^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$').isLength({ max: 100 }).notEmpty(),
    errorValidator_1.inputVal
    // errorValidator
];
