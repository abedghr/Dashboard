import axios from '../../utils/axios'
import { GenericServerResponse, PaginationRequest } from '../generic'
import {
    Admin,
    GetOneAdminBody,
    CreateAdminBody,
    DeleteOneAdminBody,
} from './types'

export const ADMINS_QUERY_KEY = 'admins'

export const getOneAdmin = async ({ id }: GetOneAdminBody) => {
    const response = await axios.get<GenericServerResponse<Admin>>(
        `/v1/admin/user/get/${id}`
    )
    return response.data
}

export const getAdminsList = async ({
    search,
    page,
    perPage,
    orderBy,
    orderDirection,
}: PaginationRequest) => {
    const response = await axios.get<GenericServerResponse<Admin[]>>(
        `/v1/admin/user/list/admins`,
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

export const createAdmin = async ({
    username,
    firstName,
    lastName,
    mobileNumber,
    role,
    password,
    country,
    gender,
    email,
}: CreateAdminBody) => {
    const roleName = 'admin';
    const response = await axios.post(`/v1/admin/user/create`, {
        username,
        firstName,
        lastName,
        mobileNumber,
        role,
        password,
        country,
        gender,
        email,
        roleName,
    })
    return response.data
}

export const deleteAdmin = async ({ id }: DeleteOneAdminBody) => {
    const response = await axios.delete(`/v1/admin/user/delete/${id}`)
    return response.data
}
