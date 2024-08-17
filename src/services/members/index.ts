import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import {
    Member,
    GetOneMemberBody,
    BlockMemberBody,
    FreezeMemberBody,
    UnFreezeMemberBody,
    UnBlockMemberBody,
} from './types'

export const MEMBER_QUERY_KEY = 'members'

export const getOneMember = async ({ id }: GetOneMemberBody) => {
    const response = await axios.get<GenericServerResponse<Member>>(
        `/v1/admin/user/get/${id}`
    )
    return response.data
}

export const getProvidersList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
}: PaginationRequest) => {
    const response = await axios.get<GenericServerResponse<Member[]>>(
        `/v1/admin/user/list/providers`,
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

export const blockMember = async ({ id, blockReason }: BlockMemberBody) => {
    const response = await axios.patch(
        `/v1/admin/user/update/${id}/blocked?reason=${blockReason}`
    )
    return response.data
}

export const unBlockMember = async ({ id }: UnBlockMemberBody) => {
    const response = await axios.patch(`/v1/admin/user/update/${id}/unblocked`)
    return response.data
}

export const freezeMember = async ({
    id,
    freezeDateTo,
}: FreezeMemberBody) => {
    const response = await axios.patch(
        `/v1/admin/user/update/${id}/freeze?freezeDateTo=${freezeDateTo}`
    )
    return response.data
}

export const unFreezeMember = async ({ id }: UnFreezeMemberBody) => {
    const response = await axios.patch(`/v1/admin/user/update/${id}/active`)
    return response.data
}
