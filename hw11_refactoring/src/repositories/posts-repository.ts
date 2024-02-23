import {postBodyRequest} from "../routes/posts-router";
import {ObjectId} from "mongodb";
import {CommentsViewType, CommentViewType, newCommentType} from "../types/comment-types";
import {DefaultCommentsPaginationType} from "../helpers/pagination-comments";
import {BlogsModel, CommentsModel, LikesCommentsModel, PostsModel} from "./db";
import {LikesStatus} from "./likes-commets-repository";
import {CreatePostType, PostsDbType} from "../types/post-types";
import {blogsDbType} from "../types/blog-types";

export class PostsRepository {
    /*async findAllPosts(postsPagination: IPostPagination): Promise<PaginationType<postsViewType>> {
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
*/
    async findPostById(postId: string): Promise<PostsDbType | null> {
        return await PostsModel.findOne({_id: new ObjectId(postId)})
    }

    async createPost(newPost: CreatePostType): Promise<{ blogName: string, postId: string } | null> {
        let blog: blogsDbType | null = await BlogsModel
            .findOne({_id: new ObjectId(newPost.blogId)})
        if (!blog) return null;
        let newPostByDb = await PostsModel
            .create({...newPost, blogName: blog.name, _id: new ObjectId()})
        const blogName = blog.name
        const postId = newPostByDb._id.toString()
        return {blogName, postId}
    }

    async updatePost(postId: string, updateModel: postBodyRequest): Promise<boolean> {
        const resultUpdateModel = await PostsModel
            .updateOne({_id: new ObjectId(postId)}, {$set: updateModel})
        return resultUpdateModel.matchedCount === 1
    }

    async deletePost(postId: string): Promise<boolean> {
        const resultDeletePost = await PostsModel
            .deleteOne({_id: new ObjectId(postId)})
        return resultDeletePost.deletedCount === 1
    }

    /*
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
    */
    async createCommetByPostId(comment: newCommentType): Promise<CommentViewType> {
        const newComment = await CommentsModel
            .create({...comment})//<CommentsRepositoryType> can not
        return {
            id: newComment._id.toString(),
            content: comment.content,
            commentatorInfo: {
                userLogin: comment.userLogin,
                userId: comment.userId
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LikesStatus.None
            }
        }
    }
}
