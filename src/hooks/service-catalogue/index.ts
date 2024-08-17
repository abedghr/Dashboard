import { useMutation, useQuery } from 'react-query'
import {
    SERVICE_CATALOGUE_MUTATION_KEY,
    createServiceCatalogue,
    getServiceCatalogues,
    updateServiceCatalogue,
} from '../../services/serviceCatalgue'

export const useGetServiceCatalogueList = () => {
    return useQuery({
        queryKey: [SERVICE_CATALOGUE_MUTATION_KEY, 'list'],
        queryFn: async () => await getServiceCatalogues(),
        keepPreviousData: true,
    })
}

export const useUpdateServiceCatalogue = () => {
    return useMutation({
        mutationFn: updateServiceCatalogue,
        mutationKey: [SERVICE_CATALOGUE_MUTATION_KEY, 'update'],
    })
}

export const useCreateServiceCatalogue = () => {
    return useMutation({
        mutationFn: createServiceCatalogue,
        mutationKey: [SERVICE_CATALOGUE_MUTATION_KEY, 'create'],
    })
}
