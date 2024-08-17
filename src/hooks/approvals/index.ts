import { useMutation, useQuery } from 'react-query'
import {
    getOneSetting,
    updateSetting,
} from '../../services/settings'
import { APPROVALS_MUTATION_KEY, approveGroup, getGroupsList, rejectGroup } from '../../services/approval'
import { PaginationRequestGroup } from '../../services/approval/types'

export const useGetGroupsList = (paginationRequest: PaginationRequestGroup) => {
    return useQuery({
        queryKey: [APPROVALS_MUTATION_KEY, paginationRequest],
        queryFn: async () => await getGroupsList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneGroup = (id: string) => {
    return useQuery({
        queryKey: [APPROVALS_MUTATION_KEY, 'one'],
        queryFn: async () => await getOneSetting({ id }),
        keepPreviousData: false,
    })
}

export const useApproveGroup = () => {
    return useMutation({
        mutationFn: approveGroup,
        mutationKey: [APPROVALS_MUTATION_KEY, 'approve'],
    })
}

export const useRejectGroup = () => {
    return useMutation({
        mutationFn: rejectGroup,
        mutationKey: [APPROVALS_MUTATION_KEY, 'reject'],
    })
}