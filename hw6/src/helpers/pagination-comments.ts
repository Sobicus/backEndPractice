import {getDefaultPagination} from "./pagination-helpers";

export const getCommentsPagination = (query: queryCommentsType) => {
    const defaultCommentsPagination = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: sortDescriptionEnum.desc
    }
    if (query.pageNumber && isNaN(Math.trunc(query.pageNumber)) && Math.trunc(query.pageNumber) > 0) {
        defaultCommentsPagination.pageNumber = query.pageNumber
    }

    return defaultCommentsPagination
}

enum sortDescriptionEnum {
    asc = 1,
    desc = -1
}

enum sortDirectionEnum {
    asc = 'asc',
    desc = 'desc'
}


export type queryCommentsType = {
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: sortDescriptionEnum
}