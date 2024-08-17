import { PaginationRequest } from '../generic'

export type getOneCountryBody = {
    id: string
}

export type Country = {
    _id: string
    code: string
    name: string
    paymentMethods: string[]
    createdAt: Date
    updatedAt: Date
    isActive: boolean
}

export type CountryCreate = {
    code: string
    name: string
    countryCode: string
}

export type CountryUpdate = {
    id: string
    isActive: boolean
}

export const paginationDefaultValue: PaginationRequest = {
    search: '',
    perPage: 270,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
}
