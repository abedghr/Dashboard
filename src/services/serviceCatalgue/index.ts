import axios from '../../utils/axios'
import { GenericServerResponse } from '../generic'
import {
    CreateServiceCatalogueBody,
    ServiceCatalogue,
    UpdateServiceCatalogueBody,
} from './types'

export const SERVICE_CATALOGUE_MUTATION_KEY = 'service-catalogue'

export const getServiceCatalogues = async () => {
    const response = await axios.get<GenericServerResponse<ServiceCatalogue[]>>(
        `/v1/admin/service-catalogue/list`
    )
    return response.data
}

export const createServiceCatalogue = async ({
    targetAudience,
    title,
    titleAr,
    country,
}: CreateServiceCatalogueBody) => {
    const response = await axios.post(`/v1/admin/service-catalogue/create`, {
        targetAudience,
        title,
        titleAr,
        country,
    })
    return response.data
}

export const updateServiceCatalogue = async ({
    id,
    targetAudience,
    title,
    titleAr,
    isActive,
}: UpdateServiceCatalogueBody) => {
    const response = await axios.put(`/v1/admin/service-catalogue/update/${id}`, {
        targetAudience,
        title,
        titleAr,
        isActive,
    })
    return response.data
}
