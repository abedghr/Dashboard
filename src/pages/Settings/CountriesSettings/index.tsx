import _ from 'lodash'
import { useEffect, useRef, useState } from 'react'
import Button from '../../../base-components/Button'
import CustomValues from '../../../components/CustomValues'
import Pagination from '../../../base-components/Pagination'
import Lucide from '../../../base-components/Lucide'
import { Dialog } from '../../../base-components/Headless'
import Table from '../../../base-components/Table'
import { useGetSettingsList } from '../../../hooks/settings'
import {
    paginationDefaultValue,
    settingsCountryPaginationDefaultValue,
} from '../../../services/settings/types'
import LoadingPage from '../../../components/Loading'
import { Setting } from '../../../services/settings/types'
import CustomForm from '../../../components/CustomForum'
import { useForm, Controller } from 'react-hook-form'
import { FormSelect } from '../../../base-components/Form'
import { useGetCountriesList } from '../../../hooks/countries'

function Main() {
    const [updateModal, setUpdateModal] = useState(false)
    const [settingId, setSettingId] = useState<string>('')
    const [pagination, setPagination] = useState(
        settingsCountryPaginationDefaultValue
    )
    const [paginationOptions, setPaginationOptions] = useState({
        start: 0,
        end: 0,
        total: 0,
    })

    const formRef = useRef<HTMLFormElement>(null)

    const { handleSubmit, control, watch } = useForm<{ country: string }>({
        defaultValues: {
            country: '',
        },
    })

    const search = watch('country')

    const { data: settingsData, isLoading: isLoadingSettings } =
        useGetSettingsList(pagination)
    const { data: countryData, isLoading: isLoadingCountries } =
        useGetCountriesList(paginationDefaultValue)

    useEffect(() => {
        if (!settingsData) return
        const { page, perPage, total } = settingsData._metadata.pagination
        const start = (page - 1) * perPage + 1
        const end = Math.min(start + perPage - 1, total)
        setPaginationOptions({
            start,
            end,
            total,
        })
    }, [settingsData, countryData])

    useEffect(() => {
        formRef.current?.dispatchEvent(
            new Event('submit', { cancelable: true, bubbles: true })
        )
    }, [search])

    const increasePageNumber = () => {
        if (pagination.page === settingsData?._metadata.pagination.totalPage)
            return
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

    const setSettingIdAndOpenUpdateModal = (settingId: string) => {
        setSettingId(settingId)
        setUpdateModal(true)
    }

    const closeUpdateModal = () => {
        setUpdateModal(false)
    }

    const submitCountrySearch = ({ country }: { country: string }) => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
            search: `country:${country}`,
        }))
    }

    const checkIfSettingActive = (setting: Setting): boolean => {
        if (setting.name === 'servicePriceOVOCommissionPercentage') {
            const check: boolean = settingsData?.data.find((setting) => setting.name === 'activateOVOCommission')?.value
            return check
        }
        if (setting.name === 'SP_waitingTime') {
            const check: boolean = settingsData?.data.find((setting) => setting.name === 'SP_activateWaitingTime')?.value
            return check
        }
        if (setting.name === 'servicePriceVATPercentage') {
            const check: boolean = settingsData?.data.find((setting) => setting.name === 'activateServicePriceVAT')?.value
            return check
        }
        return true;
    }

    return isLoadingSettings && isLoadingCountries ? (
        <LoadingPage />
    ) : (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">
                Countries Settings
            </h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <div className="hidden mx-auto md:block text-slate-500">
                        Showing {paginationOptions.start} to{' '}
                        {paginationOptions.end} of {paginationOptions.total}{' '}
                        entries
                    </div>
                    <div>
                        <form
                            ref={formRef}
                            onSubmit={handleSubmit(submitCountrySearch)}
                        >
                            <Controller
                                name="country"
                                control={control}
                                render={({ field }) => (
                                    <FormSelect id="country" {...field}>
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
                    </div>
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
                                    DESCRIPTION
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    VALUE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    Country
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {settingsData?.data.map(
                                (setting: Setting, key: number) => (
                                    <Table.Tr key={key} className="intro-x">
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            {setting.name}
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                {setting.description}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <CustomValues setting={setting} />
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            {setting.country
                                                ? setting.country.name
                                                : 'All'}
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    className="flex items-center mr-3"
                                                    disabled={!checkIfSettingActive(setting)}
                                                    onClick={() =>
                                                        setSettingIdAndOpenUpdateModal(
                                                            setting._id
                                                        )
                                                    }
                                                >
                                                    <Lucide
                                                        icon="CheckSquare"
                                                        className="w-4 h-4 mr-1"
                                                    />
                                                    Edit
                                                </Button>
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                )
                            )}
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
                            settingsData?._metadata.pagination.totalPage!! + 1
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
            {/* BEGIN: Update Modal */}
            <Dialog
                open={updateModal}
                size="xl"
                onClose={() => {
                    setUpdateModal(false)
                }}
            >
                <Dialog.Panel>
                    <CustomForm
                        settingId={settingId}
                        close={closeUpdateModal}
                    />
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
        </>
    )
}

export default Main
