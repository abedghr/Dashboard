import React from 'react'
import { toast } from 'react-toastify'
import { BookingType, Setting } from '../../../services/settings/types'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../../hooks/settings'
import { SETTINGS_MUTATION_KEY } from '../../../services/settings'
import { ENUM_SETTING_DATA_TYPE } from '../../../services/settings/enums'
import { TBookingType } from '../../../services/settings/types'
import Button from '../../../base-components/Button'
import { FormInput, FormSwitch } from '../../../base-components/Form'
import Table from '../../../base-components/Table'
import TomSelect from '../../../base-components/TomSelect'
import Lucide from '../../../base-components/Lucide'
import { Dialog } from '../../../base-components/Headless'
import _ from 'lodash'

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

    const [bookingTypesList, setBookingTypesList] = React.useState<
        BookingType[]
    >(setting.value.bookingTypes)

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const handleAddingBookingType = () => {
        const newBookingType = {
            name: '',
            allowedPaymentMethod: [],
            chargeIfAfterAllowedTime: false,
            chargeIfAmendAfterAllowedTime: false,
            priceIncrease: false,
        }
        setBookingTypesList([...bookingTypesList, newBookingType])
    }

    const handleRemoveBookingType = (index: number) => {
        const newBookingTypesList = [...bookingTypesList]
        newBookingTypesList.splice(index, 1)
        setBookingTypesList(newBookingTypesList)
    }

    const onSubmit = (data: any) => {
        const bookingType: TBookingType = {
            type: 'bookingTypes',
            bookingTypes: bookingTypesList.map(
                (item: BookingType, index: number) => ({
                    name: data[`name${index}`],
                    allowedPaymentMethod: data[`allowedPaymentMethod${index}`],
                    chargeIfAfterAllowedTime:
                        data[`chargeIfAfterAllowedTime${index}`],
                    chargeIfAmendAfterAllowedTime:
                        data[`chargeIfAmendAfterAllowedTime${index}`],
                    priceIncrease: data[`priceIncrease${index}`],
                })
            ),
        }
        mutation.mutate(
            {
                value: JSON.stringify(bookingType),
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
            <Button
                className="w-48"
                variant="primary"
                onClick={handleAddingBookingType}
            >
                New Booking Type
            </Button>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="min-h-fit overflow-x-auto w-full col-span-12"
            >
                <div className="my-2 overflow-x-auto overflow-y-auto h-80">
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Name
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Allowed Payment Methods
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Charge if cancelled after allowed time
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Charge if amend after allowed time
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Price Increase
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Actions
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {bookingTypesList?.map(
                                (bookingType: BookingType, index: number) => (
                                    <Table.Tr>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`name${index}`}
                                                control={control}
                                                defaultValue={bookingType.name}
                                                rules={{
                                                    required:
                                                        'Name is required',
                                                }}
                                                render={({ field }) => (
                                                    <FormInput
                                                        type="text"
                                                        {...field}
                                                        className="w-48"
                                                    />
                                                )}
                                            />
                                            {errors[`name${index}`]
                                                ?.message && (
                                                <div className="mt-2 text-danger">
                                                    {errors[
                                                        `name${index}`
                                                    ]?.message?.toString()}
                                                </div>
                                            )}
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`allowedPaymentMethod${index}`}
                                                control={control}
                                                defaultValue={
                                                    bookingType.allowedPaymentMethod
                                                }
                                                render={({
                                                    field: { value, onChange },
                                                }) => (
                                                    <TomSelect
                                                        value={value}
                                                        onChange={onChange}
                                                        multiple
                                                        options={{
                                                            placeholder:
                                                                'Select methods',
                                                        }}
                                                        className="w-72"
                                                    >
                                                        {bookingType.allowedPaymentMethod.map(
                                                            (item: string) => (
                                                                <option
                                                                    key={item}
                                                                    value={item}
                                                                >
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </TomSelect>
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`chargeIfAfterAllowedTime${index}`}
                                                control={control}
                                                defaultValue={
                                                    bookingType.chargeIfAfterAllowedTime
                                                }
                                                render={({ field }) => (
                                                    <FormSwitch {...field}>
                                                        <FormSwitch.Input
                                                            defaultChecked={
                                                                !!bookingType.chargeIfAfterAllowedTime
                                                            }
                                                            type="checkbox"
                                                        />
                                                    </FormSwitch>
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`chargeIfAmendAfterAllowedTime${index}`}
                                                control={control}
                                                defaultValue={
                                                    bookingType.chargeIfAmendAfterAllowedTime
                                                }
                                                render={({ field }) => (
                                                    <FormSwitch {...field}>
                                                        <FormSwitch.Input
                                                            defaultChecked={
                                                                !!bookingType.chargeIfAmendAfterAllowedTime
                                                            }
                                                            type="checkbox"
                                                        />
                                                    </FormSwitch>
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`priceIncrease${index}`}
                                                control={control}
                                                defaultValue={
                                                    bookingType.chargeIfAmendAfterAllowedTime
                                                }
                                                render={({ field }) => (
                                                    <FormSwitch {...field}>
                                                        <FormSwitch.Input
                                                            defaultChecked={
                                                                !!bookingType.priceIncrease
                                                            }
                                                            type="checkbox"
                                                        />
                                                    </FormSwitch>
                                                )}
                                            />
                                        </Table.Td>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Button
                                                onClick={() => {
                                                    handleRemoveBookingType(
                                                        index
                                                    )
                                                }}
                                                variant="danger"
                                            >
                                                <Lucide
                                                    icon="Trash"
                                                    className="w-4 h-4"
                                                />
                                            </Button>
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
