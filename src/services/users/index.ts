import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import {
    User,
    GetOneUserBody,
    BlockUserBody,
    UnBlockUserBody,
    FreezeUserBody,
    UnFreezeUserBody,
} from './types'

export const USER_QUERY_KEY = 'users'

export const getOneUser = async ({ id }: GetOneUserBody) => {
    const response = await axios.get<GenericServerResponse<User>>(
        `/v1/admin/user/get/${id}`
    )
    return response.data
}

export const getUsersList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
}: PaginationRequest) => {
    const response = await axios.get<GenericServerResponse<User[]>>(
        `/v1/admin/user/list/users`,
        {
            params: {
                search,
                page,
                perPage,
                orderBy,
                orderDirection,
            },
        }
    )
    return response.data
}

export const blockUser = async ({ id, blockReason }: BlockUserBody) => {
    const response = await axios.patch(
        `/v1/admin/user/update/${id}/blocked?reason=${blockReason}`
    )
    return response.data
}

export const unBlockUser = async ({ id }: UnBlockUserBody) => {
    const response = await axios.patch(`/v1/admin/user/update/${id}/unblocked`)
    return response.data
}

export const freezeUser = async ({ id, freezeDateTo: inactiveDateTo }: FreezeUserBody) => {
    const response = await axios.patch(
        `/v1/admin/user/update/${id}/freeze?freezeDateTo=${inactiveDateTo}`
    )
    return response.data
}

export const unFreezeUser = async ({ id }: UnFreezeUserBody) => {
    const response = await axios.patch(`/v1/admin/user/update/${id}/active`)
    return response.data
}
