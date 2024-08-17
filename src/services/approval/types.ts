import { PaginationRequest } from '../generic'
import { Member } from '../members/types'
import { GROUP_STATUS, GROUP_TARGET_AUDIENCE, Group_Types } from './enums'

export type Group = {
    _id: string
    owner: Member
    name: string
    type: Group_Types
    status: GROUP_STATUS
    location: number[]
    targetAudience: string[]
    regestrationNumber: string
    logo?: string
}

export type GetOneGroupBody = {
    _id: string
    owner: string
    name: string
    type: string
    status: string
    location: object
    targetAudience: GROUP_TARGET_AUDIENCE[]
    regestrationNumber?: string
    logo?: string
}

export type ApproveGroupBody = {
    _id: string
}

export type RejectGroupBody = {
    _id: string
    rejectedReason: string
}

export type PaginationRequestGroup = PaginationRequest & {
    status: GROUP_STATUS
}

export const paginationDefaultValue: PaginationRequestGroup = {
    search: '',
    perPage: 10,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
    status: GROUP_STATUS.PENDING,
}

export const approvalPaginationDefaultValue: PaginationRequestGroup = {
    ...paginationDefaultValue,
}
