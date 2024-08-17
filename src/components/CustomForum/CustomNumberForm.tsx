import React from 'react'
import { toast } from 'react-toastify'
import { Setting, UpdateSettingBody } from '../../services/settings/types'
import { ENUM_SETTING_DATA_TYPE } from '../../services/settings/enums'
import {
    FormInput,
    FormLabel,
    FormSelect,
    FormTextarea,
} from '../../base-components/Form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { Dialog } from '../../base-components/Headless'
import Button from '../../base-components/Button'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../hooks/settings'
import { SETTINGS_MUTATION_KEY } from '../../services/settings'
import Lucide from '../../base-components/Lucide'
import _ from 'lodash'

type CustomValuesProps = {
    setting: Setting
    close: () => void
}

const schema = yup
    .object<UpdateSettingBody>({
        value: yup
            .number()
            .typeError('Value must be a number')
            .min(0, 'Value must be greater than or equal 0')
            .integer('Value must be non decimal')
            .required('Enter the value'),
        description: yup.string().required('Enter the description'),
    })
    .required()

function Main({ setting, close }: CustomValuesProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateSettingBody>({
        defaultValues: {
            value: setting.value as number,
            description: setting.description,
        },
        resolver: yupResolver(schema),
        mode: 'onChange',
    })

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const onSubmit = (data: any) => {
        mutation.mutate(
            { ...data, id: setting._id, type: ENUM_SETTING_DATA_TYPE.NUMBER },
            {
                onSuccess: () => {
                    toast.success('Setting updated successfully')
                    close()
                    queryClient.invalidateQueries(SETTINGS_MUTATION_KEY)
                },
            }
        )
    }

    return (
        <>
            <Dialog.Title>
                <h2 className="mr-auto text-base font-medium">
                    Update {setting.name}
                </h2>
            </Dialog.Title>

            <Dialog.Description className="grid grid-cols-12 gap-4 gap-y-3">
                <form onSubmit={handleSubmit(onSubmit)} className="col-span-12">
                    <div className="col-span-12 sm:col-span-6 my-2">
                        <FormLabel htmlFor="name" className="mt-2">
                            Name
                        </FormLabel>
                        <FormInput
                            id="name"
                            type="text"
                            disabled
                            value={setting.name}
                        />
                    </div>
                    <div className="col-span-12 sm:col-span-6 my-2">
                        <FormLabel htmlFor="description" className="mt-2">
                            Description
                        </FormLabel>
                        <FormTextarea
                            id="description"
                            {...register('description')}
                        />
                        {errors.description?.message && (
                            <div className="mt-2 text-danger">
                                {errors.description?.message}
                            </div>
                        )}
                    </div>
                    <div className="col-span-12 sm:col-span-6 my-2">
                        <FormLabel htmlFor="type" className="mt-2">
                            Type
                        </FormLabel>
                        <FormSelect id="type" disabled>
                            <option value={ENUM_SETTING_DATA_TYPE.NUMBER}>
                                {ENUM_SETTING_DATA_TYPE.NUMBER}
                            </option>
                        </FormSelect>
                    </div>
                    <div className="col-span-12 sm:col-span-6 my-2">
                        <FormLabel htmlFor="value" className="mt-2">
                            Value
                        </FormLabel>
                        <FormInput type="number" {...register('value')} />
                        {errors.value?.message && (
                            <div className="mt-2 text-danger">
                                {errors.value?.message.toString()}
                            </div>
                        )}
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
            </Dialog.Description>
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
