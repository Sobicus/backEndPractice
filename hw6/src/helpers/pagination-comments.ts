export type queryCommentsType = {
    pageNumber:number
    pageSize: number
    sortBy: string
    sortDirection: sortDescriptionEnum
}

enum sortDirectionEnum {
    asc = 'asc',
    desc = 'desc'
}
 enum sortDescriptionEnum {
    asc = 1,
    desc = -1
}

