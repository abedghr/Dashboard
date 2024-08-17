import { useRoutes } from 'react-router-dom'
import TopMenu from '../layouts/TopMenu'
import AdminsPage from '../pages/Admins'
import CustomersPage from '../pages/Customers'
import ServiceProvidersPage from '../pages/ServiceProviders'
import CountriesPage from '../pages/Countries'
import Login from '../pages/Login'
import Account from '../pages/Account'
import ErrorsPage from '../pages/Errors'
import HomePage from '../pages/Home'
import GeneralSettingsPage from '../pages/Settings/GeneralSettings'
import CountriesSettingsPage from '../pages/Settings/CountriesSettings'
import ApprovalPage from '../pages/Approval'

function Router() {
    const routes = [
        {
            path: '/app',
            element: <TopMenu />,
            children: [
                {
                    path: '/app',
                    element: <HomePage />,
                },
                {
                    path: '/app/account',
                    element: <Account />,
                },
                {
                    path: '/app/approval',
                    element: <ApprovalPage />,
                },
                {
                    path: '/app/users/admins',
                    element: <AdminsPage />,
                },
                {
                    path: '/app/users/customers',
                    element: <CustomersPage />,
                },
                {
                    path: '/app/users/service-providers',
                    element: <ServiceProvidersPage />,
                },
                {
                    path: '/app/countries',
                    element: <CountriesPage />,
                },
                {
                    path: '/app/settings/general',
                    element: <GeneralSettingsPage />,
                },
                {
                    path: '/app/settings/countries',
                    element: <CountriesSettingsPage />,
                },
            ],
        },
        {
            path: '/',
            element: <Login />,
        },
        {
            path: '/error-page',
            element: <ErrorsPage />,
        },
        {
            path: '*',
            element: <ErrorsPage />,
        },
    ]

    return useRoutes(routes)
}

export default Router
