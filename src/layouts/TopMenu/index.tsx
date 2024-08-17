import { useState, useEffect, useCallback } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { selectTopMenu } from '../../stores/topMenuSlice'
import { useAppSelector } from '../../stores/hooks'
import { FormattedMenu, linkTo, nestedMenu } from './top-menu'
import Lucide from '../../base-components/Lucide'
import Breadcrumb from '../../base-components/Breadcrumb'
import { Menu } from '../../base-components/Headless'
import logoUrl from '../../assets/images/logo.svg'
import clsx from 'clsx'
import MobileMenu from '../../components/MobileMenu'
import DarkModeSwitcher from '../../components/DarkModeSwitcher'
import MainColorSwitcher from '../../components/MainColorSwitcher'
import { AvatarComponent } from 'avatar-initials'
import { useLogoutUser } from '../../hooks/auth'
import { selectIsAuthenticated, selectUserInfo } from '../../stores/authSlice'

function Main() {
    const location = useLocation()
    const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu>>([])
    const topMenuStore = useAppSelector(selectTopMenu)
    const topMenu = useCallback(
        () => nestedMenu(topMenuStore, location),
        [location, topMenuStore]
    )
    const navigate = useNavigate()

    const logout = useLogoutUser()
    const { username, role, firstName, lastName } =
        useAppSelector(selectUserInfo)

    const logoutUser = () => {
        logout()
    }

    const navigateToAccount = () => {
        navigate('/app/account')
    }

    const isUserAuth = useAppSelector(selectIsAuthenticated)

    useEffect(() => {
        setFormattedMenu(topMenu())
    }, [topMenuStore, location.pathname, topMenu])

    useEffect(() => {
        if (!isUserAuth) {
            navigate('/', { replace: true })
        }
    }, [isUserAuth, navigate])

    return (
        <div className="py-2">
            <DarkModeSwitcher />
            <MainColorSwitcher />
            <MobileMenu />
            {/* BEGIN: Top Bar */}
            <div className="border-b border-white/[0.08] mt-[2.2rem] md:-mt-5 -mx-3 sm:-mx-8 px-3 sm:px-8 pt-3 md:pt-0 mb-10">
                <div className="flex items-center h-[70px] z-[51] relative">
                    {/* BEGIN: Logo */}
                    <Link
                        to="/app"
                        className="hidden -intro-x md:flex"
                    >
                        <img
                            alt="Midone Tailwind HTML Admin Template"
                            className="w-6"
                            src={logoUrl}
                        />
                        <span className="ml-3 text-lg text-white">
                            {' '}
                            Rubick{' '}
                        </span>
                    </Link>
                    {/* END: Logo */}
                    {/* BEGIN: Breadcrumb */}
                    <Breadcrumb
                        light
                        className="h-full md:ml-10 md:pl-10 md:border-l border-white/[0.08] mr-auto -intro-x"
                    >
                        <Breadcrumb.Link to="/app">Application</Breadcrumb.Link>
                    </Breadcrumb>
                    {/* END: Breadcrumb */}
                    {/* BEGIN: Account Menu */}
                    <Menu>
                        <Menu.Button className="block w-8 h-8 overflow-hidden scale-110 rounded-full shadow-lg image-fit zoom-in intro-x">
                            <AvatarComponent
                                classes="rounded-full"
                                useGravatar={false}
                                color="#000000"
                                background="#f1f1f1"
                                fontSize={32}
                                fontWeight={400}
                                initials={`${
                                    firstName && firstName[0].toUpperCase()
                                }${lastName && lastName[0].toUpperCase()}`}
                            />
                        </Menu.Button>
                        <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
                            <Menu.Header className="font-normal">
                                <div className="font-medium">{username}</div>
                                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                                    {role}
                                </div>
                            </Menu.Header>
                            <Menu.Divider className="bg-white/[0.08]" />
                            <Menu.Item
                                onClick={navigateToAccount}
                                className="hover:bg-white/5"
                            >
                                <Lucide icon="User" className="w-4 h-4 mr-2" />{' '}
                                Account
                            </Menu.Item>
                            <Menu.Item className="hover:bg-white/5">
                                <Lucide icon="Lock" className="w-4 h-4 mr-2" />{' '}
                                Reset Password
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
                    {/* END: Account Menu */}
                </div>
            </div>
            {/* END: Top Bar */}
            {/* BEGIN: Top Menu */}
            <nav className="relative z-50 hidden md:block">
                <ul className="pb-3 xl:pb-0 xl:px-[50px] flex flex-wrap">
                    {formattedMenu.map((menu, menuKey) => (
                        <li
                            className={clsx([
                                'relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90',
                                !menu.active &&
                                    '[&:hover>a>div:nth-child(1)]:before:bg-white/5 [&:hover>a>div:nth-child(1)]:before:dark:bg-darkmode-500/70',
                            ])}
                            key={menuKey}
                        >
                            <MenuLink
                                className={clsx({
                                    [`opacity-0 translate-y-[50px] animate-[0.4s_ease-in-out_0.3s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                        (menuKey + 1) * 10
                                    }`]: !menu.active,
                                })}
                                menu={menu}
                                level="first"
                            ></MenuLink>
                            {/* BEGIN: Second Child */}
                            {menu.subMenu && (
                                <ul className="xl:left-[100%] xl:-ml-[4px] shadow-[0px_3px_20px_#0000000b] bg-primary hidden w-56 absolute rounded-md z-20 px-0 top-0 mt-14 xl:-mt-5 before:block before:absolute before:w-full before:h-full before:bg-black/10 before:inset-0 before:rounded-md before:z-[-1] dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]">
                                    {menu.subMenu.map((subMenu, subMenuKey) => (
                                        <li
                                            className="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                                            key={subMenuKey}
                                        >
                                            <MenuLink
                                                menu={subMenu}
                                                level="second"
                                            ></MenuLink>
                                            {/* BEGIN: Third Child */}
                                            {subMenu.subMenu && (
                                                <ul
                                                    className={clsx([
                                                        'left-[100%] ml-0 shadow-[0px_3px_20px_#0000000b] bg-primary hidden w-56 absolute rounded-md z-20 px-0 top-0 mt-0 before:block before:absolute before:w-full before:h-full before:bg-black/10 before:inset-0 before:rounded-md before:z-[-1] dark:bg-darkmode-600 dark:shadow-[0px_3px_7px_#0000001c]',
                                                    ])}
                                                >
                                                    {subMenu.subMenu.map(
                                                        (
                                                            lastSubMenu,
                                                            lastSubMenuKey
                                                        ) => (
                                                            <li
                                                                className="px-5 relative [&:hover>ul]:block [&:hover>a>div:nth-child(2)>svg]:-rotate-90"
                                                                key={
                                                                    lastSubMenuKey
                                                                }
                                                            >
                                                                <MenuLink
                                                                    menu={
                                                                        lastSubMenu
                                                                    }
                                                                    level="third"
                                                                ></MenuLink>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            )}
                                            {/* END: Third Child */}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {/* END: Second Child */}
                        </li>
                    ))}
                </ul>
            </nav>
            {/* END: Top Menu */}
            {/* BEGIN: Content */}
            <div className="rounded-[30px] min-w-0 min-h-screen flex-1 pb-10 bg-slate-100 dark:bg-darkmode-700 px-4 md:px-[22px] max-w-full md:max-w-auto before:content-[''] before:w-full before:h-px before:block">
                <Outlet />
            </div>
            {/* END: Content */}
        </div>
    )
}

function MenuLink(props: {
    className?: string
    menu: FormattedMenu
    level: 'first' | 'second' | 'third'
}) {
    const navigate = useNavigate()
    return (
        <a
            href={props.menu.subMenu ? '#' : props.menu.pathname}
            className={clsx([
                'h-[55px] rounded-full xl:rounded-b-none xl:rounded-t-[1rem] flex items-center text-white relative',
                props.level === 'first' && 'px-5 mr-1',
                props.level !== 'first' && 'px-0 mr-0',
                props.level === 'first' &&
                    props.menu.active &&
                    'z-10 bg-slate-100 dark:bg-darkmode-700',
                props.level === 'first' &&
                    props.menu.active &&
                    "before:content-[''] before:w-[20px] before:h-[20px] before:-ml-[20px] before:rotate-90 before:scale-[1.04] before:bg-[length:100%] before:bg-menu-corner before:absolute before:bottom-0 before:left-0 before:hidden before:xl:block dark:before:bg-menu-corner-dark",
                props.level === 'first' &&
                    props.menu.active &&
                    "after:content-[''] after:w-[20px] after:h-[20px] after:-mr-[20px] after:rotate-180 after:scale-[1.04] after:bg-[length:100%] after:bg-menu-corner after:absolute after:bottom-0 after:right-0 after:hidden after:xl:block dark:after:bg-menu-corner-dark",
                props.className,
            ])}
            onClick={(event) => {
                event.preventDefault()
                linkTo(props.menu, navigate)
            }}
        >
            <div
                className={clsx([
                    'dark:text-slate-400',
                    props.level === 'first' &&
                        props.menu.active &&
                        'text-primary dark:text-white',
                    !props.menu.active &&
                        "before:content-[''] before:z-[-1] before:absolute before:w-full before:h-full before:top-0 before:left-0 before:rounded-full xl:before:rounded-b-none xl:before:rounded-t-lg before:transition before:ease-in before:duration-100",
                ])}
            >
                <Lucide icon={props.menu.icon} />
            </div>
            <div
                className={clsx([
                    'ml-3 flex items-center whitespace-nowrap dark:text-slate-400',
                    props.level === 'first' &&
                        props.menu.active &&
                        'text-black font-medium dark:text-white',
                    props.level !== 'first' && 'w-full',
                ])}
            >
                {props.menu.title}
                {props.menu.subMenu && (
                    <Lucide
                        icon="ChevronDown"
                        className={clsx([
                            'hidden w-4 h-4 transition duration-100 ease-in xl:block',
                            props.level === 'first' && 'ml-2',
                            props.level !== 'first' && 'ml-auto',
                        ])}
                    />
                )}
            </div>
        </a>
    )
}

export default Main
