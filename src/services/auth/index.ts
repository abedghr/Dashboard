import axios from '../../utils/axios'
import { GenericServerResponse } from '../generic'
import { LoginResponse } from './types'

export const AUTH_MUTATION_KEY = 'auth'

type LoginUserBody = {
    username: string
    password: string
}

export const loginUser = async ({ username, password }: LoginUserBody) => {
    const roleTypes = "SUPER_ADMIN,ADMIN"
    const response = await axios.post<GenericServerResponse<LoginResponse>>(
        '/v1/auth/user/login',
        {
            mobileNumber: username,
            password,
            roleTypes,
        }
    )
    return response.data
}

// TODO: Implement this
export const refreshToken = async (refreshToken: string) => {
    const response = await axios.post<GenericServerResponse<LoginResponse>>(
        '/v1/public/user/refresh-token',
        {
            refreshToken,
        }
    )
    return response.data
}
