import _ from 'lodash'
import Button from '../../base-components/Button'
import Pagination from '../../base-components/Pagination'
import Lucide from '../../base-components/Lucide'
import LoadingPage from '../../components/Loading'
import { Dialog } from '../../base-components/Headless'
import { useDeleteAdmin, useGetAdminsList } from '../../hooks/admins'
import { paginationDefaultValue } from '../../services/admins/types'
import { useEffect, useState } from 'react'
import CreateAdminForm from './CreateAdminForm'
import { PaginationRequest } from '../../services/generic'
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

    const [selectedAdmin, setSelectedAdmin] = useState<string>('')
    const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false)
    const [showDeleteAdminModal, setShowDeleteAdminModal] =
        useState<boolean>(false)

    const { data, isFetching, refetch } = useGetAdminsList(pagination)
    const deleteAdminMutation = useDeleteAdmin()

    useEffect(() => {
        if (!data) return
        const { page, perPage, total } = data._metadata.pagination
        const start = total === 0 ? 0 : (page - 1) * perPage + 1
        const end = Math.min(start + perPage - 1, total)
        console.log('start', start, page, perPage)
        setPaginationOptions({
            start,
            end,
            total,
        })
    }, [data])

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

    const showAddAdminModalHandler = () => {
        setShowAddAdminModal(true)
    }

    const closeAddAdminModalHandler = () => {
        setShowAddAdminModal(false)
        refetch()
    }

    const setSelectedAdminHandler = (id: string) => {
        setSelectedAdmin(id)
        setShowDeleteAdminModal(true)
    }

    const deleteAdminHandler = () => {
        deleteAdminMutation.mutate(
            { id: selectedAdmin },
            {
                onSuccess: () => {
                    setPagination(paginationDefaultValue)
                    setSelectedAdmin('')
                    setShowDeleteAdminModal(false)
                    refetch()
                },
            }
        )
    }

    return isFetching ? (
        <LoadingPage />
    ) : (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Admins</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button
                        onClick={showAddAdminModalHandler}
                        variant="primary"
                        className="mr-2 shadow-md"
                    >
                        Add New Admin
                    </Button>
                    <div className="hidden mx-auto md:block text-slate-500">
                        Showing {paginationOptions.start} to{' '}
                        {paginationOptions.end} of {paginationOptions.total}{' '}
                        entries
                    </div>
                </div>
                {/* BEGIN: Users Layout */}
                {data?.data.map((admin, key) => (
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
                                        initials={`${admin.firstName &&
                                            admin.firstName[0].toUpperCase()
                                            }${admin.lastName &&
                                            admin.lastName[0].toUpperCase()
                                            }`}
                                    />
                                </div>
                                <div className="mt-3 text-center lg:ml-2 lg:mr-auto lg:text-left lg:mt-0">
                                    <div className="text-slate-800 text-sm font-bold mt-0.5 dark:text-slate-200">
                                        {admin.username}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Full Name : {admin.firstName}{' '}
                                        {admin.lastName}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Mobile : {admin.mobileNumber}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Email : {admin.email}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Gender : {admin.gender}
                                    </div>
                                    <div className="text-slate-500 text-xs mt-0.5 dark:text-slate-300">
                                        Country : {admin.country ?? 'N/A'}
                                    </div>
                                </div>
                                <div className="flex mt-4 lg:mt-0">
                                    <Button
                                        as="a"
                                        href={`mailto:${admin.email}`}
                                        variant="primary"
                                        className="px-2 py-1 mr-2"
                                    >
                                        Email
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setSelectedAdminHandler(admin._id)
                                        }}
                                        variant="danger"
                                        className="px-2 py-1"
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {/* BEGIN: Users Layout */}
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    {data!._metadata.pagination.total! > data!._metadata.pagination.perPage && <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <Pagination.Link onClick={decreasePageNumber}>
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Pagination.Link>
                        {_.range(
                            1,
                            data!._metadata.pagination.totalPage + 1
                        ).map((num) => (
                            <Pagination.Link
                                key={num}
                                active={pagination.page === num}
                                onClick={() => setPaginationByPageNumber(num)}
                            >
                                {num}
                            </Pagination.Link>
                        ))}
                        <Pagination.Link onClick={increasePageNumber}>
                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </Pagination.Link>
                    </Pagination>}
                </div>
            </div>
            {/* END: Pagination */}
            {/* BEGIN: Add Modal */}
            <Dialog
                size="md"
                open={showAddAdminModal}
                onClose={() => {
                    setShowAddAdminModal(false)
                }}
            >
                <Dialog.Panel>
                    <Dialog.Title>
                        <h2 className="mr-auto text-base font-medium">
                            Add New Admin
                        </h2>
                    </Dialog.Title>
                    <CreateAdminForm onClose={closeAddAdminModalHandler} />
                </Dialog.Panel>
            </Dialog>
            {/* END: Add Modal */}
            {/* BEGIN: Delete Admin Modal */}
            <Dialog
                size="sm"
                open={showDeleteAdminModal}
                onClose={() => {
                    setShowDeleteAdminModal(false)
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Do you really want to delete this record?
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                                setShowDeleteAdminModal(false)
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => deleteAdminHandler()}
                            type="button"
                            variant="danger"
                            className="w-24"
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Admin Modal */}
        </>
    )
}

export default Main
