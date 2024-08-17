import { useEffect, useState } from 'react'
import _ from 'lodash'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import LoadingPage from '../../components/Loading'
import Table from '../../base-components/Table'
import Button from '../../base-components/Button'
import Lucide from '../../base-components/Lucide'
import Pagination from '../../base-components/Pagination'
import { Dialog } from '../../base-components/Headless'
import {
    Group,
    RejectGroupBody,
    approvalPaginationDefaultValue,
} from '../../services/approval/types'
import { useApproveGroup, useGetGroupsList, useRejectGroup } from '../../hooks/approvals'
import { useQueryClient } from 'react-query'
import { APPROVALS_MUTATION_KEY } from '../../services/approval'
import { FormLabel, FormTextarea } from '../../base-components/Form'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

const schema = yup
    .object<RejectGroupBody>({
        rejectedReason: yup.string().required('Enter the reject reason'),
    })
    .required()

function Main() {
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [groupIdForApprove, setGroupIdForApprove] = useState<string>('')
    const [groupIdForReject, setGroupIdForReject] = useState<string>('')
    const [pagination, setPagination] = useState(approvalPaginationDefaultValue)
    const [paginationOptions, setPaginationOptions] = useState({
        start: 0,
        end: 0,
        total: 0,
    })

    const { register, handleSubmit, formState: { errors }, reset } =
        useForm<{ rejectedReason: string }>({ resolver: yupResolver(schema) })

    const approveMutation = useApproveGroup()
    const rejectMutation = useRejectGroup()

    const queryClient = useQueryClient()

    const { data } = useGetGroupsList(pagination)

    useEffect(() => {
        if (!data) return
        const { page, perPage, total } = data._metadata.pagination
        const start = (page - 1) * perPage + 1
        const end = Math.min(start + perPage - 1, total)
        setPaginationOptions({
            start,
            end,
            total,
        })
    }, [data])

    useEffect(() => {
        if (!groupIdForApprove) return
        setShowApproveModal(true)
    }, [groupIdForApprove])

    useEffect(() => {
        if (!groupIdForReject) return
        setShowRejectModal(true)
    }, [groupIdForReject])

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

    const setGroupIdAndOpenApproveModal = (groupId: string) => {
        setGroupIdForApprove(groupId)
    }

    const setGroupIdAndOpenRejectModal = (groupId: string) => {
        setGroupIdForReject(groupId)
    }

    const closeUpdateModal = () => {
        setGroupIdForApprove('')
        setGroupIdForReject('')
        setShowApproveModal(false)
        setShowRejectModal(false)
        reset()
    }

    const handleApproveSubmit = () => {
        approveMutation.mutate(
            {
                _id: groupIdForApprove,
            },
            {
                onSuccess: () => {
                    toast.success('Group updated successfully')
                    closeUpdateModal()
                    queryClient.invalidateQueries(APPROVALS_MUTATION_KEY)
                },
            }
        )
    }

    const handleRejectSubmit = ({ rejectedReason }: { rejectedReason: string }) => {
        rejectMutation.mutate(
            {
                _id: groupIdForReject,
                rejectedReason,
            },
            {
                onSuccess: () => {
                    toast.success('Group updated successfully')
                    closeUpdateModal()
                    queryClient.invalidateQueries(APPROVALS_MUTATION_KEY)
                },
            }
        )
    }

    return !data ? (
        <LoadingPage />
    ) : (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">
                General Settings
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <div className="hidden mx-auto md:block text-slate-500">
                        Showing {paginationOptions.start} to{' '}
                        {paginationOptions.end} of {paginationOptions.total}{' '}
                        entries
                    </div>
                    {/* <div>
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit(submitCountrySearch)}
                        >
                            <Controller
                                name="status"
                                control={control}
                                render={({ field }) => (
                                    <FormSelect id="status" {...field}>
                                        <option value=''>All Countries</option>
                                        {_.map(
                                            countryData?.data,
                                            ({ _id, name }) => (
                                                <option key={_id} value={_id}>
                                                    {name}
                                                </option>
                                            )
                                        )}
                                    </FormSelect>
                                )}
                            />
                        </form>
                    </div> */}
                </div>
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    NAME
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    TYPE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    OWNER
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data.data.map((group: Group, key: number) => (
                                <Table.Tr key={key} className="intro-x">
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {group.name}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {group.type}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {group.owner.username + ' : ' + group.owner.firstName + ' ' + group.owner.lastName}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            <Button
                                                className="flex items-center mr-3"
                                                onClick={() =>
                                                    setGroupIdAndOpenApproveModal(
                                                        group._id
                                                    )
                                                }
                                            >
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Approve
                                            </Button>
                                            <Button
                                                className="flex items-center mr-3"
                                                onClick={() =>
                                                    setGroupIdAndOpenRejectModal(
                                                        group._id,
                                                    )
                                                }
                                            >
                                                <Lucide
                                                    icon="XSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Reject
                                            </Button>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <Pagination.Link onClick={decreasePageNumber}>
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Pagination.Link>
                        {_.range(
                            1,
                            data._metadata.pagination.totalPage + 1
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
                    </Pagination>
                </div>
            </div>
            {/* END: Pagination */}
            {/* BEGIN: Approve Modal */}
            <Dialog
                size="sm"
                open={showApproveModal}
                onClose={() => {
                    closeUpdateModal()
                }}
            >
                <Dialog.Panel className="p-5 text-center">
                    <div className="p-5 text-center">
                        <Lucide
                            icon="HelpCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Are you sure you want to approve this group?
                        </div>
                    </div>
                    <div className="px-7 pb-8 text-center">
                        <Button
                            type="button"
                            variant="success"
                            className="w-24"
                            onClick={() => handleApproveSubmit()}
                        >
                            Yes
                        </Button>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                                closeUpdateModal()
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>

                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Approve Modal */}
            {/* BEGIN: Reject Modal */}
            <Dialog
                size="sm"
                open={showRejectModal}
                onClose={() => {
                    closeUpdateModal()
                }}
            >
                <Dialog.Panel className="p-5 text-center">
                    <div className="p-5 text-center">
                        <Lucide
                            icon="HelpCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Are you sure you want to reject this group?
                        </div>
                    </div>

                    <div className="px-7 pb-8 text-center">
                        <form
                            onSubmit={handleSubmit(handleRejectSubmit)}
                            className="grid grid-cols-12 gap-4 gap-y-2"
                        >
                            <div className="col-span-12">
                                <FormLabel>Reject Reason</FormLabel>
                                <FormTextarea
                                    {...register('rejectedReason')}
                                />
                                {errors.rejectedReason?.message && (
                                    <div className="mt-2 text-danger">
                                        {errors.rejectedReason?.message}
                                    </div>
                                )}
                            </div>
                            <div className="col-span-12 flex justify-center gap-5 mt-10">
                                <Button
                                    type="submit"
                                    variant="success"
                                    className="w-24"
                                >
                                    Confirm
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => {
                                        closeUpdateModal()
                                    }}
                                    className="w-24 mr-1"
                                >
                                    Cancel
                                </Button>

                            </div>
                        </form>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Reject Modal */}
        </>
    )
}

export default Main
