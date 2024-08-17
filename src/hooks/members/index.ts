import { useMutation, useQuery } from 'react-query'
import { PaginationRequest } from '../../services/generic'
import {
    MEMBER_QUERY_KEY,
    getOneMember,
    blockMember,
    freezeMember,
    getProvidersList,
    unBlockMember,
    unFreezeMember,
} from '../../services/members'

export const useGetProvidersList = (paginationRequest: PaginationRequest) => {
    return useQuery({
        queryKey: [MEMBER_QUERY_KEY, paginationRequest],
        queryFn: async () => await getProvidersList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneMember = (id: string) => {
    return useQuery({
        queryKey: [MEMBER_QUERY_KEY, 'one'],
        queryFn: async () => await getOneMember({ id }),
    })
}

export const useBlockMember = () => {
    return useMutation({
        mutationFn: blockMember,
        mutationKey: [MEMBER_QUERY_KEY, 'block'],
    })
}

export const useUnBlockMember = () => {
    return useMutation({
        mutationFn: unBlockMember,
        mutationKey: [MEMBER_QUERY_KEY, 'unblock'],
    })
}

export const useFreezeMember = () => {
    return useMutation({
        mutationFn: freezeMember,
        mutationKey: [MEMBER_QUERY_KEY, 'freeze'],
    })
}

export const useUnFreezeMember = () => {
    return useMutation({
        mutationFn: unFreezeMember,
        mutationKey: [MEMBER_QUERY_KEY, 'unfreeze'],
    })
}
