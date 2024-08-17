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

export interface SideMenuState {
    menu: Array<Menu | 'divider'>
}

const initialState: SideMenuState = {
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
            icon: 'Settings',
            pathname: '/app/settings',
            title: 'Settings',
            subMenu: [
                {
                    icon: 'Wrench',
                    pathname: '/app/settings/general',
                    title: 'General Settings',
                },
                {
                    icon: 'Wrench',
                    pathname: '/app/settings/customer',
                    title: 'Customer Application Settings',
                },
                {
                    icon: 'Wrench',
                    pathname: '/app/settings/service-provider',
                    title: 'SP Application Settings',
                },
            ],
        },
    ],
}

export const sideMenuSlice = createSlice({
    name: 'sideMenu',
    initialState,
    reducers: {},
})

export const selectSideMenu = (state: RootState) => state.sideMenu.menu

export default sideMenuSlice.reducer
