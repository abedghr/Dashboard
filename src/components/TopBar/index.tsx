import Lucide from '../../base-components/Lucide'
import Breadcrumb from '../../base-components/Breadcrumb'
import { Menu } from '../../base-components/Headless'
import fakerData from '../../utils/faker'
import { useLogoutUser } from '../../hooks/auth'
import { useAppSelector } from '../../stores/hooks'
import { useNavigate } from 'react-router-dom'
import { selectUserInfo } from '../../stores/authSlice'

function Main() {
    const logout = useLogoutUser()
    const navigate = useNavigate()
    const { username, role } = useAppSelector(selectUserInfo)

    const logoutUser = () => {
        logout()
    }
    debugger
    const navigateToProfile = () => {
        navigate('/app/profile')
    }
    return (
        <>
            {/* BEGIN: Top Bar */}
            <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
                {/* BEGIN: Breadcrumb */}
                <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
                    <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
                    <Breadcrumb.Link to="/" active={true}>
                        Dashboard
                    </Breadcrumb.Link>
                </Breadcrumb>
                {/* END: Breadcrumb */}
                {/* BEGIN: Account Menu */}
                <Menu>
                    <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
                        <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={fakerData[9].photos[0]}
                        />
                    </Menu.Button>
                    <Menu.Items className="w-56 mt-px text-white bg-primary">
                        <Menu.Header className="font-normal">
                            <div className="font-medium">{username}</div>
                            <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                                {role}
                            </div>
                        </Menu.Header>
                        <Menu.Divider className="bg-white/[0.08]" />
                        <Menu.Item
                            onClick={navigateToProfile}
                            className="hover:bg-white/5"
                        >
                            <Lucide icon="User" className="w-4 h-4 mr-2" />{' '}
                            Profile
                        </Menu.Item>
                        <Menu.Item className="hover:bg-white/5">
                            <Lucide icon="Edit" className="w-4 h-4 mr-2" /> Add
                            Account
                        </Menu.Item>
                        <Menu.Item className="hover:bg-white/5">
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{' '}
                            Reset Password
                        </Menu.Item>
                        <Menu.Item className="hover:bg-white/5">
                            <Lucide
                                icon="HelpCircle"
                                className="w-4 h-4 mr-2"
                            />{' '}
                            Help
                        </Menu.Item>
                        <Menu.Divider className="bg-white/[0.08]" />
                        <Menu.Item
                            onClick={logoutUser}
                            className="hover:bg-white/5"
                        >
                            <Lucide
                                icon="ToggleRight"
                                className="w-4 h-4 mr-2"
                            />{' '}
                            Logout
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            {/* END: Top Bar */}
        </>
    )
}

export default Main
