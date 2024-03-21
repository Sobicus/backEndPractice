import {Router} from "express";
import {checkAuthorization} from "../midlewares/authorization-check-middleware";
import {validationBlogsMiddleware} from "../midlewares/input-blogs-validation-middleware";
import {validationPostsByBlogIdMidleware} from "../midlewares/input-postsByBlogId-validation-middleware";
import {softAuthMiddleware} from "../midlewares/soft-auth-middleware";
import {blogsControllerInstance} from "../composition-root";

export const blogsRouter = Router()

blogsRouter.get('/', blogsControllerInstance.getAllBlogs.bind(blogsControllerInstance))
blogsRouter.get(':id', blogsControllerInstance.getBlogById.bind(blogsControllerInstance))
blogsRouter.get('/:id/posts',softAuthMiddleware, blogsControllerInstance.getPostsByBlogId.bind(blogsControllerInstance))
blogsRouter.post('/:id/posts', checkAuthorization, ...validationPostsByBlogIdMidleware, blogsControllerInstance.createPost.bind(blogsControllerInstance))
blogsRouter.post('/', checkAuthorization, ...validationBlogsMiddleware, blogsControllerInstance.createBlog.bind(blogsControllerInstance))
blogsRouter.put('/:id', checkAuthorization, ...validationBlogsMiddleware, blogsControllerInstance.updateBlog.bind(blogsControllerInstance))
blogsRouter.delete('/:id', checkAuthorization, blogsControllerInstance.deleteBlog.bind(blogsControllerInstance))