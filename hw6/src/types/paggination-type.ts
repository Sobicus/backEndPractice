export enum SortBlogsByEnum {
    id = 'id',
    name = 'name',
    description = 'description',
    websiteUrl = 'websiteUrl',
    createdAt = 'createdAt',
    isMembership = 'isMembership'
}
export enum SortPostsByEnum{
    id= 'id',
    title= 'title',
    shortDescription= 'shortDescription',
    content= 'content',
    blogId= 'blogId',
    blogName= 'blogName',
    createdAt= 'createdAt'
}
export enum Description {
    asc = 1,
    desc = -1
}

export enum InputDescription{
    asc= 'asc',
    desc = 'desc'
}

export interface IDefaultPagination<S> {
    sortBy: S /*SortByEnum*/
    sortDirection: Description
    pageNumber: number
    pageSize: number
    skip: number
}

export interface IQuery<S> {
    sortBy: S /*SortByEnum*/
    sortDirection: InputDescription
    pageNumber: number
    pageSize: number
    searchNameTerm: string
}

export interface IBlockPagination extends IDefaultPagination<SortBlogsByEnum> {
    searchNameTerm: string// +sortBy, +pageSize,...
}

export interface IPostPagination extends IDefaultPagination<SortPostsByEnum>{

}

export type PaginationType<I> = {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: I[]
}
