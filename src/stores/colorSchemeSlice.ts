import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

const colorSchemes = [
    'default',
    'theme-1',
    'theme-2',
    'theme-3',
    'theme-4',
] as const

export type ColorSchemes = (typeof colorSchemes)[number]

interface ColorSchemeState {
    value: ColorSchemes
}

const initialState: ColorSchemeState = {
    value: 'default',
}

export const colorSchemeSlice = createSlice({
    name: 'colorScheme',
    initialState,
    reducers: {
        setColorScheme: (state, action: PayloadAction<ColorSchemes>) => {
            state.value = action.payload
        },
    },
})

export const { setColorScheme } = colorSchemeSlice.actions

export const selectColorScheme = (state: RootState) => {
    return state.colorScheme.value
}

export default colorSchemeSlice.reducer
