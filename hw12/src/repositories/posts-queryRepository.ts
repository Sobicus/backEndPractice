import {ObjectId} from "mongodb";
import {IPostPagination, PaginationType} from "../types/paggination-type";
import {CommentsViewType} from "../types/comment-types";
import {DefaultCommentsPaginationType} from "../helpers/pagination-comments";
import {CommentsModel, LikesCommentsModel, LikesPostsModel, PostsModel} from "./db";
import {PostsViewType} from "../types/post-types";
import {LikesStatus} from "../types/likes-comments-repository-types";
import {injectable} from "inversify";

@injectable()
export class PostsQueryRepository {

    async findAllPosts(postsPagination: IPostPagination, userId?: string): Promise<PaginationType<PostsViewType>> {
        const posts = await PostsModel
            .find({})
            .sort({[postsPagination.sortBy]: postsPagination.sortDirection})
            .limit(postsPagination.pageSize)
            .skip(postsPagination.skip)
            .lean()
        const totalCount = await PostsModel.countDocuments()
        const pagesCount = Math.ceil(totalCount / postsPagination.pageSize)


        const allPosts = await Promise.all(posts.map(async p => {
            let myStatus = LikesStatus.None
            if (userId) {
                const reaction = await LikesPostsModel.findOne({postId: p._id.toString(), userId}).exec()
                myStatus = reaction ? reaction.myStatus : LikesStatus.None
            }
            const newestLikes = await LikesPostsModel.find({
                postId: p._id.toString(),
                myStatus: LikesStatus.Like
            }).sort({'createAt': -1})
                .limit(3)
                .skip(0)
                .lean()
            const newestLikesViewModel = newestLikes.map(l => {
                return {
                    addedAt: l.createAt,
                    userId: l.userId,
                    login: l.login
                }
            })

            return {
                id: p._id.toString(),
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt,
                extendedLikesInfo: {
                    likesCount: await LikesPostsModel.countDocuments({
                        postId: p._id.toString(),
                        myStatus: LikesStatus.Like
                    }),
                    dislikesCount: await LikesPostsModel.countDocuments({
                        postId: p._id.toString(),
                        myStatus: LikesStatus.Dislike
                    }),
                    myStatus: myStatus,
                    newestLikes: newestLikesViewModel
                }
            }
        }))
        return {
            pagesCount: pagesCount,
            page: postsPagination.pageNumber,
            pageSize: postsPagination.pageSize,
            totalCount: totalCount,
            items: allPosts
        }
    }

    async findPostById(postId: string, userId?: string): Promise<PostsViewType | null> {
        let post = await PostsModel
            .findOne({_id: new ObjectId(postId)})
        if (!post) {
            return null
        }
        let myStatus = LikesStatus.None
        if (userId) {
            const reaction = await LikesPostsModel.findOne({postId, userId}).exec()
            myStatus = reaction ? reaction.myStatus : LikesStatus.None
        }
        const newestLikes = await LikesPostsModel.find({
            postId,
            myStatus: LikesStatus.Like
        }).sort({'createAt': -1})
            .limit(3)
            .skip(0)
            .lean()
        const newestLikesViewModel = newestLikes.map(l => {
            return {
                addedAt: l.createAt,
                userId: l.userId,
                login: l.login
            }
        })

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: await LikesPostsModel.countDocuments({postId, myStatus: LikesStatus.Like}),
                dislikesCount: await LikesPostsModel.countDocuments({postId, myStatus: LikesStatus.Dislike}),
                myStatus: myStatus,
                newestLikes: newestLikesViewModel
            }
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