export type CommentsViewType = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentsRepositoryType[]
}
export type CommentsRepositoryType = {
    id: string
    content: string
    commentatorInfo: commentatorInfoType
    createdAt: string
}
type commentatorInfoType = {
    userId: string
    userLogin: string
}