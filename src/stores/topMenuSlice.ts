import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'
import { icons } from '../base-components/Lucide'

export interface Menu {
    icon: keyof typeof icons
    title: string
    pathname?: string
    subMenu?: Menu[]
    ignore?: boolean
}

export interface TopMenuState {
    menu: Array<Menu>
}

const initialState: TopMenuState = {
    menu: [
        {
            icon: 'Home',
            pathname: '/app',
            title: 'Home',
        },
        {
            icon: 'User',
            pathname: '/app/users',
            title: 'Users',
            subMenu: [
                {
                    icon: 'ShieldAlert',
                    pathname: '/app/users/admins',
                    title: 'Admins',
                },
                {
                    icon: 'User',
                    pathname: '/app/users/customers',
                    title: 'Customers',
                },
                {
                    icon: 'User',
                    pathname: '/app/users/service-providers',
                    title: 'Service Providers',
                },
            ],
        },
        {
            icon: 'Map',
            pathname: '/app/countries',
            title: 'Countries',
        },
        {
            icon: "Star",
            pathname: "app/services",
            title: "Services"
        }
    ],
}

export const topMenuSlice = createSlice({
    name: 'topMenu',
    initialState,
    reducers: {},
})

export const selectTopMenu = (state: RootState) => state.topMenu.menu

export default topMenuSlice.reducer
