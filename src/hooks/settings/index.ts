import { useMutation, useQuery } from 'react-query'
import {
    SETTINGS_MUTATION_KEY,
    createSetting,
    getOneSetting,
    getSettingsList,
    updateSetting,
} from '../../services/settings'
import { PaginationRequest } from '../../services/generic'

export const useGetSettingsList = (paginationRequest: PaginationRequest) => {
    return useQuery({
        queryKey: [SETTINGS_MUTATION_KEY, paginationRequest],
        queryFn: async () => await getSettingsList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneSetting = (id: string) => {
    return useQuery({
        queryKey: [SETTINGS_MUTATION_KEY, 'one'],
        queryFn: async () => await getOneSetting({ id }),
        keepPreviousData: false,
    })
}

export const useUpdateSetting = () => {
    return useMutation({
        mutationFn: updateSetting,
        mutationKey: [SETTINGS_MUTATION_KEY, 'update'],
    })
}

export const useCreateSetting = () => {
    return useMutation({
        mutationFn: createSetting,
        mutationKey: [SETTINGS_MUTATION_KEY, 'create'],
    })
}
