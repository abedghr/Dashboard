import { useMutation, useQuery } from 'react-query'
import { PaginationRequest } from '../../services/generic'
import {
    USER_QUERY_KEY,
    getOneUser,
    getUsersList,
    blockUser,
    freezeUser,
    unBlockUser,
    unFreezeUser,
} from '../../services/users'

export const useGetUsersList = (paginationRequest: PaginationRequest) => {
    return useQuery({
        queryKey: [USER_QUERY_KEY, paginationRequest],
        queryFn: async () => await getUsersList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneUser = (id: string) => {
    return useQuery({
        queryKey: [USER_QUERY_KEY, 'one'],
        queryFn: async () => await getOneUser({ id }),
    })
}

export const useBlockUser = () => {
    return useMutation({
        mutationFn: blockUser,
        mutationKey: [USER_QUERY_KEY, 'block'],
    })
}

export const useUnBlockUser = () => {
    return useMutation({
        mutationFn: unBlockUser,
        mutationKey: [USER_QUERY_KEY, 'unblock'],
    })
}

export const useFreezeUser = () => {
    return useMutation({
        mutationFn: freezeUser,
        mutationKey: [USER_QUERY_KEY, 'freeze'],
    })
}

export const useUnFreezeUser = () => {
    return useMutation({
        mutationFn: unFreezeUser,
        mutationKey: [USER_QUERY_KEY, 'unfreeze'],
    })
}
