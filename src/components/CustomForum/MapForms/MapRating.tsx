import React from 'react'
import _ from 'lodash'
import { toast } from 'react-toastify'
import { Rating, Setting, TRatings } from '../../../services/settings/types'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../../hooks/settings'
import { SETTINGS_MUTATION_KEY } from '../../../services/settings'
import { ENUM_SETTING_DATA_TYPE } from '../../../services/settings/enums'
import Button from '../../../base-components/Button'
import { FormInput } from '../../../base-components/Form'
import Table from '../../../base-components/Table'
import Lucide from '../../../base-components/Lucide'
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
    } = useForm<any>({
        mode: 'onChange',
    })

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const onSubmit = (data: any) => {
        const ratingsObj: TRatings = {
            type: 'ratings',
            ratings: setting.value.ratings.map((item: Rating) => ({
                star: item.star,
                min: data[`min${item.star}`],
                max: data[`max${item.star}`],
            })),
        }
        mutation.mutate(
            {
                value: JSON.stringify(ratingsObj),
                id: setting._id,
                type: ENUM_SETTING_DATA_TYPE.ARRAY_OF_MAP,
                description: setting.description,
            },
            {
                onSuccess: () => {
                    toast.success('Successfully updated')
                    close()
                    queryClient.invalidateQueries(SETTINGS_MUTATION_KEY)
                },
            }
        )
    }
    return (
        <>
            <form className="min-h-fit overflow-x-auto w-full col-span-12">
                <div className="my-2 overflow-x-auto">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Star
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Minimum Points
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Maximum Points
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {setting.value.ratings?.map((rating: Rating) => (
                                <Table.Tr>
                                    <Table.Td className="whitespace-nowrap">
                                        <div className="flex flex-row justify-center">
                                            {_.range(rating.star).map(() => (
                                                <div>
                                                    <Lucide
                                                        icon="Star"
                                                        className="w-5 h-5"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="whitespace-nowrap text-center">
                                        <Controller
                                            name={`min${rating.star}`}
                                            control={control}
                                            defaultValue={rating.min}
                                            rules={{
                                                required:
                                                    'Minimum value is required',
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Minimum value can't be less than 0",
                                                },
                                                max: {
                                                    value: 100,
                                                    message:
                                                        "Minimum value can't be greater than 100",
                                                },
                                            }}
                                            render={({
                                                field: { value, onChange },
                                            }) => (
                                                <FormInput
                                                    type="number"
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                        {errors[`min${rating.star}`]
                                            ?.message && (
                                            <div className="mt-2 text-danger">
                                                {errors[
                                                    `min${rating.star}`
                                                ]?.message?.toString()}
                                            </div>
                                        )}
                                    </Table.Td>
                                    <Table.Td className="whitespace-nowrap text-center">
                                        <Controller
                                            name={`max${rating.star}`}
                                            control={control}
                                            rules={{
                                                required:
                                                    'Maximum value is required',
                                                min: {
                                                    value: 0,
                                                    message:
                                                        "Maximum value can't be less than 0",
                                                },
                                                max: {
                                                    value: 100,
                                                    message:
                                                        "Maximum value can't be greater than 100",
                                                },
                                            }}
                                            defaultValue={rating.max}
                                            render={({
                                                field: { value, onChange },
                                            }) => (
                                                <FormInput
                                                    type="number"
                                                    value={value}
                                                    onChange={onChange}
                                                />
                                            )}
                                        />
                                        {errors[`max${rating.star}`]
                                            ?.message && (
                                            <div className="mt-2 text-danger">
                                                {errors[
                                                    `max${rating.star}`
                                                ]?.message?.toString()}
                                            </div>
                                        )}
                                    </Table.Td>
                                </Table.Tr>
                            ))}
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
            <Dialog
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
            </Dialog>
            {/* END: Overlapping Modal Content */}
        </>
    )
}

export default Main
