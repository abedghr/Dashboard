import { ENUM_USER_GENDER, PaginationRequest } from '../generic'

export type GetOneUserBody = {
    id: string
}

export type BlockUserBody = {
    id: string
    blockReason: string
}

export type UnBlockUserBody = {
    id: string
}

export type FreezeUserBody = {
    id: string
    freezeDateTo: string
}

export type UnFreezeUserBody = {
    id: string
}
export type User = {
    _id: string
    username: string
    fullName: string
    mobileNumber: string
    email: string
    gender: ENUM_USER_GENDER
    country: string
    createdAt: Date
    updatedAt: Date
    accountStatus: string
    accountPhase?: string | null
    inactiveDateTo: Date
    freezeDateTo: Date
}

export const paginationDefaultValue: PaginationRequest = {
    search: '',
    perPage: 10,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
}
