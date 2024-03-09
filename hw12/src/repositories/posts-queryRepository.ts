import {ObjectId} from "mongodb";
import {IPostPagination, PaginationType} from "../types/paggination-type";
import {CommentsViewType} from "../types/comment-types";
import {DefaultCommentsPaginationType} from "../helpers/pagination-comments";
import { CommentsModel, LikesCommentsModel, PostsModel} from "./db";
import { PostsViewType } from "../types/post-types";
import { LikesStatus } from "../types/likes-comments-repository-types";

export class PostsQueryRepository {

    async findAllPosts(postsPagination: IPostPagination): Promise<PaginationType<PostsViewType>> {
        const posts = await PostsModel
            .find({})
            .sort({[postsPagination.sortBy]: postsPagination.sortDirection})
            .limit(postsPagination.pageSize)
            .skip(postsPagination.skip)
            .lean()
        const totalCount = await PostsModel
            .countDocuments()
        const pagesCount = Math.ceil(totalCount / postsPagination.pageSize)
        const allPosts = posts.map(p => (
            {
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt
            }))
        return {
            pagesCount: pagesCount,
            page: postsPagination.pageNumber,
            pageSize: postsPagination.pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }

    async findPostById(postId: string): Promise<PostsViewType | null> {
        let post = await PostsModel
            .findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null
        }
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    }
    async findCommentsByPostId(postId: string, paggination: DefaultCommentsPaginationType, userId?: string): Promise<CommentsViewType> {
        // const paggination = getCommentsPagination(query)
        const commets = await CommentsModel
            .find({postId: postId})
            .sort({[paggination.sortBy]: paggination.sortDirection})
            .limit(paggination.pageSize)
            .skip(paggination.skip).lean()
        const comments = await Promise.all(commets.map(async el => {
                let myStatus = LikesStatus.None

                if (userId) {
                    const reaction = await LikesCommentsModel
                        .findOne({userId, commentId: el._id.toString()}).exec()
                    myStatus = reaction ? reaction.myStatus : LikesStatus.None
                }
                return {
                    id: el._id.toString(),
                    content: el.content,
                    commentatorInfo: {
                        userId: el.userId,
                        userLogin: el.userLogin
                    },
                    createdAt: el.createdAt,
                    likesInfo: {
                        likesCount: await LikesCommentsModel.countDocuments({
                            commentId: el._id.toString(),
                            myStatus: LikesStatus.Like
                        }),
                        dislikesCount: await LikesCommentsModel.countDocuments({
                            commentId: el._id.toString(),
                            myStatus: LikesStatus.Dislike
                        }),
                        myStatus: myStatus
                    }
                }
            }
        ))
        const totalCount = await CommentsModel
            .countDocuments({postId: postId})
        const pageCount = Math.ceil(totalCount / paggination.pageSize)
        return {
            pagesCount: pageCount,
            page: paggination.pageNumber,
            pageSize: paggination.pageSize,
            totalCount: totalCount,
            items: comments
        }
    }
    async doesPostExist(postId: string): Promise<boolean> {
        let post = await PostsModel
            .findOne({_id: new ObjectId(postId)})
       return !!post
    }
}