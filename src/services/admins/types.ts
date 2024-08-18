import { ENUM_USER_GENDER, PaginationRequest } from '../generic'

export type GetOneAdminBody = {
    id: string
}

export type DeleteOneAdminBody = {
    id: string
}

export type CreateAdminBody = {
    username: string
    email: string
    firstName: string
    lastName: string
    mobileNumber: string
    role?: string
    password: string
    country: string
    gender: ENUM_USER_GENDER
}

export type Admin = {
    _id: string
    username: string
    fullName: string
    mobileNumber: string
    email: string
    gender: ENUM_USER_GENDER
    verificationCode: null
    country: string
    createdAt: Date
    updatedAt: Date
    isActive: boolean
    inactivePermanent: boolean
    blocked: boolean
    blockedReason: string
    inactiveDateTo: Date
}

export const paginationDefaultValue: PaginationRequest = {
    search: '',
    perPage: 10,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
}
