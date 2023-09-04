import {body} from "express-validator";
import {BlogRepository} from "../repositories/blogs-repository";
import {inputVal} from "./errorValidator";


export const validationPostsMidleware = [
    body('title').isString().trim().isLength({max: 15}).notEmpty(),
    body('description').isString().trim().isLength({max: 500}).notEmpty(),
    body('blogId').custom(async value => {
       const blogIsExist = await BlogRepository.findBlog(value)

        if(!blogIsExist){
            throw new Error("Blog not exist")
        }

        return true
    }).withMessage('Blog not exist'),
    inputVal
]