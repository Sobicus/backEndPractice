import {body} from "express-validator";
import {BlogRepository, blogsDb} from "../repositories/blogs-repository";
import {inputVal} from "./errorValidator";


export const validationPostsMidleware = [
    body('title')
        .isString().withMessage('Title not a string')
        .trim().notEmpty().withMessage('Title can`t be empty and cannot consist of only spaces')
        .trim().isLength({max: 30}).withMessage('Title cannot be more than 30 characters'),
    body('shortDescription')
        .isString().withMessage('ShortDescription not a string')
        .trim().notEmpty().withMessage('ShortDescription can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({max: 100}).withMessage('ShortDescription cannot be more than 100 characters'),
    body('content')
        .isString().withMessage('Content not a string')
        .trim().notEmpty().withMessage('Content can`t be empty and cannot consist of only spaces')
        .isString().trim().isLength({max: 1000}).withMessage('Content cannot be more than 1000 characters'),
    body('blogId').custom(async value => {
       const blogIsExist = await BlogRepository.findBlogById(value)
        if(!blogIsExist){
            throw new Error("Blog not exist")
        }
        return true
    }).withMessage('Blog not exist'),
    inputVal
]