import axios from '../../utils/axios'
import { GenericServerResponse } from '../generic'
import {
    ApproveGroupBody,
    GetOneGroupBody,
    Group,
    PaginationRequestGroup,
    RejectGroupBody,
} from './types'

export const APPROVALS_MUTATION_KEY = 'approvals'

export const getOneApproval = async ({ _id }: GetOneGroupBody) => {
    const response = await axios.get<GenericServerResponse<Group>>(
        `/v1/public/setting/get/${_id}`
    )
    return response.data
}

export const getGroupsList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
    status,
}: PaginationRequestGroup) => {
    const response = await axios.get<GenericServerResponse<Group[]>>(
        `/v1/group/admin-group/list`,
        {
            params: {
                search,
                page,
                perPage,
                orderBy,
                orderDirection,
                status,
            },
        }
    )
    return response.data
}

export const approveGroup = async ({ _id }: ApproveGroupBody) => {
    const response = await axios.patch(`/v1/group/admin-group/approve/${_id}`)
    return response.data
}

export const rejectGroup = async ({ _id, rejectedReason }: RejectGroupBody) => {
    const response = await axios.patch(`/v1/group/admin-group/reject/${_id}`, {
        rejectedReason,
    })
    return response.data
}
// /api/v1/group/admin-group/approve/{group}
