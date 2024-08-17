import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface UserState {
    username: string
    role: string
    accessToken: string
    refreshToken: string
    firstName: string
    lastName: string
    isAuthenticated: boolean
}

const initialState: UserState = {
    username: '',
    role: '',
    accessToken: '',
    refreshToken: '',
    firstName: '',
    lastName: '',
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) => {
            const {
                accessToken,
                refreshToken,
                username,
                role,
                firstName,
                lastName,
            } = action.payload
            state.accessToken = accessToken
            state.refreshToken = refreshToken
            state.username = username
            state.role = role
            state.isAuthenticated = true
            state.firstName = firstName
            state.lastName = lastName
        },
        logout: (state) => {
            state.username = ''
            state.role = ''
            state.accessToken = ''
            state.refreshToken = ''
            state.isAuthenticated = false
        },
    },
})

export const { login, logout } = authSlice.actions

export const selectIsAuthenticated = (state: RootState) =>
    state.auth.isAuthenticated

export const selectUserInfo = (state: RootState) => {
    return {
        username: state.auth.username,
        role: state.auth.role,
        firstName: state.auth.firstName,
        lastName: state.auth.lastName,
    }
}

export const selectTokens = (state: RootState) => {
    return {
        accessToken: state.auth.accessToken,
        refreshToken: state.auth.refreshToken,
    }
}

export default authSlice.reducer
