
import { PaginationRequest } from '../generic'
import { ENUM_TARGET_AUDIENCE } from './enums'

export type GetOneSettingBody = {
    id: string
}

export type CreateServiceCatalogueBody = {
    country: any
    targetAudience: ENUM_TARGET_AUDIENCE
    title: string
    titleAr?: string
}

export type UpdateServiceCatalogueBody = {
    id: string
    targetAudience: ENUM_TARGET_AUDIENCE
    title: string
    titleAr?: string
    isActive?: boolean
}

export type ServiceCatalogue = {
    _id: string
    country: string
    targetAudience: ENUM_TARGET_AUDIENCE
    title: string
    titleAr: string
    isActive: boolean
    createdAt: Date
}

export const paginationDefaultValue: PaginationRequest = {
    search: '',
    perPage: 10,
    page: 1,
    orderBy: 'createdAt',
    orderDirection: 'asc',
}

export const settingsGeneralPaginationDefaultValue: PaginationRequest = {
    ...paginationDefaultValue,
    search: 'country:null',
}
export const settingsCountryPaginationDefaultValue: PaginationRequest = {
    ...paginationDefaultValue,
    search: `country:`,
}