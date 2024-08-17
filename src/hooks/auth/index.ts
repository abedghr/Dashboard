import { useMutation } from 'react-query'
import { AUTH_MUTATION_KEY, loginUser } from '../../services/auth'
import { login, logout } from '../../stores/authSlice'
import { useAppDispatch } from '../../stores/hooks'

export const useLoginUser = () => {
    const dispatch = useAppDispatch()

    return useMutation({
        mutationFn: loginUser,
        mutationKey: AUTH_MUTATION_KEY,
        onSuccess: (data) => {
            const {
                username,
                role,
                accessToken,
                refreshToken,
                firstName,
                lastName,
            } = data.data
            dispatch(
                login({
                    username,
                    role,
                    accessToken,
                    refreshToken,
                    firstName,
                    lastName,
                    isAuthenticated: true,
                })
            )
        },
    })
}

export const useLogoutUser = () => {
    const dispatch = useAppDispatch()
    return () => {
        dispatch(logout())
    }
}
