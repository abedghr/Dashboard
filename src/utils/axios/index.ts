import Axios, { AxiosInstance } from 'axios'
import { onErrorResponse, onRequest, onResponse } from './interceptors'

const BASE_URL: string | undefined = import.meta.env.VITE_API_URL

const axios = Axios.create({
    baseURL: BASE_URL,
})

const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
    instance.interceptors.request.use(onRequest, onErrorResponse)
    instance.interceptors.response.use(onResponse, onErrorResponse)

    return instance
}

setupInterceptors(axios)

export default axios
