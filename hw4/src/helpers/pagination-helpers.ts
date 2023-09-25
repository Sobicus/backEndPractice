import {IBlockPagination, IDefaultPagination} from "../types/paggination-type";

export const getBlogsPagination=(query:any):IBlockPagination=>{
    const defaultValues: IBlockPagination = {
        ...getDefaultPagination(query),
        searchNameTerm:''
    }
    if (query.searchNameTerm) {
        defaultValues.searchNameTerm = query.searchNameTerm
    }
    return defaultValues
}
export const getDefaultPagination = (query: any): IDefaultPagination => {
    const defaultValues: IDefaultPagination = {
        sortBy: 'createdAt',
        sortDirection: 'desc',
        pageNumber: 1,
        pageSize: 10,
        skip: 0
    }
    if (query.sortBy) {
        defaultValues.sortBy = query.sortBy
    }
    if (query.sortDirection && query.sortDirection.toLowerCase() === 'asc') {
        defaultValues.sortDirection = query.sortDirection
    }
    if (query.pageNumber && !isNaN(parseInt(query.pageNumber, 10)) && parseInt(query.pageNumber, 10) > 0) {
        defaultValues.pageNumber = parseInt(query.pageNumber, 10)
    }
    if (query.pageSize && !isNaN(parseInt(query.pageSize, 10)) && parseInt(query.pageSize, 10) > 0) {
        defaultValues.pageSize = parseInt(query.pageSize, 10)
    }
    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize
    return defaultValues
}