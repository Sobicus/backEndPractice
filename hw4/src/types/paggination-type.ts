export interface IDefaultPagination {
    sortBy: string
    sortDirection: 'asc' | 'desc'
    pageNumber: number
    pageSize: number
    skip: number
}
export interface IBlockPagination extends IDefaultPagination{
    searchNameTerm:string
}


