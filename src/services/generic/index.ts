export type GenericServerResponse<T> = {
    statusCode: number
    message: string
    _metadata: {
        languages: string[]
        timestamp: Date
        timezone: string
        requestId: string
        path: string
        version: string
        repoVersion: string
        pagination: {
            search: string
            availableSearch: string[]
            page: number
            perPage: number
            orderBy: string
            orderDirection: 'asc' | 'desc'
            availableOrderBy: string[]
            availableOrderDirection: ['asc', 'desc']
            total: number
            totalPage: number
        }
    }
    data: T
}

export type PaginationRequest = {
    search: string
    perPage: number
    page: number
    orderBy: string
    orderDirection: 'asc' | 'desc'
}

export enum ENUM_USER_GENDER {
    MALE = 'male',
    FEMALE = 'female',
}
