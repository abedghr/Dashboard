import Lucide from '../../base-components/Lucide'
import { Tab } from '../../base-components/Headless'
import { useAppSelector } from '../../stores/hooks'
import { selectUserInfo } from '../../stores/authSlice'
import { AvatarComponent } from 'avatar-initials'

function Main() {
    const { role, firstName, lastName } =
        useAppSelector(selectUserInfo)
    return (
        <>
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">Profile Layout</h2>
            </div>
            <Tab.Group>
                {/* BEGIN: Profile Info */}
                <div className="px-5 pt-5 mt-5 intro-y box">
                    <div className="flex flex-col pb-5 -mx-5 border-b lg:flex-row border-slate-200/60 dark:border-darkmode-400">
                        <div className="flex items-center justify-center flex-1 px-5 lg:justify-start">
                            <div className="relative flex-none w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 image-fit">
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
                            </div>
                            <div className="ml-5">
                                <div className="w-24 text-lg font-medium truncate sm:w-40 sm:whitespace-normal">
                                    {firstName} {lastName}
                                </div>
                                <div className="text-slate-500">{role}</div>
                            </div>
                        </div>
                    </div>
                    <Tab.List
                        variant="link-tabs"
                        className="flex-col justify-center text-center sm:flex-row lg:justify-start"
                    >
                        <Tab fullWidth={false}>
                            <Tab.Button className="flex items-center py-4 cursor-pointer">
                                <Lucide icon="User" className="w-4 h-4 mr-2" />{' '}
                                Profile
                            </Tab.Button>
                        </Tab>
                        <Tab fullWidth={false}>
                            <Tab.Button className="flex items-center py-4 cursor-pointer">
                                <Lucide
                                    icon="Shield"
                                    className="w-4 h-4 mr-2"
                                />{' '}
                                Account
                            </Tab.Button>
                        </Tab>
                        <Tab fullWidth={false}>
                            <Tab.Button className="flex items-center py-4 cursor-pointer">
                                <Lucide icon="Lock" className="w-4 h-4 mr-2" />{' '}
                                Change Password
                            </Tab.Button>
                        </Tab>
                        <Tab fullWidth={false}>
                            <Tab.Button className="flex items-center py-4 cursor-pointer">
                                <Lucide
                                    icon="Settings"
                                    className="w-4 h-4 mr-2"
                                />{' '}
                                Settings
                            </Tab.Button>
                        </Tab>
                    </Tab.List>
                </div>
                {/* END: Profile Info */}
                <Tab.Panels className="mt-5">
                    <Tab.Panel>
                        <div className="grid grid-cols-12 gap-6"></div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </>
    )
}

export default Main
