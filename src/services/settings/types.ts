import { PaginationRequest } from '../generic'
import { ENUM_SETTING_DATA_TYPE } from './enums'

export type GetOneSettingBody = {
    id: string
}

export type CreateSettingBody = {
    description: string
    type: ENUM_SETTING_DATA_TYPE
    value: string
    country: string | null
    name: string
}

export type UpdateSettingBody = {
    id: string
    value: any
    description: string
    type: ENUM_SETTING_DATA_TYPE
}

export type Country = {
    _id: string
    code: string
    name: string
    vat: number
    isVatEnabled: boolean
    paymentMethods: string[]
    texts: string[]
    createdAt: Date
    updatedAt: Date
}

export type Setting = {
    country: Country | null | string
    createdAt: Date
    description: string
    name: string
    type: ENUM_SETTING_DATA_TYPE
    updatedAt: Date
    value: any
    _id: string
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

export type BookingType = {
    name: string
    allowedPaymentMethod: string[]
    chargeIfAfterAllowedTime: boolean
    chargeIfAmendAfterAllowedTime: boolean
    priceIncrease: boolean
}

export type ServiceCatalogue = {
    title: string
    isActive: boolean
    children: ServiceCatalogue[]
}

export type SurveyQuestion = {
    short: string
    long: string
    isActive: boolean
}

export type PredefinedPosts = {
    post: string
    isActive: boolean
}

export type Rating = {
    star: number
    min: number
    max: number
}

export type TPredefinedPosts = {
    type: 'predefinedPosts'
    predefinedPosts: PredefinedPosts[]
}

export type TSurveyQuestion = {
    type: 'surveyQuestions'
    surveyQuestions: SurveyQuestion[]
}

export type TBookingType = {
    type: 'bookingTypes'
    bookingTypes: BookingType[]
}

export type TServiceCatalogue = {
    type: 'serviceCatalogues'
    serviceCatalogues: ServiceCatalogue[]
}

export type TRatings = {
    type: 'ratings'
    ratings: Rating[]
}
