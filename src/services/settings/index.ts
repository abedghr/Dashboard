import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import {
    CreateSettingBody,
    GetOneSettingBody,
    Setting,
    UpdateSettingBody,
} from './types'

export const SETTINGS_MUTATION_KEY = 'settings'

export const getOneSetting = async ({ id }: GetOneSettingBody) => {
    const response = await axios.get<GenericServerResponse<Setting>>(
        `/v1/public/setting/get/${id}`
    )
    return response.data
}

export const getSettingsList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
}: PaginationRequest) => {
    const response = await axios.get<GenericServerResponse<Setting[]>>(
        `/v1/public/setting/list`,
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

export const createSetting = async ({
    name,
    description,
    type,
    value,
    country,
}: CreateSettingBody) => {
    const response = await axios.post(`/v1/admin/setting/create`, {
        name,
        description,
        type,
        value,
        country,
    })
    return response.data
}

export const updateSetting = async ({
    id,
    value,
    description,
    type,
}: UpdateSettingBody) => {
    const response = await axios.put(`/v1/admin/setting/update/${id}`, {
        value,
        description,
        type,
    })
    return response.data
}