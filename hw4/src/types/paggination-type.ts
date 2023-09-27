export enum SortByEnum {
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

export interface IDefaultPagination<S> {
    sortBy: S/* SortByEnum*/
    sortDirection: Description
    pageNumber: number
    pageSize: number
    skip: number
}

export interface IQuery<S> {
    sortBy: S/* SortByEnum*/
    sortDirection: Description
    pageNumber: number
    pageSize: number
    searchNameTerm: string
}

export interface IBlockPagination extends IDefaultPagination<SortByEnum> {
    searchNameTerm: string
}

export interface IPostPagination extends IDefaultPagination<SortPostsByEnum>{

}


