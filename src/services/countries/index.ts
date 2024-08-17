import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import {
    getOneCountryBody,
    Country,
    CountryCreate,
    CountryUpdate,
} from './types'

export const COUNTRY_QUERY_KEY = 'country'

export const getOneCountry = async ({ id }: getOneCountryBody) => {
    const response = await axios.get<GenericServerResponse<Country>>(
        `/v1/admin/role/get/${id}`
    )
    return response.data
}

export const getCountriesList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
}: PaginationRequest) => {
    const response = await axios.get<GenericServerResponse<Country[]>>(
        `/v1/country/country/list`,
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

export const createCountry = async (data: CountryCreate) => {
    const response = await axios.post<GenericServerResponse<Country>>(
        `/v1/country/country/create`,
        data
    )
    return response.data
}

export const updateCountry = async ({ id, isActive }: CountryUpdate) => {
    const response = await axios.put<GenericServerResponse<Country>>(
        `/v1/country/country/update/${id}`,
        { isActive }
    )
    return response.data
}
