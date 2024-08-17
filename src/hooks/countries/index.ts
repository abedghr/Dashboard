import { useMutation, useQuery } from 'react-query'
import { PaginationRequest } from '../../services/generic'
import {
    COUNTRY_QUERY_KEY,
    createCountry,
    getCountriesList,
    getOneCountry,
    updateCountry,
} from '../../services/countries'

export const useGetCountriesList = (paginationRequest: PaginationRequest) => {
    return useQuery({
        queryKey: [COUNTRY_QUERY_KEY, paginationRequest],
        queryFn: async () => await getCountriesList(paginationRequest),
        keepPreviousData: true,
    })
}

export const useGetOneCountry= (id: string) => {
    return useQuery({
        queryKey: [COUNTRY_QUERY_KEY, 'one'],
        queryFn: async () => await getOneCountry({ id }),
    })
}

export const useCreateCountry = () => {
    return useMutation({
        mutationFn: createCountry,
        mutationKey: [COUNTRY_QUERY_KEY, 'create'],
    })
}

export const useUpdateCountry = () => {
    return useMutation({
        mutationFn: updateCountry,
        mutationKey: [COUNTRY_QUERY_KEY, 'update'],
    })
}
