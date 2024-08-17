import React, { useEffect } from 'react'
import _ from 'lodash'
import { Controller, useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import Button from '../../../base-components/Button'
import LoadingPage from '../../Loading'
import Table from '../../../base-components/Table'
import Lucide from '../../../base-components/Lucide'
import {
    useCreateServiceCatalogue,
    useGetServiceCatalogueList,
    useUpdateServiceCatalogue,
} from '../../../hooks/service-catalogue'
import {
    CreateServiceCatalogueBody,
    ServiceCatalogue,
} from '../../../services/serviceCatalgue/types'
import { FormInput, FormLabel, FormSelect } from '../../../base-components/Form'
import { Setting } from '../../../services/settings/types'
import { GROUP_TARGET_AUDIENCE } from '../../../services/approval/enums'
import { SERVICE_CATALOGUE_MUTATION_KEY } from '../../../services/serviceCatalgue'
import { toast } from 'react-toastify'
import { ENUM_TARGET_AUDIENCE } from '../../../services/serviceCatalgue/enums'
import { Dialog } from '../../../base-components/Headless'

type CustomValuesProps = {
    setting: Setting
    close: () => void
}

function Main({ setting, close }: CustomValuesProps) {
    const {
        handleSubmit,
        formState: { errors },
        control,
        register,
        setValue,
        reset,
    } = useForm<CreateServiceCatalogueBody>({
        mode: 'onChange',
    })

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()

    const createMutation = useCreateServiceCatalogue()
    const updateMutation = useUpdateServiceCatalogue()

    const { data, isFetching } = useGetServiceCatalogueList()

    const onSubmitCreate = (body: CreateServiceCatalogueBody) => {
        const bodyMutated: CreateServiceCatalogueBody = {
            ...body,
            country: setting.country,
        };
        createMutation.mutate(bodyMutated, {
            onSuccess: () => {
                queryClient.invalidateQueries(SERVICE_CATALOGUE_MUTATION_KEY)
                toast.success('Service Catalogue Created Successfully')
                reset();
                close();
            },
        })
    }

    useEffect(()=>{
        setValue("targetAudience",ENUM_TARGET_AUDIENCE.MALE)
    },[])

    return isFetching ? (
        <LoadingPage />
    ) : (
        <>
            <form
                className="col-span-12"
                onSubmit={handleSubmit(onSubmitCreate)}
            >
                <div className="col-span-12 flex flex-row gap-3">
                    <div>
                        <FormLabel>English Title</FormLabel>
                        <FormInput
                            type="text"
                            placeholder="Service Catalogue Name"
                            {...register('title',{
                                required: 'English title is required'
                            })}
                        />
                        {errors.title?.message && (
                            <div className="mt-2 text-danger">
                                {errors.title?.message?.toString()}
                            </div>
                        )}
                    </div>
                    <div>
                        <FormLabel>Arabic Title</FormLabel>
                        <FormInput
                            type="text"
                            placeholder="Service Catalogue Name in Arabic"
                            {...register('titleAr',{
                                required: 'Arabic title is required'
                            })}
                        />
                        {errors.title?.message && (
                            <div className="mt-2 text-danger">
                                {errors.title?.message?.toString()}
                            </div>
                        )}
                    </div>
                    <div>
                        <FormLabel>Target Audience</FormLabel>
                        <Controller
                            name="targetAudience"
                            control={control}
                            render={({ field }) => (
                                <FormSelect
                                    id="audience"
                                    placeholder="Target Audiance"
                                    {...field}
                                >
                                    {_.map(
                                        GROUP_TARGET_AUDIENCE,
                                        (value, key) => (
                                            <option value={value}>{key}</option>
                                        )
                                    )}
                                </FormSelect>
                            )}
                        />
                    </div>
                </div>
                <Button className="w-32 mt-3" variant="primary" type="submit">
                    Add Catalogue
                </Button>
            </form>

            <form className="min-h-fit overflow-x-auto w-full col-span-12">
                <div className="my-2 overflow-x-auto overflow-y-auto h-80">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Title
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Title Arabic
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Target Audience
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Active
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Action
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {data?.data.map(
                                (serviceCatalogue: ServiceCatalogue) => (
                                    <Table.Tr>
                                        <Table.Td className="whitespace-nowrap">
                                            {serviceCatalogue.title}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            {serviceCatalogue.titleAr}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            {serviceCatalogue.targetAudience}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            {serviceCatalogue.isActive
                                                ? 'Yes'
                                                : 'No'}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    className="flex items-center mr-3"
                                                    onClick={() =>
                                                        console.log(
                                                            serviceCatalogue._id
                                                        )
                                                    }
                                                >
                                                    <Lucide
                                                        icon="Edit2"
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
                <Button
                    type="button"
                    onClick={() => {
                        if (_.isEmpty(errors)) setShowConfirm(true)
                    }}
                    variant="primary"
                    className="w-20"
                >
                    Update
                </Button>
            </form>
            {/* BEGIN: Overlapping Modal Content */}
            {/* <Dialog
                open={showConfirm}
                onClose={() => {
                    setShowConfirm(false)
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
                            Are you sure you want to apply this change?
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={() => {
                                setShowConfirm(false)
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="success"
                            className="w-24"
                            onClick={() => handleSubmit(onSubmit)()}
                        >
                            Update
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog> */}
            {/* END: Overlapping Modal Content */}
        </>
    )
}

export default Main
