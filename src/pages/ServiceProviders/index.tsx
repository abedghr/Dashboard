import _ from 'lodash'
import Button from '../../base-components/Button'
import Pagination from '../../base-components/Pagination'
import Lucide from '../../base-components/Lucide'
import LoadingPage from '../../components/Loading'
import { Dialog } from '../../base-components/Headless'
import { paginationDefaultValue } from '../../services/admins/types'
import { useEffect, useState, useRef } from 'react'
import { PaginationRequest } from '../../services/generic'
import {
    useBlockMember,
    useFreezeMember,
    useUnBlockMember,
    useUnFreezeMember,
} from '../../hooks/members'
import { FormInput, FormLabel, FormTextarea } from '../../base-components/Form'
import { useForm, Controller } from 'react-hook-form'
import Litepicker from '../../base-components/Litepicker'
import { useGetProvidersList } from '../../hooks/members'
import { AvatarComponent } from 'avatar-initials'

function Main() {
    const [pagination, setPagination] = useState<PaginationRequest>(
        paginationDefaultValue
    )
    const [paginationOptions, setPaginationOptions] = useState({
        start: 0,
        end: 0,
        total: 0,
    })

    const [selectedMember, setSelectedMember] = useState<string>('')
    const [showBlockUserModal, setShowBlockUserModal] = useState<boolean>(false)
    const [showUnBlockUserModal, setShowUnBlockUserModal] =
        useState<boolean>(false)
    const [showFreezeUserModal, setShowFreezeUserModal] =
        useState<boolean>(false)
    const [showUnFreezeUserModal, setShowUnFreezeUserModal] =
        useState<boolean>(false)

    const { data, isFetching, refetch } = useGetProvidersList(pagination)

    const blockUserMutation = useBlockMember()
    const unBlockMutation = useUnBlockMember()
    const freezeMutation = useFreezeMember()
    const unFreezeMutation = useUnFreezeMember()

    const { register: registerSearch, handleSubmit: handleSubmitSearch } =
        useForm<{ search: string }>({})
    const { register: registerBlock, handleSubmit: handleSubmitBlock } =
        useForm<{ blockReason: string }>({})
    const {
        handleSubmit: handleSubmitFreeze,
        control,
        formState: { errors },
    } = useForm<{
        freezeDateTo: string
    }>({})

    useEffect(() => {
        if (!showBlockUserModal && !showUnBlockUserModal) {
            setSelectedMember('')
        }
    }, [showBlockUserModal, showUnBlockUserModal])

    useEffect(() => {
        if (!data) return
        const { page, perPage, total } = data._metadata.pagination
        const start = total === 0 ? 0 : (page - 1) * perPage + 1
        const end = Math.min(start + perPage - 1, total)
        setPaginationOptions({
            start,
            end,
            total,
        })
    }, [data])

    const onSubmitSearch = ({ search }: { search: string }) => {
        setPagination((prev) => ({
            ...prev,
            search: `username:${search},mobileNumber:${search},_id:${search}`,
            page: 1,
        }))
    }

    const increasePageNumber = () => {
        if (pagination.page === data?._metadata.pagination.totalPage) return
        setPagination((prev) => ({
            ...prev,
            page: prev.page + 1,
        }))
    }

    const decreasePageNumber = () => {
        if (pagination.page === 1) return
        setPagination((prev) => ({
            ...prev,
            page: prev.page - 1,
        }))
    }

    const setPaginationByPageNumber = (pageNumber: number) => {
        setPagination((prev) => ({
            ...prev,
            page: pageNumber,
        }))
    }

    const handleUnBlockUser = () => {
        unBlockMutation.mutate(
            { id: selectedMember },
            {
                onSuccess: () => {
                    setShowUnBlockUserModal(false)
                    refetch()
                },
            }
        )
    }

    const handleBlockUser = ({ blockReason }: { blockReason: string }) => {
        blockUserMutation.mutate(
            { id: selectedMember, blockReason },
            {
                onSuccess: () => {
                    setShowBlockUserModal(false)
                    refetch()
                },
            }
        )
    }

    const handleFreezeUser = ({
        freezeDateTo,
    }: {
        freezeDateTo: string
    }) => {
        freezeMutation.mutate(
            { id: selectedMember, freezeDateTo },
            {
                onSuccess: () => {
                    setShowFreezeUserModal(false)
                    refetch()
                },
            }
        )
    }

    const handleUnFreezeUser = () => {
        unFreezeMutation.mutate(
            { id: selectedMember },
            {
                onSuccess: () => {
                    setShowUnFreezeUserModal(false)
                    refetch()
                },
            }
        )
    }

    const getPeriodFromTodayInDays = (date: Date) => {
        const today = new Date()
        const dateTo = new Date(date)
        const diffInTime = dateTo?.getTime() - today.getTime()
        const diffInDays = diffInTime / (1000 * 3600 * 24)
        return Math.ceil(diffInDays)
    }

    const formRef = useRef<HTMLFormElement>(null)

    return isFetching ? (
        <LoadingPage />
    ) : (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">
                Service Providers
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <div className="hidden mx-auto md:block text-slate-500">
                        Showing {paginationOptions.start} to{' '}
                        {paginationOptions.end} of {paginationOptions.total}{' '}
                        entries
                    </div>
                    <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="relative w-72 text-slate-500">
                            <form
                                ref={formRef}
                                onSubmit={handleSubmitSearch(onSubmitSearch)}
                            >
                                <FormInput
                                    type="text"
                                    className="w-full pr-10 !box"
                                    placeholder="Id , Username , Mobile Number"
                                    {...registerSearch('search')}
                                    onKeyUp={(e) => {
                                        e.preventDefault()
                                        if (e.key === 'Enter') {
                                            formRef.current?.dispatchEvent(
                                                new Event('submit', {
                                                    cancelable: true,
                                                    bubbles: true,
                                                })
                                            )
                                        }
                                    }}
                                />
                                <Lucide
                                    icon="Search"
                                    className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                                />
                            </form>
                        </div>
                    </div>
                </div>
                {/* BEGIN: Users Layout */}
                {data?.data.map((user, key) => (
                    <div
                        key={key}
                        className="col-span-12 intro-y md:col-span-6"
                    >
                        <div className="box">
                            <div className="flex flex-col items-center p-5 lg:flex-row">
                                <div className="w-24 h-24 lg:w-12 lg:h-12 image-fit lg:mr-1">
                                    <AvatarComponent
                                        classes="rounded-full"
                                        useGravatar={false}
                                        color="#000000"
                                        background="#f1f1f1"
                                        fontSize={32}
                                        fontWeight={400}
                                        initials={user.fullName}
                                    />
                                </div>
                                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                                    <div className="text-slate-800 text-sm font-bold mt-0.5 dark:text-slate-200">
                                        {user.username}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Full Name : {user.fullName}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Mobile : {user.mobileNumber}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Email : {user.email}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Gender : {user.gender}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Country : {user.country}
                                    </div>
                                    {user.accountStatus !== "active" && user.freezeDateTo && (
                                        <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                            Freezing Days Remaining :{' '}
                                            {getPeriodFromTodayInDays(
                                                user.freezeDateTo
                                            )}{' '}
                                            Days
                                        </div>
                                    )}
                                </div>
                                <div className="flex mt-4 lg:mt-0 gap-2">
                                    <Button
                                        as="a"
                                        href={`mailto:${user.email}`}
                                        variant="primary"
                                    >
                                        Email
                                    </Button>
                                    {user.accountStatus === "active" && !user.inactiveDateTo ? (
                                        <Button
                                            onClick={() => {
                                                setShowFreezeUserModal(true)
                                                setSelectedMember(user._id)
                                            }}
                                            variant="warning"
                                        >
                                            Freeze
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setShowUnFreezeUserModal(true)
                                                setSelectedMember(user._id)
                                            }}
                                            variant="secondary"
                                        >
                                            Unfreeze
                                        </Button>
                                    )}
                                    {user.accountStatus === "blocked" ? (
                                        <Button
                                            onClick={() => {
                                                setShowUnBlockUserModal(true)
                                                setSelectedMember(user._id)
                                            }}
                                            variant="success"
                                        >
                                            Unblock
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                setShowBlockUserModal(true)
                                                setSelectedMember(user._id)
                                            }}
                                            variant="danger"
                                        >
                                            Block
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* BEGIN: Users Layout */}
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    {data!._metadata.pagination.total! >
                        data!._metadata.pagination.perPage && (
                            <Pagination className="w-full sm:w-auto sm:mr-auto">
                                <Pagination.Link onClick={decreasePageNumber}>
                                    <Lucide
                                        icon="ChevronLeft"
                                        className="w-4 h-4"
                                    />
                                </Pagination.Link>
                                {_.range(
                                    1,
                                    data!._metadata.pagination.totalPage + 1
                                ).map((num) => (
                                    <Pagination.Link
                                        key={num}
                                        active={pagination.page === num}
                                        onClick={() =>
                                            setPaginationByPageNumber(num)
                                        }
                                    >
                                        {num}
                                    </Pagination.Link>
                                ))}
                                <Pagination.Link onClick={increasePageNumber}>
                                    <Lucide
                                        icon="ChevronRight"
                                        className="w-4 h-4"
                                    />
                                </Pagination.Link>
                            </Pagination>
                        )}
                </div>
            </div>
            {/* END: Pagination */}
            {/* BEGIN: Block Modal */}
            <Dialog
                size="md"
                open={showBlockUserModal}
                onClose={() => {
                    setShowBlockUserModal(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Block User
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
                        <form
                            onSubmit={handleSubmitBlock(handleBlockUser)}
                            className="grid grid-cols-12 gap-4 gap-y-2"
                        >
                            <div className="col-span-12">
                                <FormLabel>Block Reason</FormLabel>
                                <FormTextarea
                                    {...registerBlock('blockReason')}
                                />
                            </div>
                            <div className="col-span-12 flex justify-center gap-5 mt-10">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-20 col-span-12"
                                >
                                    Confirm
                                </Button>
                                <Button
                                    onClick={() => setShowBlockUserModal(false)}
                                    variant="primary"
                                    type="button"
                                    className="w-20 col-span-12"
                                >
                                    Close
                                </Button>
                            </div>
                        </form>
                    </Dialog.Description>
                </Dialog.Panel>
            </Dialog>
            {/* END: Block Modal */}
            {/* BEGIN: Unblock Modal */}
            <Dialog
                size="md"
                open={showUnBlockUserModal}
                onClose={() => {
                    setShowUnBlockUserModal(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Are You Sure You Want To Unblock This User?
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
                        <div className="col-span-12 flex justify-center gap-5 mt-10">
                            <Button
                                onClick={() => handleUnBlockUser()}
                                variant="primary"
                                type="submit"
                                className="w-20 col-span-12"
                            >
                                Confirm
                            </Button>
                            <Button
                                onClick={() => setShowUnBlockUserModal(false)}
                                variant="primary"
                                type="button"
                                className="w-20 col-span-12"
                            >
                                Close
                            </Button>
                        </div>
                    </Dialog.Description>
                </Dialog.Panel>
            </Dialog>
            {/* END: Unblock Modal */}
            {/* BEGIN: Freeze Modal */}
            <Dialog
                size="md"
                open={showFreezeUserModal}
                onClose={() => {
                    setShowFreezeUserModal(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Freeze User
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
                        <form
                            onSubmit={handleSubmitFreeze(handleFreezeUser)}
                            className="grid grid-cols-12 gap-4 gap-y-2"
                        >
                            <div className="col-span-12">
                                <FormLabel>Choose Unfreeze Day</FormLabel>
                                <Controller
                                    name="freezeDateTo"
                                    control={control}
                                    rules={{
                                        required: true,
                                        validate: (value) => {
                                            const patteren = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
                                            return patteren.test(value)
                                        }
                                    }}
                                    defaultValue={new Date().toISOString()}
                                    render={({
                                        field: { value, onChange },
                                    }) => (
                                        <Litepicker
                                            value={value}
                                            onChange={onChange}
                                            options={{
                                                lockDaysFilter(
                                                    date1,
                                                    date2,
                                                    totalPicked
                                                ) {
                                                    return (
                                                        date1?.getTime()! <
                                                        new Date().getTime()
                                                    )
                                                },
                                                autoApply: false,
                                                showWeekNumbers: true,
                                                format: 'YYYY-MM-DD',
                                                dropdowns: {
                                                    minYear:
                                                        new Date().getFullYear(),
                                                    maxYear:
                                                        new Date().getFullYear() +
                                                        10,
                                                    months: true,
                                                    years: true,
                                                },
                                            }}
                                            className="w-full"
                                        />
                                    )}
                                />
                                {errors.freezeDateTo?.type === 'required' && (
                                    <div className="mt-2 text-danger">
                                        "Date is reuqired"
                                    </div>
                                )}
                                {errors.freezeDateTo?.type === "validate" && (
                                    <div className="mt-2 text-danger">
                                        "Enter a valid date"
                                    </div>
                                )}
                            </div>
                            <div className="col-span-12 flex justify-center gap-5 mt-10">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-20 col-span-12"
                                >
                                    Confirm
                                </Button>
                                <Button
                                    onClick={() =>
                                        setShowFreezeUserModal(false)
                                    }
                                    variant="primary"
                                    type="button"
                                    className="w-20 col-span-12"
                                >
                                    Close
                                </Button>
                            </div>
                        </form>
                    </Dialog.Description>
                </Dialog.Panel>
            </Dialog>
            {/* END: Freeze Modal */}
            {/* BEGIN: Unfreeze Modal */}
            <Dialog
                size="md"
                open={showUnFreezeUserModal}
                onClose={() => {
                    setShowUnFreezeUserModal(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Are You Sure You Want To Unfreeze This Service
                            Provider?
                        </h2>
                    </Dialog.Title>
                    <Dialog.Description className="grid grid-cols-full gap-4 gap-y-3">
                        <div className="col-span-12 flex justify-center gap-5 mt-10">
                            <Button
                                onClick={() => handleUnFreezeUser()}
                                variant="primary"
                                type="submit"
                                className="w-20 col-span-12"
                            >
                                Confirm
                            </Button>
                            <Button
                                onClick={() => setShowUnFreezeUserModal(false)}
                                variant="primary"
                                type="button"
                                className="w-20 col-span-12"
                            >
                                Close
                            </Button>
                        </div>
                    </Dialog.Description>
                </Dialog.Panel>
            </Dialog>
            {/* END: Unfreeze Modal */}
        </>
    )
}

export default Main
