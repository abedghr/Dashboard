import { toast } from 'react-toastify'
import { ErrorsEnums } from './errorEnums'
import { SuccessEnums } from './successEnums'
import { store } from '../../stores/store'
import { logout } from '../../stores/authSlice'
import { ValidationObject } from './types'

// The differance between status and statusCode
// is that statusCode is the custom error code from the backend

type Snack = {
    status: number | string
    statusCode: number
    message: string
    errors: ValidationObject[]
}

export default async function snack({
    status,
    statusCode,
    message,
    errors,
}: Snack): Promise<void> {
    switch (statusCode) {
        case ErrorsEnums.ACCESS_EXPIRED: {
            const { dispatch } = store
            toast.error('Your Access Has Expired')
            dispatch(logout())
            break
        }
        case ErrorsEnums.VALIDATION_ERROR: {
            toast.error(`${message} : ${errors[0].message}`)
            break
        }
        case ErrorsEnums.REFRESH_EXPIRED: {
            // "Permission denied"
            break
        }
        default: {
            toast.error(message)
            break
        }
    }
    switch (status) {
        case ErrorsEnums.NETWORK_ERROR: {
            toast.error('Network Error : Check your internet connection')
            return
        }
        case SuccessEnums.SUCCESS: {
            toast.success(message)
            return
        }
        case SuccessEnums.CREATED: {
            toast.success(message)
            return
        }
    }
}
