import { ENUM_USER_GENDER, PaginationRequest } from '../generic'

export type GetOneMemberBody = {
    id: string
}

export type BlockMemberBody = {
    id: string
    blockReason: string
}

export type UnBlockMemberBody = {
    id: string
}

export type FreezeMemberBody = {
    id: string
    freezeDateTo: string
}

export type UnFreezeMemberBody = {
    id: string
}

export type Member = {
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
