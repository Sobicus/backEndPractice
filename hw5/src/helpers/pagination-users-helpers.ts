import {Description, InputDescription} from "../types/paggination-type";

export const getPaginationUsersHelpers = (query: IQueryUsers): IQueryUsersPagination => {

    const defaultValues: IQueryUsersPagination = {
        sortBy: 'createdAt',
        sortDirection: Description.desc,
        pageNumber: 1,
        pageSize: 10,
        searchLoginTerm: '',
        searchEmailTerm: '',
        skip: 0
    }

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
    if (query.pageSize && !isNaN(parseInt(query.pageSize.toString(), 10)) &&
        parseInt(query.pageSize.toString(), 10) > 0) {
        defaultValues.pageSize = parseInt(query.pageSize.toString(), 10)
    }
    if (query.searchLoginTerm) {
        defaultValues.searchLoginTerm = query.searchLoginTerm
    }
    if (query.searchEmailTerm) {
        defaultValues.searchEmailTerm = query.searchEmailTerm
    }
    defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize
    return defaultValues
}

export interface IQueryUsers {
    sortBy: string
    sortDirection: InputDescription
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
}

export interface IQueryUsersPagination {
    sortBy: string
    sortDirection: Description
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
    skip: number
}