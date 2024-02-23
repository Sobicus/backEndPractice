import {PaginationType} from "../types/paggination-type";
import {IQueryUsersPagination} from "../helpers/pagination-users-helpers";
import {UsersModel} from "./db";
import { UsersViewType } from "../types/user-types";

export class UsersQueryRepository {
    async findAllUsers(pagination: IQueryUsersPagination): Promise<PaginationType<UsersViewType>> {
        const filter = {
            $or: [{login: {$regex: pagination.searchLoginTerm ?? '', $options: 'i'}},
                {email: {$regex: pagination.searchEmailTerm ?? '', $options: 'i'}}]
        }

        const users = await UsersModel
            .find(filter)
            .sort({[pagination.sortBy]: pagination.sortDirection})
            .limit(pagination.pageSize)
            .skip(pagination.skip)
            .lean()
        const allUsers = users.map(u => ({
            id: u._id.toString(),
            login: u.login,
            email: u.email,
            createdAt: u.createdAt
        }))
        const totalCount = await UsersModel
            .countDocuments(filter)
        const pageCount = Math.ceil(totalCount / pagination.pageSize)
        return {
            pagesCount: pageCount,
            page: pagination.pageNumber,
            pageSize: pagination.pageSize,
            totalCount: totalCount,
            items: allUsers
        }
    }
}
export const usersQueryRepository = new UsersQueryRepository()