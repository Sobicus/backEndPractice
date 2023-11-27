
export const getCommentsPagination = (query: queryCommentsType):DefaultCommentsPaginationType => {
    const defaultCommentsPagination:DefaultCommentsPaginationType = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: sortDescriptionEnum.desc,
        skip:0
    }
    if (query.pageNumber && !isNaN(Math.trunc(query.pageNumber)) && Math.trunc(query.pageNumber) > 0) {
        defaultCommentsPagination.pageNumber = Math.trunc(query.pageNumber)
    }
    // if (query.pageNumber && !isNaN(parseInt(query.pageNumber.toString(), 10))
    //     && parseInt(query.pageNumber.toString(), 10) > 0) {
    //     defaultCommentsPagination.pageNumber = parseInt(query.pageNumber.toString(), 10)
    // }
    if (query.pageSize && !isNaN(Math.trunc(query.pageSize)) && Math.trunc(query.pageSize) > 0) {
        defaultCommentsPagination.pageSize = Math.trunc(query.pageSize)
    }
    // if (query.pageSize && !isNaN(parseInt(query.pageSize.toString(), 10))
    //     && parseInt(query.pageSize.toString(), 10) > 0) {
    //     defaultCommentsPagination.pageSize = parseInt(query.pageSize.toString(), 10)
    // }
    if (query.sortBy) {
        defaultCommentsPagination.sortBy = query.sortBy
    }
    if (query.sortDirection && query.sortDirection === sortDirectionEnum.asc) {
        defaultCommentsPagination.sortDirection = sortDescriptionEnum.asc
    }
    defaultCommentsPagination.skip=(defaultCommentsPagination.pageNumber-1)*defaultCommentsPagination.pageSize
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
    sortDirection: sortDirectionEnum
}
export type DefaultCommentsPaginationType={
    pageNumber: number
    pageSize: number
    sortBy: string
    sortDirection: sortDescriptionEnum
    skip:number
}