import { PaginationRequest } from '../generic'

export type GetOneRoleBody = {
    id: string
}

export type Role = {
    _id: string
    name: string
    isActive: boolean
    type: string
    permissions: number
    createdAt: Date
    updatedAt: Date
}

export type RolePaginationRequest = {
    isActive: 'true,false'
    type: 'ADMIN'
}

export const paginationDefaultValueForAdmin: PaginationRequest &
    RolePaginationRequest = {
    search: '',
    perPage: 10,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
    isActive: 'true,false',
    type: 'ADMIN',
}
