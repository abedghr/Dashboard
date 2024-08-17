import { store } from '../../stores/store'

import axios, {
    AxiosError,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios'
import snack from './snacks'
import { GenericServerResponse } from '../../services/generic'
import { ServerErrorGenericResponse } from './types'

export const onRequest = (
    config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    const accessToken = store.getState().auth.accessToken
    const mutConfig = { ...config }
    mutConfig.headers.Authorization = `Bearer ${accessToken}`
    return mutConfig
}

export const onResponse = (
    response: AxiosResponse<GenericServerResponse<any>>
): AxiosResponse => {
    const { method, url } = response.config
    const { status } = response
    // Set Loading End Here
    // Handle Response Data Here
    // Error Handling When Return Success with Error Code Here
    console.log(`🚀 [API] ${method?.toUpperCase()} ${url} | Response ${status}`)
    // snack({ status, statusCode: 0, message });

    return response
}

export const onErrorResponse = (
    error: AxiosError | Error
): Promise<AxiosError> => {
    if (axios.isAxiosError(error)) {
        const { code } = error
        const { method, url } = error.config as AxiosRequestConfig
        const { status } = (error.response as AxiosResponse) ?? {}
        const { statusCode, message, errors } =
            (error.response?.data as ServerErrorGenericResponse) ?? {}

        console.log(
            `🚨 [API] ${method?.toUpperCase()} ${url} | Error ${status} ${message}`
        )

        if (code === 'ERR_NETWORK') {
            snack({ status: code, statusCode, message, errors })
        } else {
            snack({ status, statusCode, message, errors })
        }
    } else {
        console.log(`🚨 [API] | Error ${error.message}`)
    }

    return Promise.reject(error)
}
