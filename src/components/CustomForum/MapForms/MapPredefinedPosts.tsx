import React from 'react'
import { toast } from 'react-toastify'
import {
    PredefinedPosts,
    Setting,
    TPredefinedPosts,
} from '../../../services/settings/types'
import { useForm, Controller } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { useUpdateSetting } from '../../../hooks/settings'
import { SETTINGS_MUTATION_KEY } from '../../../services/settings'
import { ENUM_SETTING_DATA_TYPE } from '../../../services/settings/enums'
import Button from '../../../base-components/Button'
import { FormSwitch, FormTextarea } from '../../../base-components/Form'
import Table from '../../../base-components/Table'
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

    const [predefinedPostsList, setPredefinedPostsList] = React.useState<
        PredefinedPosts[]
    >(setting.value.predefinedPosts)

    const [showConfirm, setShowConfirm] = React.useState(false)

    const queryClient = useQueryClient()
    const mutation = useUpdateSetting()

    const handleAddingPost = () => {
        const newPost = {
            post: '',
            isActive: false,
        }
        setPredefinedPostsList([...predefinedPostsList, newPost])
    }

    const handleRemovePost = (index: number) => {
        const newPredefinedList = [...predefinedPostsList]
        newPredefinedList.splice(index, 1)
        setPredefinedPostsList(newPredefinedList)
    }

    const onSubmit = (data: any) => {
        const predefinedPosts: TPredefinedPosts = {
            type: 'predefinedPosts',
            predefinedPosts: predefinedPostsList.map(
                (item: PredefinedPosts, index: number) => ({
                    post: data[`post${index}`],
                    isActive: data[`isActive${index}`],
                })
            ),
        }
        mutation.mutate(
            {
                value: JSON.stringify(predefinedPosts),
                id: setting._id,
                type: ENUM_SETTING_DATA_TYPE.ARRAY_OF_MAP,
                description: setting.description,
            },
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
            <Button
                className="w-48"
                variant="primary"
                onClick={handleAddingPost}
            >
                New Predefined Post
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
                                    Predefined Post
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Is Active ?
                                </Table.Th>
                                <Table.Th className="whitespace-nowrap text-center">
                                    Actions
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {predefinedPostsList?.map(
                                (
                                    predefinedPost: PredefinedPosts,
                                    index: number
                                ) => (
                                    <Table.Tr>
                                        <Table.Td className="whitespace-nowrap text-center">
                                            <Controller
                                                name={`post${index}`}
                                                control={control}
                                                defaultValue={
                                                    predefinedPost.post
                                                }
                                                rules={{
                                                    required:
                                                        'Post is required',
                                                }}
                                                render={({ field }) => (
                                                    <FormTextarea
                                                        {...field}
                                                        className="w-60"
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
                                                name={`isActive${index}`}
                                                control={control}
                                                defaultValue={
                                                    predefinedPost.isActive
                                                }
                                                render={({ field }) => (
                                                    <FormSwitch {...field}>
                                                        <FormSwitch.Input
                                                            defaultChecked={
                                                                !!predefinedPost.isActive
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
                                                    handleRemovePost(index)
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
