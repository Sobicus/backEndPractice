import {ObjectId} from "mongodb";
import {IBlockPagination, IQuery, PaginationType, SortBlogsByEnum} from "../types/paggination-type";
import {getBlogsPagination} from "../helpers/pagination-helpers";
import {BlogsModel, PostsModel} from "./db";
import {BlogViewType} from "../types/blog-types";
import { PostsViewType } from "../types/post-types";


export class BlogsQueryRepository {
    async findAllBlogs(pagination: IBlockPagination): Promise<PaginationType<BlogViewType>> {
        const filter = {name: {$regex: pagination.searchNameTerm, $options: 'i'}}
        const blogs = await BlogsModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .limit(pagination.pageSize)
            .skip(pagination.skip)
            .lean();
        const allBlogs = blogs.map(b => ({
            id: b._id.toString(),
            name: b.name,
            websiteUrl: b.websiteUrl,
            description: b.description,
            createdAt: b.createdAt,
            isMembership: b.isMembership
        }))
        const totalCount = await BlogsModel
            .countDocuments(filter)
        const pagesCount = Math.ceil(totalCount / pagination.pageSize)

        return {
            pagesCount: pagesCount /*=== 0 ? 1 : pagesCount*/,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: allBlogs
        }
    }

    async findBlogById(blogId: string): Promise<BlogViewType | null> {
        let blog = await BlogsModel
            .findOne({_id: new ObjectId(blogId)})
        if (!blog) {
            return null
        }
        return {
            id: blog._id.toString(),
            name: blog.name,
            websiteUrl: blog.websiteUrl,
            description: blog.description,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }

    async findPostByBlogId(blogId: string, query: IQuery<SortBlogsByEnum>): Promise<PaginationType<PostsViewType> | null> {
        let blog = await BlogsModel
            .findOne({_id: new ObjectId(blogId)})
        if (!blog) {
            return null
        }
        /*const blogId = blog._id.toString()*/
        const pagination = getBlogsPagination(query)
        const posts = await PostsModel
            .find({blogId: blogId})
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .skip(pagination.skip).limit(pagination.pageSize)
            .lean();
        const allPosts = posts.map(p => ({
            id: p._id.toString(),
            title: p.title,
            shortDescription: p.shortDescription,
            content: p.content,
            blogId: p.blogId,
            blogName: p.blogName,
            createdAt: p.createdAt
        }))
        const totalCount = await PostsModel
            .countDocuments({blogId: blogId})
        const pagesCount = Math.ceil(totalCount / pagination.pageSize)
        return {
            pagesCount: pagesCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }
}

