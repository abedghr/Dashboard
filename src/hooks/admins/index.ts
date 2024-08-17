import { useMutation, useQuery } from 'react-query'
import { PaginationRequest } from '../../services/generic'
import {
    ADMINS_QUERY_KEY,
    createAdmin,
    deleteAdmin,
    getAdminsList,
    getOneAdmin,
} from '../../services/admins'

export const useGetAdminsList = (paginationRequest: PaginationRequest) => {
    return useQuery({
        queryKey: [ADMINS_QUERY_KEY, paginationRequest],
        queryFn: async () => await getAdminsList(paginationRequest),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}

export const useGetOneAdmin = (id: string) => {
    return useQuery({
        queryKey: [ADMINS_QUERY_KEY, 'one'],
        queryFn: async () => await getOneAdmin({ id }),
    })
}

export const useCreateAdmin = () => {
    return useMutation({
        mutationFn: createAdmin,
        mutationKey: [ADMINS_QUERY_KEY, 'create'],
    })
}

export const useDeleteAdmin = () => {
    return useMutation({
        mutationFn: deleteAdmin,
        mutationKey: [ADMINS_QUERY_KEY, 'delete'],
    })
}
