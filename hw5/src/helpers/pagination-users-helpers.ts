import {InputDescription} from "../types/paggination-type";

export const paginationUsersHelpers = (query: IQueryUsersPagination) => {

}

interface IQueryUsersPagination {
    sortBy: string
    sortDirection: InputDescription
    pageNumber: number
    pageSize: number
    searchLoginTerm: string
    searchEmailTerm: string
}