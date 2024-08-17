import { useQuery } from 'react-query'
import { RolePaginationRequest } from '../../services/roles/types'
import { ROLES_QUERY_KEY, getOneRole, getRolesList } from '../../services/roles'
import { PaginationRequest } from '../../services/generic'

export const useGetRolesList = (
    paginationRequest: PaginationRequest & RolePaginationRequest
) => {
    return useQuery({
        queryKey: [ROLES_QUERY_KEY, paginationRequest],
        queryFn: async () => await getRolesList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneAdmin = (id: string) => {
    return useQuery({
        queryKey: [ROLES_QUERY_KEY, 'one'],
        queryFn: async () => await getOneRole({ id }),
    })
}
