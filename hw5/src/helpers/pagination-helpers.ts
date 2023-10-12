import {
    Description,
    IBlockPagination,
    IDefaultPagination, InputDescription, IPostPagination, IQuery,
    SortBlogsByEnum,
    SortPostsByEnum
} from "../types/paggination-type";

export const getBlogsPagination = (query: IQuery<SortBlogsByEnum>): IBlockPagination => {
    const values = getDefaultValuesBlogs()

    const defaultValues: IBlockPagination = {
        ...getDefaultPagination<SortBlogsByEnum>(query, values),
        searchNameTerm: ''
    }
    if (query.searchNameTerm) {
        defaultValues.searchNameTerm = query.searchNameTerm
    }

    return defaultValues
}
const getDefaultValuesBlogs = (): IDefaultPagination<SortBlogsByEnum> => {
    return {
        sortBy: SortBlogsByEnum.createdAt,
        sortDirection: Description.desc,
        pageNumber: 1,
        pageSize: 10,
        skip: 0
    }
}
export const getPostsPagination = (query: IQuery<SortPostsByEnum>): IPostPagination => {
    const values = getDefaultValuesPosts()
    return getDefaultPagination<SortPostsByEnum>(query, values);
}
const getDefaultValuesPosts = (): IDefaultPagination<SortPostsByEnum> => {
    return {
        sortBy: SortPostsByEnum.createdAt,
        sortDirection: Description.desc,
        pageNumber: 1,
        pageSize: 10,
        skip: 0
    }
}

export const getDefaultPagination = <T>(query: IQuery<T>, defaultValues: IDefaultPagination<T>): IDefaultPagination<T> => {
    if (query.sortBy) {
        defaultValues.sortBy = query.sortBy
    }
    if (query.sortDirection && query.sortDirection === InputDescription.asc) {
        defaultValues.sortDirection = Description.asc
    }
    if (query.pageNumber && !isNaN(parseInt(query.pageNumber.toString(), 10))
        && parseInt(query.pageNumber.toString(), 10) > 0) {
        defaultValues.pageNumber = parseInt(query.pageNumber.toString(), 10)
    }
    if (query.pageSize && !isNaN(parseInt(query.pageSize.toString(), 10))
        && parseInt(query.pageSize.toString(), 10) > 0) {
        defaultValues.pageSize = parseInt(query.pageSize.toString(), 10)
    }
    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize
    return defaultValues
}