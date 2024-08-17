import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import { GetOneRoleBody, Role, RolePaginationRequest } from './types'

export const ROLES_QUERY_KEY = 'roles'

export const getOneRole = async ({ id }: GetOneRoleBody) => {
    const response = await axios.get<GenericServerResponse<Role>>(
        `/v1/admin/role/get/${id}`
    )
    return response.data
}

export const getRolesList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
    isActive,
    type,
}: PaginationRequest & RolePaginationRequest) => {
    const response = await axios.get<GenericServerResponse<Role[]>>(
        `/v1/admin/role/list`,
        {
            params: {
                search,
                page,
                perPage,
                orderBy,
                orderDirection,
                isActive,
                type,
            },
        }
    )
    return response.data
}
